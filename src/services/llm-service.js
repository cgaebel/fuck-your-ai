const { LlmModelFactory } = require('../models/llm-model-factory');

class LlmService {
  constructor(modelType = 'tinyllama') {
    this.model = LlmModelFactory.createModel(modelType);
  }

  async generateWikipediaSummary(word) {
    // 1. Generate the raw summary text with improved prompt
    const prompt = `Write a concise, factual Wikipedia-style summary about "${word}" in 3-4 sentences. Use an encyclopedic, neutral tone. Focus on providing a clear definition, key characteristics, historical context if relevant, and significance. Avoid opinions, first or second person, and promotional language.`;
    
    const summaryText = await this.model.generateText(prompt);

    // 2. Extract meaningful words from the summary that could be linked
    const words = this._extractLinkableWords(summaryText);
    
    // 3. Create the HTML with linked words
    return this._createHtmlWithLinks(word, summaryText, words);
  }

  _extractLinkableWords(text) {
    // Extract meaningful nouns and terms from the text
    const words = text
      .replace(/[.,?!;()\[\]{}'\\\/"]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .map(word => word.toLowerCase())
      .filter(word => 
        word.length > 3 && // Only words longer than 3 chars
        !this._isStopWord(word) // Filter out common stop words
      );
    
    // Deduplicate words
    const uniqueWords = [...new Set(words)];
    
    // Select random words to link (up to 20 or all available if less)
    return this._getRandomElements(uniqueWords, Math.min(20, uniqueWords.length));
  }

  _isStopWord(word) {
    const stopWords = ['the', 'and', 'but', 'for', 'nor', 'yet', 'with', 'about', 'from', 
                      'then', 'than', 'that', 'this', 'those', 'these', 'were', 'been',
                      'have', 'will', 'they', 'their', 'there', 'which', 'when', 'what'];
    return stopWords.includes(word);
  }

  _getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  _createHtmlWithLinks(title, text, wordsToLink) {
    let htmlContent = text;
    
    // Replace words with links
    wordsToLink.forEach(word => {
      // Create a regex that matches the word as a whole word, case insensitive
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      
      // Replace only the first occurrence to avoid recursive linking
      htmlContent = htmlContent.replace(regex, `<a href="/${word}">$&</a>`);
    });

    // Wrap in HTML with some basic styling
    return `
      <html>
        <head>
          <title>${title} - Fuck Your AI</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            .summary { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
            .footer { margin-top: 30px; font-size: 0.8em; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${title}</h1>
            <div class="summary">
              ${htmlContent}
            </div>
            <div class="footer">
              <p>Generated using a fast, small LLM running locally.</p>
              <p><a href="/">Back to home</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = { LlmService };
