import fs from 'fs';
import path from 'path';
import { BaseModel } from './base-model.js';

/**
 * Generic GGUF model implementation using node-llama-cpp
 * Allows easy customization of any GGUF model
 */
export class GgufModel extends BaseModel {
  constructor(config = {}) {
    super();
    
    // Default configuration
    this.config = {
      modelPath: config.modelPath || path.join(process.cwd(), 'models/model.gguf'),
      contextSize: config.contextSize || 2048,
      temperature: config.temperature || 0.7,
      topP: config.topP || 0.9,
      maxTokens: config.maxTokens || 400,
      gpuLayers: config.gpuLayers || 0,
      
      // Template configuration for different model types
      template: config.template || "{prompt}",
      
      // Optional chat template format (for models that use specific chat formats)
      chatFormat: config.chatFormat || null,
      
      // Optional model-specific parameters
      modelParams: config.modelParams || {}
    };
    
    this.model = null;
    this.llama = null;
    this.context = null;
    this.session = null;
  }

  async initialize() {
    try {
      // Check if model file exists
      if (!fs.existsSync(this.config.modelPath)) {
        console.error(`Model file not found at ${this.config.modelPath}`);
        console.error('Please download a GGUF model and set the correct path in your .env file');
        console.error('Recommended: Download TinyLlama from https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF');
        console.error('See models/README.md for detailed instructions');
        throw new Error(`Model file not found at ${this.config.modelPath}`);
      }

      // Import dynamically to avoid top-level await issues
      const { getLlama, LlamaChatSession } = await import('node-llama-cpp');
      
      // Initialize llama
      this.llama = await getLlama();
      
      // Load the model with custom parameters
      this.model = await this.llama.loadModel({
        modelPath: this.config.modelPath,
        contextSize: this.config.contextSize,
        gpuLayers: this.config.gpuLayers,
        ...this.config.modelParams
      });
      
      // Create context
      this.context = await this.model.createContext();
      
      // Create chat session with custom template
      this.session = new LlamaChatSession({
        contextSequence: this.context.getSequence(),
        template: this.config.template
      });
      
      console.log(`GGUF model initialized successfully: ${path.basename(this.config.modelPath)}`);
      console.log(`Using chat format: ${this.config.chatFormat || 'raw (no format)'}`);
    } catch (error) {
      console.error(`Failed to initialize GGUF model: ${error.message}`);
      throw error;
    }
  }

  async generateText(prompt) {
    if (!this.session) {
      await this.initialize();
    }

    try {
      // Apply chat format if specified
      let formattedPrompt = prompt;
      
      if (this.config.chatFormat) {
        switch (this.config.chatFormat.toLowerCase()) {
          case 'gemma':
            formattedPrompt = `<start_of_turn>user\n${prompt}<end_of_turn>\n<start_of_turn>model`;
            break;
          case 'llama':
            formattedPrompt = `<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`;
            break;
          case 'mistral':
            formattedPrompt = `[INST] ${prompt} [/INST]`;
            break;
          case 'chatgpt':
          case 'openai':
            formattedPrompt = `USER: ${prompt}\nASSISTANT:`;
            break;
          case 'alpaca':
            formattedPrompt = `### Instruction:\n${prompt}\n\n### Response:`;
            break;
          case 'vicuna':
            formattedPrompt = `USER: ${prompt}\n\nASSISTANT:`;
            break;
          case 'chatml':
            formattedPrompt = `<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant`;
            break;
          case 'zephyr':
            formattedPrompt = `<|user|>\n${prompt}<|endoftext|>\n<|assistant|>`;
            break;
          // Add more chat formats as needed
          default:
            // Use raw prompt if format is not recognized
            console.warn(`Unknown chat format: ${this.config.chatFormat}. Using raw prompt.`);
            break;
        }
      }
      
      const response = await this.session.prompt(formattedPrompt, {
        temperature: this.config.temperature,
        topP: this.config.topP,
        maxTokens: this.config.maxTokens
      });
      
      // Clean up response based on chat format
      let cleanedResponse = response.trim();
      
      if (this.config.chatFormat) {
        switch (this.config.chatFormat.toLowerCase()) {
          case 'gemma':
            if (cleanedResponse.endsWith('<end_of_turn>')) {
              cleanedResponse = cleanedResponse.slice(0, -14).trim();
            }
            break;
          case 'llama':
          case 'chatml':
            if (cleanedResponse.endsWith('<|im_end|>')) {
              cleanedResponse = cleanedResponse.slice(0, -10).trim();
            }
            break;
          case 'zephyr':
            if (cleanedResponse.endsWith('<|endoftext|>')) {
              cleanedResponse = cleanedResponse.slice(0, -13).trim();
            }
            break;
          default:
            // No special cleanup for other formats
            break;
        }
      }
      
      return cleanedResponse;
    } catch (error) {
      console.error('Error generating text with GGUF model:', error);
      return 'Error generating text. Please try again.';
    }
  }

  async cleanup() {
    this.session = null;
    this.context = null;
    this.model = null;
    this.llama = null;
  }
}