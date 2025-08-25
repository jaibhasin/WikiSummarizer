# WikiSummarizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

WikiSummarizer is an intelligent web application that leverages Retrieval-Augmented Generation (RAG) to generate multiple concise and informative summaries from any Wikipedia page. Whether you're a researcher, student, or curious mind, WikiSummarizer helps you quickly grasp the key aspects of any topic.

## 🌟 Features

- **Multiple Summaries**: Get 4-5 distinct summaries, each highlighting different aspects of the topic
- **Flexible Input**: Simply paste a Wikipedia URL or type a topic name
- **Smart Content Processing**:
  - Automatically handles ambiguous queries
  - Intelligently splits content into meaningful sections
  - Processes large articles efficiently
- **Clean Interface**: Modern, responsive design for optimal reading experience
- **Easy to Use**: One-click copy functionality for quick sharing

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wikisummarizer.git
   cd wikisummarizer
   ```

2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Open your browser and navigate to `http://localhost:5000`

## 🛠️ How It Works

1. **Input**: Enter a Wikipedia URL or type a topic
2. **Processing**:
   - The system fetches the Wikipedia page
   - Content is split into logical sections
   - RAG model generates multiple summaries
3. **Output**: View 4-5 distinct summaries, each with a different focus

## 📚 Example

**Input:** `https://en.wikipedia.org/wiki/Artificial_intelligence`

**Sample Outputs:**
1. **Overview**: Covers the definition, history, and fundamental concepts of AI
2. **Technical Aspects**: Focuses on machine learning, neural networks, and algorithms
3. **Applications**: Highlights real-world uses in various industries
4. **Ethical Considerations**: Discusses AI safety, ethics, and societal impact

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Wikipedia for the wealth of knowledge
- The open-source community for amazing tools and libraries
- All contributors who help improve this project

## 📬 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/wikisummarizer](https://github.com/yourusername/wikisummarizer)
