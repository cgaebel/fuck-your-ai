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

// Parse JSON config if provided (for advanced parameters)
const parseJsonConfig = (envVar, defaultValue = {}) => {
  if (!envVar) return defaultValue;
  try {
    return JSON.parse(envVar);
  } catch (e) {
    console.warn(`Failed to parse JSON config: ${e.message}`);
    return defaultValue;
  }
};

// Default to TinyLlama if no model is specified
const DEFAULT_MODEL_PATH = resolveProjectPath('models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf');

export default {
  // Server configuration
  port: process.env.PORT || 3000,
  
  // Model configuration
  model: {
    paths: {
      // Path for the GGUF model
      gguf: process.env.MODEL_PATH || DEFAULT_MODEL_PATH,
    },
    
    parameters: {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.2'),
      maxTokens: parseInt(process.env.MODEL_MAX_TOKENS || '600'),
      topP: parseFloat(process.env.MODEL_TOP_P || '0.7'),
      contextSize: parseInt(process.env.MODEL_CONTEXT_SIZE || '2048'),
      gpuLayers: parseInt(process.env.MODEL_GPU_LAYERS || '0'),
      
      // Chat format for specific models (gemma, llama, mistral, etc.)
      // Default to llama format for TinyLlama
      chatFormat: process.env.MODEL_CHAT_FORMAT || 'llama',
      
      // Template for prompt formatting
      template: process.env.MODEL_TEMPLATE || "{prompt}",
      
      // Advanced model parameters (JSON string in env)
      modelParams: parseJsonConfig(process.env.MODEL_PARAMS)
    }
  }
};