# LLM Models

This directory contains model implementations for different LLMs. By default, we use a mock model for development that doesn't require downloading any model files.

## Supported Models

### 1. Mock Model (Default)

A fake implementation that returns predefined responses with no external dependencies. Ideal for development and testing without downloading any model files.

### 2. TinyLlama (1.1B) - RECOMMENDED FOR FAST GENERATION

A small but capable model that's very fast to run on CPU.

1. Download the model from: https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF
2. Recommended version: `tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf` (smaller size, good quality)
3. Place in the `models/` directory or set `TINYLLAMA_MODEL_PATH` in your `.env` file
4. File size: ~600MB
5. Performance: Very fast on CPU, suitable for real-time web responses

### 3. Phi-2 (2.7B)

Microsoft's small model with surprisingly good performance.

1. Download from: https://huggingface.co/TheBloke/phi-2-GGUF
2. Recommended version: `phi-2.Q4_K_M.gguf` (balanced size and quality)
3. Place in the `models/` directory or set `PHI2_MODEL_PATH` in your `.env` file
4. File size: ~1.5GB
5. Performance: Good balance of speed and quality

### 4. Gemma (2B)

Google's lightweight model with excellent performance for its size.

1. Download from: https://huggingface.co/TheBloke/gemma-2b-it-GGUF
2. Recommended version: `gemma-2b-it.Q4_K_M.gguf` (balanced size and quality)
3. Place in the `models/` directory or set `GEMMA_MODEL_PATH` in your `.env` file
4. File size: ~1.2GB
5. Performance: Better quality than TinyLlama but slightly slower

## Model Comparison

| Model      | Size   | Disk Space | Speed    | Quality | Use Case                              |
|------------|--------|------------|----------|---------|---------------------------------------|
| TinyLlama  | 1.1B   | ~600MB     | Fastest  | Good    | Real-time responses, limited hardware |
| Gemma      | 2B     | ~1.2GB     | Fast     | Better  | General purpose with good quality     |
| Phi-2      | 2.7B   | ~1.5GB     | Moderate | Best    | Higher quality responses              |

## Adding New Models

To add a new model implementation:

1. Create a new file named `your-model-name.js`
2. Extend the `BaseModel` class
3. Implement the required methods: `initialize()`, `generateText()`, and `cleanup()`
4. Add the model to the `LlmModelFactory` class in `llm-model-factory.js`
5. Update the `.env.example` file with any new environment variables
