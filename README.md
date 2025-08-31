# 🏛️ Digital Lawyer

> A privacy-first AI legal assistant that runs entirely on your device

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-green?logo=ollama)](https://ollama.ai/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## Overview

Digital Lawyer is a **privacy-first AI legal assistant** designed to provide legal guidance while protecting your sensitive information. Unlike cloud-based AI services that may store and analyze your conversations, Digital Lawyer runs entirely on your device using local AI models.

### Why Privacy Matters in Legal AI

- **Attorney-Client Privilege**: Your legal consultations should remain confidential
- **Data Security**: Big AI companies could potentially use your legal conversations against you in court
- **No Third-Party Access**: Your sensitive legal information never leaves your device
- **Zero Data Collection**: No chats saved, no tracking, no data mining

## Key Features

### Privacy & Security
- **Local Processing**: AI models run entirely on your device
- **No Data Storage**: Conversations are not saved or logged
- **Zero Telemetry**: No data collection or tracking
- **Offline Capable**: Works without internet connection
- **Confidential**: Maintains attorney-client privilege principles

### AI Capabilities
- **Legal Text Analysis**: Powered by Gemma 3:4b for comprehensive legal guidance
- **Document Vision**: LLaVA 7b analyzes legal documents, contracts, and images
- **Multimodal Intelligence**: Combines text and visual understanding
- **Legal Domain**: Specialized prompts for legal advice and guidance
- **Context Awareness**: Understands legal terminology and concepts

### Vanity Features
- **Emergency Calling**: Direct 911 integration for urgent situations
- **Real-time Recording**: Record video while consulting AI for evidence
- **Emergency Contacts**: Quick access to saved emergency contacts
- **Crisis Support**: Built-in emergency response features

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Fast Performance**: Optimized for low-resource devices
- **Hybrid Deployment**: Supports both local and remote Ollama instances
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Accessible**: Following web accessibility best practices

## 🚀 Quick Start

### Prerequisites

- **Ollama** installed and running ([Download here](https://ollama.ai/))
- **4GB+ RAM** recommended for AI models

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nancy-kataria/digital-lawyer.git
   cd digital-lawyer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up AI models**
   ```bash
   # Install required Ollama models
   ollama pull gemma3:4b
   ollama pull llava:7b
   
   # Verify setup
   npm run setup-models
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## Configuration

### Deployment Modes

#### Local Development (Offline)
- Uses local Ollama installation
- Models run on your machine
- No internet required after setup
- Maximum privacy and security

#### Cloud Deployment (Online)
- Connects to remote Ollama server
- Users don't download models
- Requires remote Ollama instance
- Maintains same privacy (your server)

## AI Models

### Text Generation: Gemma 3:4b
- **Purpose**: Legal reasoning and response generation
- **Size**: ~2.6GB
- **Capabilities**: 
  - Legal document analysis
  - Contract interpretation
  - Legal advice and guidance
  - Question answering
  - Legal research assistance

### Vision Analysis: LLaVA 7b
- **Purpose**: Document and image understanding
- **Size**: ~4.1GB
- **Capabilities**:
  - Contract and legal document OCR
  - Image-based evidence analysis
  - Chart and diagram interpretation
  - Handwritten note reading
  - Multi-page document processing

### Model Performance
- **Response Time**: 2-10 seconds (depending on hardware)
- **Quality**: Professional-grade legal assistance
- **Languages**: Primarily English (expandable)
- **Accuracy**: Continuously improving with model updates

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **AI Backend**: Ollama with local model execution
- **TypeScript**: Type safety throughout
- **Build Tool**: Turbopack for fast development

### Project Structure
```
digital-lawyer/
├── app/                    # Next.js app router
│   ├── api/chat/          # AI chat API endpoint
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── chat-interface.tsx # Main chat interface
│   └── ui/               # Reusable UI components
├── lib/                  # Core logic
│   ├── model-orchestrator.ts    # AI model coordination
│   ├── model-config.ts          # Provider configuration
│   ├── image-utils.ts           # Image processing
│   └── model-providers/         # Provider implementations
├── models/               # AI response generation
├── scripts/              # Setup and utility scripts
├── hooks/                # React hooks
└── types/                # TypeScript definitions
```


## Usage Guide

### Basic Legal Consultation
1. Type your legal question in the chat interface
2. Get AI-powered legal guidance and advice
3. Ask follow-up questions for clarification

### Document Analysis
1. Upload legal documents, contracts, or images
2. Ask questions about the uploaded content
3. Get detailed analysis and interpretation

### Example Queries
- "What should I know about signing this employment contract?"
- "Can you analyze this lease agreement for any red flags?"
- "What are my rights in this situation?"
- "Help me understand this legal document"

## Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run setup-models # Check model configuration
```

### Adding New Features
1. **UI Components**: Add to `components/` directory
2. **API Endpoints**: Create in `app/api/` directory
3. **AI Logic**: Extend `lib/model-orchestrator.ts`
4. **Styling**: Use Tailwind CSS classes

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## System Requirements

### Minimum Requirements
- **RAM**: 8GB (models use ~7GB)
- **Storage**: 10GB free space
- **CPU**: Multi-core processor (Intel/AMD/Apple Silicon)
- **OS**: Windows 10+, macOS 10.15+, or Linux

### Recommended
- **RAM**: 16GB+ for better performance
- **Storage**: SSD for faster model loading
- **GPU**: Optional but improves inference speed
- **Network**: For initial model downloads

### Mobile/Low-Resource Devices
- Consider using smaller models or remote Ollama setup
- Web interface works on tablets and smartphones
- Progressive Web App (PWA) support planned

## Important Legal Disclaimers

### Legal Advice Disclaimer
**This application provides general legal information only and does not constitute legal advice.** 

- **Not a Substitute**: This AI cannot replace qualified legal counsel
- **Seek Professional Help**: Always consult with a licensed attorney for specific legal matters
- **Jurisdiction Matters**: Laws vary by location and change frequently
- **Time Sensitivity**: Legal advice can be time-sensitive

### Privacy Statement
- Your conversations are processed locally on your device
- No data is transmitted to external servers (in local mode)
- No chat history is stored or logged
- You maintain full control over your data

### Security Notice
- This software is provided "as is" without warranties
- Users are responsible for their own data security
- Regular security updates are recommended
- Report security issues responsibly

---

**Remember**: This tool provides general information only. Always consult with a qualified attorney for legal advice specific to your situation.
