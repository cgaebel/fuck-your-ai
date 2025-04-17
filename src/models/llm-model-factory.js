import { GgufModel } from './gguf-model.js';
import config from '../config.js';

export class LlmModelFactory {
  static createModel() {
    console.log(`Creating GGUF model instance`);
    
    // Create a GGUF model instance with the configuration from config.js
    return new GgufModel({
      ...config.model.parameters,
      modelPath: config.model.paths.gguf,
      // Ensure critical defaults are set if not in config
      contextSize: config.model.parameters.contextSize || 2048,
      gpuLayers: config.model.parameters.gpuLayers || 0,
      modelParams: config.model.parameters.modelParams || {}
    });
  }
}