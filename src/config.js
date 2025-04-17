/**
 * Application configuration
 */
require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  
  // Model configuration
  model: {
    type: process.env.MODEL_TYPE || 'mock', // Default to mock for easy development
    paths: {
      tinyllama: process.env.TINYLLAMA_MODEL_PATH,
      phi2: process.env.PHI2_MODEL_PATH,
      gemma: process.env.GEMMA_MODEL_PATH,
    },
    parameters: {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.MODEL_MAX_TOKENS || '400'),
      topP: parseFloat(process.env.MODEL_TOP_P || '0.9'),
    }
  }
};
