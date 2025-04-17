// Test file for node-llama-cpp with updated API
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Node version:', process.version);
console.log('Testing node-llama-cpp compatibility');

// Helper function to get the model path
const getModelPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '../models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf');
};

// Try importing the package
try {
  console.log('Trying to import node-llama-cpp');
  
  // Using the new API format
  const { getLlama, LlamaChatSession } = await import('node-llama-cpp');
  console.log('Successfully imported node-llama-cpp modules');
  
  // Try creating a model instance
  const modelPath = getModelPath();
  console.log('Model path:', modelPath);
  console.log('Model exists:', fs.existsSync(modelPath));
  
  if (fs.existsSync(modelPath)) {
    console.log('Attempting to create model instance...');
    try {
      // Initialize llama
      const llama = await getLlama();
      console.log('Got llama instance');
      
      // Load the model
      const model = await llama.loadModel({
        modelPath,
        contextSize: 2048,
        gpuLayers: 0  // Run on CPU
      });
      console.log('Model loaded successfully!');
      
      // Create context
      console.log('Creating context...');
      const context = await model.createContext();
      console.log('Context created successfully');
      
      // Create chat session
      const session = new LlamaChatSession({
        contextSequence: context.getSequence()
      });
      console.log('Chat session created');
      
      // Generate text
      console.log('Testing text generation...');
      const response = await session.prompt('Write a short sentence about cats.');
      console.log('Generated text:', response);
      
      console.log('Test completed successfully!');
    } catch (modelError) {
      console.error('Error using model:', modelError.message);
      console.error(modelError.stack);
    }
  } else {
    console.log('Model file not found, skipping model creation test');
  }
  
} catch (error) {
  console.error('Error with node-llama-cpp:', error.message);
  console.error(error.stack);
}