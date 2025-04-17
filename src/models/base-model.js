/**
 * Base class for LLM implementations
 */
class BaseModel {
  constructor() {
    if (this.constructor === BaseModel) {
      throw new Error('BaseModel is an abstract class and cannot be instantiated directly');
    }
  }

  /**
   * Initialize the model
   */
  async initialize() {
    throw new Error('Method initialize() must be implemented by subclass');
  }

  /**
   * Generate text based on a prompt
   * @param {string} prompt - The input prompt
   * @returns {Promise<string>} - The generated text
   */
  async generateText(prompt) {
    throw new Error('Method generateText() must be implemented by subclass');
  }

  /**
   * Clean up resources used by the model
   */
  async cleanup() {
    throw new Error('Method cleanup() must be implemented by subclass');
  }
}

module.exports = { BaseModel };
