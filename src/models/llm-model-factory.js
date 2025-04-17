import { GgufModel } from './gguf-model.js';
import config from '../config.js';

export class LlmModelFactory {
  static createModel() {
    console.log(`Creating GGUF model instance`);
    
    // Create a GGUF model instance with the specified path and configuration
    return new GgufModel({
      modelPath: config.model.paths.gguf,
      contextSize: config.model.parameters.contextSize || 2048,
      temperature: config.model.parameters.temperature,
      topP: config.model.parameters.topP,
      maxTokens: config.model.parameters.maxTokens,
      gpuLayers: config.model.parameters.gpuLayers || 0,
      template: config.model.parameters.template,
      chatFormat: config.model.parameters.chatFormat,
      modelParams: config.model.parameters.modelParams || {}
    });
  }
}