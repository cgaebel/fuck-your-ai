# Fuck Your AI

A web application that generates Wikipedia-style summaries on-the-fly using small, fast LLMs running locally on CPU.

## Features

- Generates Wikipedia-style summaries for any word
- Dynamically creates links to 20 random words in the summary
- Uses lightweight LLMs that can run efficiently on CPU
- Simple GGUF model customization - use any GGUF model with easy configuration

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file by copying `.env.example`
4. Download a GGUF model (see Models section below)
5. Configure your model in the `.env` file
6. Start the server: `npm start`

For development with hot reloading:
```
npm run dev
```

## Usage

Access the application at `http://localhost:3000/` and navigate to `/{word}` to generate a summary for that word.

Example: `http://localhost:3000/cat`

Each summary will contain links to 20 random words, allowing you to navigate to summaries of those words.

## GGUF Model Customization

Using a custom GGUF model is simple - just specify the model path and format in your `.env` file:

```
# Set the path to your GGUF model file
MODEL_PATH=./models/your-model-name.gguf

# Configure model format (if needed)
MODEL_CHAT_FORMAT=llama
```

### Recommended GGUF Models

Here are some excellent GGUF models to try:

- **Tiny & Fast (< 1.5GB)**
  - TinyLlama 1.1B: [Download](https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF)
  - Gemma 2B: [Download](https://huggingface.co/TheBloke/gemma-2b-it-GGUF)
  - Phi-2 2.7B: [Download](https://huggingface.co/TheBloke/phi-2-GGUF)

- **Medium Size & Quality (1.5GB - 5GB)**
  - StableLM 3B: [Download](https://huggingface.co/TheBloke/stablelm-zephyr-3b-GGUF)
  - Mistral 7B: [Download](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF)

- **Larger & Higher Quality (> 5GB)**
  - Llama 2 13B: [Download](https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF)

For detailed model configuration options and more recommendations, see `src/models/README.md`.

## Understanding GGUF File Types

When downloading GGUF models, you'll see multiple versions with different file sizes:

| Suffix    | Precision           | File Size | Speed  | Quality |
|-----------|---------------------|-----------|--------|---------|
| Q2_K      | 2-bit quantization  | Smallest  | Fastest| Lowest  |
| Q4_K_M    | 4-bit quantization  | Small     | Fast   | Good    |
| Q8_0      | 8-bit quantization  | Largest   | Slowest| Highest |

We recommend the **Q4_K_M** version for most use cases as it offers a good balance between size, speed, and quality.

## Configuration

All configuration is done through environment variables (see `.env.example`):

```
# Set model path
MODEL_PATH=./models/your-model-name.gguf

# Configure chat format for specific model families
MODEL_CHAT_FORMAT=llama

# Adjust generation parameters
MODEL_TEMPERATURE=0.7
MODEL_MAX_TOKENS=400
MODEL_CONTEXT_SIZE=2048
```

## Extending

To add support for a new LLM format:

1. Edit the `GgufModel` class in `src/models/gguf-model.js`
2. Add the new chat format to the format handlers in the `generateText` method
3. Update the documentation in the README and .env.example files