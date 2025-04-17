/**
 * Application configuration
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve paths relative to project root
const resolveProjectPath = (relativePath) => {
  return path.join(__dirname, '..', relativePath);
};

export default {
  // Server configuration
  port: process.env.PORT || 3000,
  
  // Model configuration
  model: {
    type: process.env.MODEL_TYPE || 'mock', // Default to mock for easy development
    paths: {
      tinyllama: process.env.TINYLLAMA_MODEL_PATH || resolveProjectPath('models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf'),
      phi2: process.env.PHI2_MODEL_PATH || resolveProjectPath('models/phi-2.Q4_K_M.gguf'),
      gemma: process.env.GEMMA_MODEL_PATH || resolveProjectPath('models/gemma-2b-it.Q4_K_M.gguf'),
    },
    parameters: {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.MODEL_MAX_TOKENS || '400'),
      topP: parseFloat(process.env.MODEL_TOP_P || '0.9'),
    }
  }
};