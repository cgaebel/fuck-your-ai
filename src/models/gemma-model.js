const { BaseModel } = require('./base-model');
const { MockModel } = require('./mock-model');
const path = require('path');
const fs = require('fs');

/**
 * Gemma model implementation (simulated with MockModel)
 */
class GemmaModel extends BaseModel {
  constructor(config = {}) {
    super();
    this.config = {
      modelPath: process.env.GEMMA_MODEL_PATH || path.join(__dirname, '../../models/gemma-2b-it.Q4_K_M.gguf'),
      contextSize: 2048,
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 400,
      ...config
    };
    
    // Using mock model since we're having issues with node-llama-cpp
    this.mockModel = new MockModel({ delay: 700 });
    console.log('NOTE: Using MockModel to simulate Gemma due to compatibility issues');
  }

  async initialize() {
    try {
      // Just check if model file exists but don't load it
      if (!fs.existsSync(this.config.modelPath)) {
        console.warn(`Model file not found at ${this.config.modelPath}, using mock responses`);
      }
      
      await this.mockModel.initialize();
      console.log('Gemma (simulated) initialized successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to initialize Gemma simulation:', error);
      throw error;
    }
  }

  async generateText(prompt) {
    try {
      return await this.mockModel.generateText(prompt);
    } catch (error) {
      console.error('Error generating text with Gemma simulation:', error);
      return 'Error generating text. Please try again.';
    }
  }

  async cleanup() {
    await this.mockModel.cleanup();
  }
}

module.exports = { GemmaModel };