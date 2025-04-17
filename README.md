# Fuck Your AI

A web application that generates Wikipedia-style summaries on-the-fly using small, fast LLMs running locally on CPU.

## Features

- Generates Wikipedia-style summaries for any word
- Dynamically creates links to 20 random words in the summary
- Uses lightweight LLMs that can run efficiently on CPU
- Modular design to easily switch between different LLM backends

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file by copying `.env.example`
4. Download a model (see Models section below)
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

## Recommended Models

The application is designed to work with small, CPU-friendly models:

| Model      | Size   | Speed | Recommended For |
|------------|--------|-------|-----------------|
| TinyLlama  | 1.1B   | ★★★★★ | Fast responses on limited hardware |
| Gemma      | 2B     | ★★★★☆ | Good balance of speed and quality |
| Phi-2      | 2.7B   | ★★★☆☆ | Best quality for small models |

For complete setup instructions and download links, see the documentation in `src/models/README.md`.

## Configuration

All configuration is done through environment variables (see `.env.example`):

```
# Choose your model
MODEL_TYPE=tinyllama 

# Set model path
TINYLLAMA_MODEL_PATH=./models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf

# Adjust generation parameters
MODEL_TEMPERATURE=0.7
MODEL_MAX_TOKENS=400
```

## Extending

To add a new LLM backend:

1. Create a new model implementation in `src/models/`
2. Extend the `BaseModel` class
3. Add the model to the factory in `llm-model-factory.js`
4. Update the configuration options
