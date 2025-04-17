import { TinyLlamaModel } from './tinyllama-model.js';
import { Phi2Model } from './phi2-model.js';
import { GemmaModel } from './gemma-model.js';
import { MockModel } from './mock-model.js';
import config from '../config.js';

export class LlmModelFactory {
  static createModel(modelType = config.model.type) {
    console.log(`Creating model of type: ${modelType}`);
    
    switch (modelType.toLowerCase()) {
      case 'tinyllama':
        return new TinyLlamaModel({
          modelPath: config.model.paths.tinyllama,
          temperature: config.model.parameters.temperature,
          topP: config.model.parameters.topP,
          maxTokens: config.model.parameters.maxTokens
        });
      case 'phi2':
        return new Phi2Model({
          modelPath: config.model.paths.phi2,
          temperature: config.model.parameters.temperature,
          topP: config.model.parameters.topP,
          maxTokens: config.model.parameters.maxTokens
        });
      case 'gemma':
        return new GemmaModel({
          modelPath: config.model.paths.gemma,
          temperature: config.model.parameters.temperature,
          topP: config.model.parameters.topP,
          maxTokens: config.model.parameters.maxTokens
        });
      case 'mock':
        return new MockModel();
      // Add more model implementations here
      default:
        console.warn(`Model type '${modelType}' not recognized. Using Mock model as default.`);
        return new MockModel();
    }
  }
}