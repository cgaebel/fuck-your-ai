const { TinyLlamaModel } = require('./tinyllama-model');
const { Phi2Model } = require('./phi2-model');
const { GemmaModel } = require('./gemma-model');
const { MockModel } = require('./mock-model');
const config = require('../config');

class LlmModelFactory {
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

module.exports = { LlmModelFactory };
