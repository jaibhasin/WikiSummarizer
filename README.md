# WikiSummarizer

AI-powered Wikipedia summarization tool that transforms articles into concise, digestible summaries using Retrieval-Augmented Generation (RAG).

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688)

## Key Features

- **Smart Summarization**: Generate multi-section summaries (Overview, History, Controversies, Impact, etc.)
- **Interactive Q&A**: Get precise, context-aware answers about any topic
- **Responsive Design**: Optimized for both mobile and desktop
- **Advanced Backend**: Built with FastAPI, LangChain, and ChromaDB

## Tech Stack

- **Backend**: FastAPI, LangChain, ChromaDB, Anthropic Claude
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **AI/ML**: RAG Architecture, Vector Search, Semantic Similarity

## Quick Start

### Prerequisites
- Python 3.8+, Node.js 16+, Git

### Installation

```bash
# Clone the repository
git clone https://github.com/jaibhasin/WikiSummarizer.git
cd WikiSummarizer

# Set up backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up frontend
cd frontend
npm install
```

### Configuration
1. Create `.env` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here  # Optional for better performance
   CHROMA_PERSIST_DIRECTORY=chroma_db
   ```

### Running the Application
```bash
# Start backend (from project root)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# In a new terminal, start frontend (from frontend directory)
npm run dev
```

Visit `http://localhost:5173` to start using WikiSummarizer!

## Usage

1. **Search for a Topic**: Enter any Wikipedia topic or URL
2. **View Summaries**: Get concise summaries in different sections
3. **Ask Questions**: Use the Q&A feature for specific information

## Performance Tips

For faster performance, use ChatGPT embeddings by:
1. Adding your OpenAI API key to `.env`
2. Updating `app/services/rag.py` to use OpenAI embeddings

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/jaibhasin/WikiSummarizer/issues)
- **Email**: bhasinjai@gmail.com

## Roadmap

- [ ] ChatGPT Embeddings Integration
- [ ] Multi-language Support
- [ ] Export Summaries (PDF/Markdown)
- [ ] User Accounts & History

---
 
 **Star this repository if you find it helpful!**
