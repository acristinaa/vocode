# Vocode 

An AI-powered oral exam trainer that helps you practice for any topic with voice interaction.

> I built it at an [AI Tinkerers](https://aitinkerers.org/) event for learning purposes. This project was created with guidance from Claude AI as a hands-on exercise in building voice-enabled AI applications.

## Features

- **Any Topic** - Practice JavaScript, React, System Design, or create custom topics
- **Voice Interaction** - Speak your answers naturally and hear AI responses
- **AI Examiner** - Powered by Claude AI for intelligent, adaptive questioning
- **Session History** - Track your practice sessions and progress
- **Customizable** - Choose difficulty level and session duration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude API via [Langdock](https://langdock.com/)
- **State**: Zustand
- **Voice**: Web Speech API

## Getting Started

### Prerequisites

- Node.js 18+
- A Langdock account with API access ([get one here](https://langdock.com/))
- Chrome or Edge browser (for speech recognition)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vocode.git
cd vocode
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Langdock credentials:
```bash
LANGDOCK_API_KEY=your_langdock_api_key_here
LANGDOCK_BASE_URL=https://api.langdock.com/anthropic/eu
```

> **Note**: Check your Langdock dashboard for the correct base URL for your region (EU/US).

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure
```
vocode/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts    # Claude API endpoint (via Langdock)
│   │   ├── exam/page.tsx        # Exam session page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── TopicSelector.tsx    # Topic selection UI
│   │   ├── VoiceAgent.tsx       # Main exam interface
│   │   └── SessionHistory.tsx   # Past sessions table
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts
│   │   └── useSpeechSynthesis.ts
│   ├── lib/
│   │   └── prompts.ts           # AI system prompts
│   ├── store/
│   │   └── examStore.ts         # Zustand state
│   └── types/
│       └── index.ts             # TypeScript types
└── ...config files
```

## Usage

1. **Select a Topic** - Choose from predefined topics or create a custom one
2. **Configure Settings** - Set difficulty and duration
3. **Start the Exam** - Click "Start Exam Session"
4. **Speak Your Answers** - Click the microphone and answer out loud
5. **End Session** - Click "End Session" when done

## Browser Support

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Speech Recognition | ✅ | ✅ | ❌ | ❌ |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |

