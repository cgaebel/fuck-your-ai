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

  // Chat format templates for different model types
  static formatTemplates = {
    'gemma': {
      promptTemplate: (prompt) => `<start_of_turn>user\n${prompt}<end_of_turn>\n<start_of_turn>model`,
      responseCleanup: (resp) => resp.endsWith('<end_of_turn>') ? resp.slice(0, -14).trim() : resp
    },
    'llama': {
      promptTemplate: (prompt) => `<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`,
      responseCleanup: (resp) => resp.endsWith('<|im_end|>') ? resp.slice(0, -10).trim() : resp
    },
    'mistral': {
      promptTemplate: (prompt) => `[INST] ${prompt} [/INST]`
    },
    'chatgpt': {
      promptTemplate: (prompt) => `USER: ${prompt}\nASSISTANT:`
    },
    'openai': {
      promptTemplate: (prompt) => `USER: ${prompt}\nASSISTANT:`
    },
    'alpaca': {
      promptTemplate: (prompt) => `### Instruction:\n${prompt}\n\n### Response:`
    },
    'vicuna': {
      promptTemplate: (prompt) => `USER: ${prompt}\n\nASSISTANT:`
    },
    'chatml': {
      promptTemplate: (prompt) => `<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant`,
      responseCleanup: (resp) => resp.endsWith('<|im_end|>') ? resp.slice(0, -10).trim() : resp
    },
    'zephyr': {
      promptTemplate: (prompt) => `<|user|>\n${prompt}<|endoftext|>\n<|assistant|>`,
      responseCleanup: (resp) => resp.endsWith('<|endoftext|>') ? resp.slice(0, -13).trim() : resp
    }
  };

  async generateText(prompt) {
    if (!this.session) {
      await this.initialize();
    }

    try {
      // Get format configuration or use default
      const formatKey = this.config.chatFormat?.toLowerCase();
      const format = formatKey && GgufModel.formatTemplates[formatKey];
      
      // Format the prompt using the template
      const formattedPrompt = format ? 
        format.promptTemplate(prompt) : 
        prompt;
      
      // Generate response
      const response = await this.session.prompt(formattedPrompt, {
        temperature: this.config.temperature,
        topP: this.config.topP,
        maxTokens: this.config.maxTokens
      });
      
      // Clean up response if needed
      let cleanedResponse = response.trim();
      if (format && format.responseCleanup) {
        cleanedResponse = format.responseCleanup(cleanedResponse);
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