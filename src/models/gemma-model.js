import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { BaseModel } from './base-model.js';

/**
 * Gemma model implementation using node-llama-cpp
 */
export class GemmaModel extends BaseModel {
  constructor(config = {}) {
    super();
    this.config = {
      modelPath: config.modelPath || path.join(process.cwd(), 'models/gemma-2b-it.Q4_K_M.gguf'),
      contextSize: 2048,
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 400,
      ...config
    };
    this.model = null;
    this.llama = null;
    this.context = null;
  }

  async initialize() {
    try {
      // Check if model file exists
      if (!fs.existsSync(this.config.modelPath)) {
        console.error(`Model file not found at ${this.config.modelPath}`);
        console.error('Please download the Gemma model and set the correct path.');
        console.error('You can download it from: https://huggingface.co/TheBloke/gemma-2b-it-GGUF');
        throw new Error(`Model file not found at ${this.config.modelPath}`);
      }

      // Import dynamically to avoid top-level await issues
      const { getLlama, LlamaChatSession } = await import('node-llama-cpp');
      
      // Initialize llama
      this.llama = await getLlama();
      
      // Load the model
      this.model = await this.llama.loadModel({
        modelPath: this.config.modelPath,
        contextSize: this.config.contextSize,
        gpuLayers: 0 // Run on CPU
      });
      
      // Create context
      this.context = await this.model.createContext();
      
      // Create chat session with Gemma's chat format
      this.session = new LlamaChatSession({
        contextSequence: this.context.getSequence(),
        template: "{prompt}"
      });
      
      console.log('Gemma model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemma model:', error);
      throw error;
    }
  }

  async generateText(prompt) {
    if (!this.session) {
      await this.initialize();
    }

    try {
      // Using Gemma's chat format
      const formattedPrompt = `<start_of_turn>user
${prompt}<end_of_turn>
<start_of_turn>model`;
      
      const response = await this.session.prompt(formattedPrompt);
      
      // Clean up any response formatting tags
      let cleanedResponse = response.trim();
      if (cleanedResponse.endsWith('<end_of_turn>')) {
        cleanedResponse = cleanedResponse.slice(0, -14).trim();
      }
      
      return cleanedResponse;
    } catch (error) {
      console.error('Error generating text with Gemma:', error);
      return 'Error generating text. Please try again.';
    }
  }

  async cleanup() {
    // No explicit cleanup required
    this.session = null;
    this.context = null;
    this.model = null;
    this.llama = null;
  }
}