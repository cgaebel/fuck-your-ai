import express from 'express';
import { LlmService } from './services/llm-service.js';
import config from './config.js';

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

// Redirect home to a default topic
app.get('/', (req, res) => {
  res.redirect('/wikipedia');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Using LLM model: ${config.model.type}`);
  console.log(`Visit http://localhost:${port}/cat (or any word) for a Wikipedia-style article`);
});