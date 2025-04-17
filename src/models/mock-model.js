const { BaseModel } = require('./base-model');

/**
 * Enhanced mock model implementation for development without needing to download models
 */
class MockModel extends BaseModel {
  constructor(config = {}) {
    super();
    this.config = {
      delay: 200, // artificial delay in ms to simulate real model latency
      ...config
    };
    this.topics = new Set([
      'cat', 'dog', 'computer', 'internet', 'music', 'science', 'coffee',
      'book', 'movie', 'game', 'food', 'water', 'phone', 'guitar', 'car',
      'bicycle', 'tree', 'flower', 'mountain', 'ocean', 'space', 'star',
      'language', 'history', 'art', 'technology', 'universe', 'philosophy',
      'animal', 'plant', 'planet', 'democracy', 'education', 'health',
      'mathematics', 'physics', 'chemistry', 'biology', 'medicine', 'architecture',
      'design', 'sport', 'football', 'chess', 'programming', 'artificial intelligence',
      'painting', 'sculpture', 'dance', 'poetry', 'novel', 'photography',
      'film', 'television', 'radio', 'economy', 'business', 'money',
      'cryptocurrency', 'robot', 'democracy', 'festival', 'concert', 'museum',
      'library', 'university', 'school', 'teacher', 'student', 'friend',
      'family', 'parent', 'child', 'baby', 'love', 'time', 'mind', 'brain',
      'heart', 'soul', 'body', 'sleep', 'dream', 'work', 'play', 'game',
      'hobby', 'travel', 'vacation', 'beach', 'forest', 'desert', 'glacier',
      'volcano', 'earthquake', 'weather', 'climate', 'energy', 'electricity',
      'internet', 'email', 'website', 'software', 'hardware', 'keyboard',
      'mouse', 'screen', 'monitor', 'printer', 'speaker', 'headphone'
    ]);
  }

  async initialize() {
    console.log('Enhanced mock model initialized successfully');
    return Promise.resolve();
  }

  async generateText(prompt) {
    // Extract the core topic from the prompt
    const match = prompt.match(/"([^"]+)"/); 
    const topic = match ? match[1] : 'unknown topic';
    
    // Add artificial delay to simulate model processing
    await new Promise(resolve => setTimeout(resolve, this.config.delay));
    
    // Generate a fake summary based on the topic
    return this._generateFakeSummary(topic);
  }

  _generateFakeSummary(topic) {
    const summaries = {
      'cat': 'Cats are small carnivorous mammals of the family Felidae. They are often kept as pets and have been domesticated for thousands of years. Domestic cats are valued for their companionship and ability to hunt vermin. Cats are known for their agility, independent nature, and grooming behavior.',
      'dog': 'Dogs are domesticated mammals of the family Canidae. They have been bred by humans for various purposes including hunting, herding, protection, and companionship. Dogs are highly social animals that form strong bonds with humans. They are known for their loyalty, trainability, and diverse breeds with varying sizes and characteristics.',
      'computer': 'Computers are electronic devices capable of storing and processing data according to instructions provided by software. They have revolutionized nearly every aspect of modern society since their introduction in the mid-20th century. Modern computers range from small embedded systems to powerful supercomputers used in scientific research. The global network of interconnected computers forms the basis of the internet.',
      'internet': 'The Internet is a global network of interconnected computer systems using standardized communication protocols. It emerged from ARPANET in the late 20th century and has fundamentally transformed communication, commerce, and access to information worldwide. Key Internet services include email, the World Wide Web, file sharing, and online gaming. Today, billions of devices are connected to the Internet, forming a cornerstone of modern digital infrastructure.',
      'music': 'Music is an art form consisting of organized sound and silence. It has been part of human culture across all societies and throughout history. Musical elements include rhythm, melody, harmony, and timbre, which combine to create diverse genres and styles. Music serves various functions including entertainment, communication, ritual, and emotional expression. Digital technology has revolutionized how music is created, distributed, and consumed.',
      'science': 'Science is a systematic method of building and organizing knowledge through observation, experimentation, and theoretical explanation. It encompasses diverse fields including physics, chemistry, biology, and astronomy. The scientific method involves forming hypotheses, conducting experiments, and analyzing data to draw conclusions. Scientific advances have profoundly shaped modern society through technological innovation, medicine, and our understanding of the natural world.',
      'coffee': 'Coffee is a brewed beverage prepared from roasted coffee beans, the seeds of berries from the Coffea plant. It originated in Ethiopia and spread globally through trade routes. Coffee contains caffeine, a stimulant that temporarily reduces fatigue and improves concentration. The drink is prepared through various methods including drip brewing, espresso, and French press. Coffee culture encompasses social traditions, specialized cafes, and connoisseurship around bean varieties and preparation techniques.',
      'artificial intelligence': 'Artificial Intelligence (AI) is a field of computer science focused on creating systems capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding. Modern AI systems utilize machine learning algorithms, particularly deep learning neural networks, to analyze large datasets and improve performance over time. Applications of AI span numerous industries, from healthcare and finance to transportation and entertainment.',
      'programming': 'Programming is the process of creating instructions for computers to perform specific tasks. It involves designing algorithms, writing code in specialized languages, testing, debugging, and maintenance. Programmers work with various paradigms like procedural, object-oriented, and functional programming. The field has evolved significantly since its inception, with modern programming encompassing web development, mobile applications, machine learning, and systems programming.',
      'web': 'The World Wide Web is an information system of interlinked hypertext documents accessed via the Internet. Invented by Tim Berners-Lee in 1989, the Web has evolved from simple text pages to complex interactive applications. Core technologies include HTML for content structure, CSS for presentation, and JavaScript for client-side behavior. The Web has transformed how people access information, communicate, shop, and conduct business, becoming an essential part of modern global infrastructure.'
    };
    
    // Return the predefined summary or generate a generic one
    if (summaries[topic.toLowerCase()]) {
      return summaries[topic.toLowerCase()];
    } else {
      return `${topic} is a fascinating subject with numerous aspects worthy of exploration. It has evolved significantly throughout history and continues to influence various domains today. Research on ${topic} reveals interesting patterns and applications that extend across multiple disciplines and contexts. The study of ${topic} provides valuable insights into broader questions about human knowledge and understanding.`;
    }
  }

  // Get a list of potentially linkable topics
  getKnownTopics() {
    return Array.from(this.topics);
  }

  async cleanup() {
    // No cleanup needed for mock model
    return Promise.resolve();
  }
}

module.exports = { MockModel };
