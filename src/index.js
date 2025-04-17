const express = require('express');
const { LlmService } = require('./services/llm-service');
const config = require('./config');

const app = express();
const port = config.port;

// Initialize LLM service with configured model type
const llmService = new LlmService(config.model.type);

// Middleware
app.use(express.json());

// Route for generating Wikipedia-style summary
app.get('/:word', async (req, res) => {
  try {
    const { word } = req.params;
    
    console.log(`Generating summary for: ${word}`);
    
    // Generate summary with linked words
    const result = await llmService.generateWikipediaSummary(word);
    
    // Return HTML response
    res.send(result);
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).send('Error generating content');
  }
});

// Home route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Fuck Your AI</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; }
          .container { max-width: 800px; margin: 0 auto; }
          .instructions { background: #f4f4f4; padding: 20px; border-radius: 5px; }
          code { background: #eee; padding: 2px 5px; border-radius: 3px; }
          .model-info { margin-top: 20px; padding: 10px; background: #e6f7ff; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Fuck Your AI</h1>
          <div class="instructions">
            <p>Enter a word in the URL to get a Wikipedia-style summary.</p>
            <p>Example: <a href="/cat">localhost:${port}/cat</a></p>
          </div>
          <div class="model-info">
            <p>Currently using: <strong>${config.model.type}</strong> model</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Using LLM model: ${config.model.type}`);
});
