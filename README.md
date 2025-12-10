# AI Roundtable 🤖💬

A sophisticated multi-model AI chat application where multiple AI models can converse with you and each other in real-time. Built with Next.js 16 and powered by OpenRouter's unified API.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan?style=flat&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## ✨ Features

### Core Capabilities
- **Multi-Model Chat**: Interact with multiple AI models simultaneously in one conversation
- **Smart @Mentions**: Direct messages to specific models using `@ModelName` tags
- **Organic Conversations**: Models respond naturally and can interact with each other
- **Real-Time Streaming**: See responses generated token-by-token as they're created
- **Typing Indicators**: Visual feedback showing which model is currently thinking
- **Response Management**: Stop all ongoing responses instantly with a single button
- **Conversation Engine**: Intelligent response queuing and priority management
- **Clean UI**: Modern, responsive interface with Tailwind CSS v4

### Technical Highlights
- **Streaming API**: Server-Sent Events (SSE) for real-time responses
- **State Management**: Zustand for efficient and predictable state updates
- **Type Safety**: Full TypeScript implementation for robust development
- **Modular Architecture**: Clean separation of concerns with reusable components
- **OpenRouter Integration**: Access to multiple AI providers through one unified API

## 🤖 Available Models

| Model | Provider | Tag | Personality |
|-------|----------|-----|-------------|
| **Gemini 2.0 Flash** | Google | `@Gemini` | Fast, efficient, multimodal-focused |
| **Claude 3.5 Haiku** | Anthropic | `@Claude` | Thoughtful, balanced, conversational |
| **GPT-4o Mini** | OpenAI | `@GPT` | Practical, reliable, efficient |
| **DeepSeek Chat** | DeepSeek | `@DeepSeek` | Technical, code-focused, analytical |

Each model has unique personality traits and strengths, creating diverse and engaging conversations.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18.17 or higher
- **npm**: Version 9 or higher
- **OpenRouter API Key**: Get yours at [openrouter.ai/keys](https://openrouter.ai/keys)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-roundtable.git
cd ai-roundtable
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> 💡 **Tip**: Never commit your `.env` file. It's already in `.gitignore` by default.

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Basic Usage

1. **Select Models**: Click on model buttons in the left sidebar to add them to the conversation
2. **Send Messages**: Type your message in the input box and press Enter or click Send
3. **@Mention Models**: Use `@ModelName` to direct a question to a specific model
4. **View Responses**: Watch as models respond in real-time with streaming text
5. **Stop Generation**: Click the Stop button to cancel all ongoing model responses
6. **Clear Chat**: Use the Clear Chat button to start a fresh conversation

### Advanced Features

**@Mentions**: Target specific models for their unique expertise
```
@Claude Can you help me with creative writing?
@DeepSeek How would I implement a binary search tree?
@Gemini Analyze this image for me
```

**Model Interactions**: Models can respond to each other, creating dynamic discussions
```
User: What's the best programming language?
@DeepSeek: [responds with technical analysis]
@Claude: [responds with balanced perspective]
```

## 🏗️ Project Structure

```
ai-roundtable/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # Streaming API endpoint
│   │   ├── globals.css           # Global styles and animations
│   │   ├── layout.tsx            # Root layout with metadata
│   │   └── page.tsx              # Main chat page
│   │
│   ├── components/               # React components
│   │   ├── ChatContainer.tsx     # Main chat orchestrator
│   │   ├── ChatInput.tsx         # Message input with controls
│   │   ├── MessageBubble.tsx     # Individual message display
│   │   ├── MessageList.tsx       # Scrollable message container
│   │   ├── ModelSelector.tsx     # Model toggle buttons
│   │   ├── ActiveModels.tsx      # Active models display
│   │   └── TypingIndicator.tsx   # "Model is thinking..." indicator
│   │
│   ├── lib/                      # Core utilities
│   │   ├── conversationEngine.ts # Response logic and queuing
│   │   ├── models.ts             # Model definitions and config
│   │   └── streamHandler.ts      # API streaming utilities
│   │
│   ├── store/                    # State management
│   │   └── chatStore.ts          # Zustand store
│   │
│   └── types/                    # TypeScript definitions
│       └── chat.ts               # Type interfaces
│
├── public/                       # Static assets
├── .env                          # Environment variables (create this)
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State**: [Zustand 5](https://github.com/pmndrs/zustand)
- **UI Components**: Custom React components

### Backend
- **API**: Next.js API Routes
- **Streaming**: Server-Sent Events (SSE)
- **AI Gateway**: [OpenRouter](https://openrouter.ai/)
- **HTTP Client**: [OpenAI SDK](https://github.com/openai/openai-node)

### Development
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key for model access |

### Model Configuration

Models are configured in `src/lib/models.ts`. Each model includes:
- **ID**: OpenRouter model identifier
- **Name**: Display name
- **Provider**: AI company
- **Color**: UI theme color
- **Personality**: Response characteristics

To add a new model:
1. Add the model definition to `models.ts`
2. Update the `MODEL_PERSONALITIES` in `conversationEngine.ts`
3. The UI will automatically update

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Key Features of the Conversation Engine

The `ConversationEngine` class manages model interactions:

- **Response Decisions**: Determines which models should respond based on context
- **Priority Queue**: Manages concurrent model responses
- **Cooldown System**: Prevents models from over-responding
- **Context Window**: Builds appropriate message history for each model
- **Personality System**: Each model has unique characteristics and strengths

### Recent Updates

✅ Fixed model tagging issues
✅ Removed context prefix artifacts
✅ Improved @mention color display
✅ Enhanced natural conversation flow

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add TypeScript types for all new code
- Test your changes thoroughly
- Update documentation as needed
- Write clear commit messages

## 🐛 Troubleshooting

### Common Issues

**"API key not found" error**
- Ensure `.env` file exists in the root directory
- Verify `OPENROUTER_API_KEY` is set correctly
- Restart the development server after adding the key

**Models not responding**
- Check your OpenRouter API key has sufficient credits
- Verify your internet connection
- Check the browser console for error messages

**Streaming not working**
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check that JavaScript is enabled
- Clear browser cache and reload

**TypeScript errors**
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` for correct configuration
- Delete `.next` folder and rebuild: `rm -rf .next && npm run dev`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js and OpenRouter**

*Star ⭐ this repo if you find it useful!*