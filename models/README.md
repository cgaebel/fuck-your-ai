# LLM Model Files

This directory is for storing downloaded GGUF model files.

## Default Model

The application uses TinyLlama by default if no model is specified:
- **TinyLlama (1.1B)**: `tinyllama-1.1b-chat-v1.0.Q2_K.gguf` (~350MB)

## Recommended Models

Download one of these recommended models and place it in this directory:

### Tiny & Fast Models (for limited hardware)

- **TinyLlama (1.1B)**: https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF
  - Download: `tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf` (~600MB)
  - Chat format: `MODEL_CHAT_FORMAT=llama`

- **Gemma (2B)**: https://huggingface.co/TheBloke/gemma-2b-it-GGUF
  - Download: `gemma-2b-it.Q4_K_M.gguf` (~1.2GB)
  - Chat format: `MODEL_CHAT_FORMAT=gemma`

- **Phi-2 (2.7B)**: https://huggingface.co/TheBloke/phi-2-GGUF
  - Download: `phi-2.Q4_K_M.gguf` (~1.5GB)
  - Chat format: Leave empty

### Better Quality Models (require more RAM)

- **Mistral (7B)**: https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF
  - Download: `mistral-7b-instruct-v0.2.Q4_K_M.gguf` (~4GB)
  - Chat format: `MODEL_CHAT_FORMAT=mistral`

- **Llama 2 (13B)**: https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF
  - Download: `llama-2-13b-chat.Q4_K_M.gguf` (~8GB)
  - Chat format: `MODEL_CHAT_FORMAT=llama`

## Configuration

After downloading a model, update your `.env` file to use it:

```
# Set path to your model
MODEL_PATH=./models/your-model-name.Q4_K_M.gguf

# Set appropriate chat format
MODEL_CHAT_FORMAT=llama  # Use appropriate format (gemma, llama, mistral, etc.)
```

## Understanding GGUF File Types

When downloading models, you'll see different versions. We recommend the Q4_K_M versions for most users as they offer a good balance of size and quality.

For more detailed information about models and configuration options, see:
- `src/models/README.md`