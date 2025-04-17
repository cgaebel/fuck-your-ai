import { LlmModelFactory } from '../models/llm-model-factory.js';

export class LlmService {
  constructor() {
    this.model = LlmModelFactory.createModel();
  }

  async generateWikipediaSummary(word) {
    // 1. Generate the raw summary text with improved prompt for longer content
    const prompt = `Write a comprehensive, factual Wikipedia-style article about "${word}". 
    
Your response should be structured like a Wikipedia article with:
- A detailed introduction providing a clear definition and context (2-3 paragraphs)
- Historical background and development (2-3 paragraphs)
- Key characteristics, components, or features (2-3 paragraphs)
- Significance and impact (1-2 paragraphs)
- Related concepts or examples (1-2 paragraphs)

Use an encyclopedic, neutral tone. Include specific facts, dates, and examples where relevant. Avoid opinions, first or second person, and promotional language.`;
    
    const summaryText = await this.model.generateText(prompt);

    // 2. Extract meaningful words from the summary that could be linked
    const words = this._extractLinkableWords(summaryText);
    
    // 3. Create the HTML with linked words
    return this._createHtmlWithLinks(word, summaryText, words);
  }

  _extractLinkableWords(text) {
    // Common stop words to filter out
    const stopWords = new Set(['the', 'and', 'but', 'for', 'nor', 'yet', 'with', 'about', 'from', 
                      'then', 'than', 'that', 'this', 'those', 'these', 'were', 'been',
                      'have', 'will', 'they', 'their', 'there', 'which', 'when', 'what']);

    // Process text to find linkable words in one pass
    const uniqueWords = [...new Set(
      text
        .replace(/[.,?!;()\[\]{}'\\\/"]/g, '') // Remove punctuation
        .split(/\s+/) // Split by whitespace
        .map(word => word.toLowerCase())
        .filter(word => word.length > 3 && !stopWords.has(word)) // Only meaningful words
    )];
    
    // Get random selection of words to link (max 20)
    return uniqueWords
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(20, uniqueWords.length));
  }

  _createHtmlWithLinks(title, text, wordsToLink) {
    let htmlContent = text;
    
    // Replace words with links - only the first occurrence of each word
    wordsToLink.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i'); // Case insensitive, whole word match
      if (htmlContent.match(regex)) {
        htmlContent = htmlContent.replace(regex, `<a href="/${word}">$&</a>`);
      }
    });

    // Format paragraphs and wrap in styled HTML
    htmlContent = `<p>${htmlContent.replace(/\n\n/g, '</p><p>')}</p>`;
    
    return `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            .summary { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .summary p { margin-bottom: 1em; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${title}</h1>
            <div class="summary">${htmlContent}</div>
          </div>
        </body>
      </html>
    `;
  }
}