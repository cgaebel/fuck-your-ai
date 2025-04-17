# LLM Models

This directory contains the GGUF model implementation for running local LLMs.

## Using GGUF Models

The GGUF model implementation allows you to use any GGUF model with customized configuration:

```
# Set the path to your GGUF model file
MODEL_PATH=./models/your-model-name.gguf

# Configure model parameters
MODEL_TEMPERATURE=0.7
MODEL_MAX_TOKENS=400
MODEL_CONTEXT_SIZE=2048
MODEL_GPU_LAYERS=0

# Set chat format for specific model families (if needed)
# Options: gemma, llama, mistral, chatgpt, openai, alpaca, vicuna, chatml, zephyr
MODEL_CHAT_FORMAT=llama

# Custom prompt template (if needed)
MODEL_TEMPLATE={prompt}

# Advanced model parameters (JSON string)
MODEL_PARAMS={"f16_kv":true}
```

## Recommended GGUF Models

Here are some recommended models to try, sorted by size:

### Tiny Models (<1.5GB)
- **TinyLlama (1.1B)**: https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF
  - Recommended version: `tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf`
  - Chat format: `MODEL_CHAT_FORMAT=llama`
  - Size: ~600MB
  - Speed: Extremely fast, suitable for weak hardware

- **Gemma (2B)**: https://huggingface.co/TheBloke/gemma-2b-it-GGUF
  - Recommended version: `gemma-2b-it.Q4_K_M.gguf`
  - Chat format: `MODEL_CHAT_FORMAT=gemma`
  - Size: ~1.2GB
  - Speed: Very fast, good for limited hardware

- **Phi-2 (2.7B)**: https://huggingface.co/TheBloke/phi-2-GGUF
  - Recommended version: `phi-2.Q4_K_M.gguf`
  - Chat format: Leave empty
  - Size: ~1.5GB
  - Speed: Fast, good for general use

### Small Models (1.5GB - 3GB)
- **StableLM (3B)**: https://huggingface.co/TheBloke/stablelm-zephyr-3b-GGUF
  - Recommended version: `stablelm-zephyr-3b.Q4_K_M.gguf`
  - Chat format: `MODEL_CHAT_FORMAT=zephyr`
  - Size: ~1.7GB
  - Speed: Moderate

- **Neural Chat (3.1B)**: https://huggingface.co/TheBloke/neural-chat-7B-v3-1-GGUF
  - Recommended version: `neural-chat-7b-v3-1.Q4_K_M.gguf`
  - Chat format: `MODEL_CHAT_FORMAT=llama`
  - Size: ~2.5GB
  - Speed: Moderate

### Medium Models (3GB - 5GB)
- **Mistral (7B)**: https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF
  - Recommended version: `mistral-7b-instruct-v0.2.Q4_K_M.gguf`
  - Chat format: `MODEL_CHAT_FORMAT=mistral`
  - Size: ~4GB
  - Speed: Moderate, requires more RAM

### Larger Models (>5GB)
- **Llama 2 (13B)**: https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF
  - Recommended version: `llama-2-13b-chat.Q4_K_M.gguf`
  - Chat format: `MODEL_CHAT_FORMAT=llama`
  - Size: ~8GB
  - Speed: Slower, requires significant RAM

## Understanding GGUF File Naming

GGUF models typically come in multiple quantization versions, identified by suffixes in the filename:

| Suffix    | Precision                  | File Size | Inference Speed | Quality |
|-----------|----------------------------|-----------|-----------------|---------|  
| Q2_K      | 2-bit quantization         | Smallest  | Fastest         | Lowest  |
| Q4_K_M    | 4-bit middle quantization  | Small     | Fast            | Good    |
| Q5_K_M    | 5-bit middle quantization  | Medium    | Medium          | Better  |
| Q6_K      | 6-bit quantization         | Larger    | Slower          | Best    |
| Q8_0      | 8-bit quantization         | Largest   | Slowest         | Highest |

For most use cases, the `Q4_K_M` version offers a good balance of quality and size, while `Q2_K` offers the fastest performance with a smaller file size.

## Model Comparison

| Model      | Size   | Disk Space | Speed    | Quality | Use Case                              |
|------------|--------|------------|----------|---------|-------------------------------------|
| TinyLlama  | 1.1B   | ~600MB     | Fastest  | Good    | Real-time responses, limited hardware |
| Gemma      | 2B     | ~1.2GB     | Fast     | Better  | General purpose with good quality     |
| Phi-2      | 2.7B   | ~1.5GB     | Moderate | Best    | Higher quality responses              |
| Mistral    | 7B     | ~4GB       | Slower   | Great   | High quality with more resources      |

## Adding Support for New Chat Formats

To add support for a new chat format:

1. Edit the `GgufModel` class in `gguf-model.js`
2. Add the new format to the switch statement in the `generateText()` method
3. Add the corresponding response cleanup handling if needed
4. Update the documentation to mention the new format