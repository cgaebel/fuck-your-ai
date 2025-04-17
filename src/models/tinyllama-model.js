import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { BaseModel } from './base-model.js';

/**
 * TinyLlama model implementation using node-llama-cpp
 */
export class TinyLlamaModel extends BaseModel {
  constructor(config = {}) {
    super();
    this.config = {
      modelPath: config.modelPath || path.join(process.cwd(), 'models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf'),
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
        console.error('Please download the TinyLlama model and set the correct path.');
        console.error('You can download it from: https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF');
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
      
      // Create chat session
      this.session = new LlamaChatSession({
        contextSequence: this.context.getSequence()
      });
      
      console.log('TinyLlama model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TinyLlama model:', error);
      throw error;
    }
  }

  async generateText(prompt) {
    if (!this.session) {
      await this.initialize();
    }

    try {
      const response = await this.session.prompt(prompt);
      return response.trim();
    } catch (error) {
      console.error('Error generating text with TinyLlama:', error);
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