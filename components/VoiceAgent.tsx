"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Square,
  Volume2,
  ChevronLeft,
  Loader2,
  SkipForward,
} from "lucide-react";
import {
  ExamConfig,
  SessionRecord,
  Message,
  ConversationMessage,
} from "@/types/index";
import { generateExaminerPrompt } from "@/lib/prompts";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface VoiceAgentProps {
  config: ExamConfig;
  onEndSession: (record: SessionRecord) => void;
  onBack: () => void;
}

export function VoiceAgent({ config, onEndSession, onBack }: VoiceAgentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const systemPromptRef = useRef<string>("");

  useEffect(() => {
    systemPromptRef.current = generateExaminerPrompt(config);
  }, [config]);

  const {
    isSpeaking,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis({
    language: config.language,
  });

  const addMessage = useCallback(
    (type: "agent" | "user", text: string, addToHistory = true) => {
      const message: Message = {
        id: Date.now().toString() + Math.random(),
        type,
        text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);

      if (addToHistory) {
        setConversationHistory((prev) => [
          ...prev,
          { role: type === "user" ? "user" : "assistant", content: text },
        ]);
      }
    },
    []
  );

  const getClaudeResponse = useCallback(
    async (userMessage?: string) => {
      setIsLoading(true);

      try {
        const messagesToSend = [...conversationHistory];

        if (userMessage) {
          messagesToSend.push({ role: "user", content: userMessage });
        } else {
          messagesToSend.push({
            role: "user",
            content: "Please begin the oral examination.",
          });
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messagesToSend,
            systemPrompt: systemPromptRef.current,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const data = await response.json();

        if (data.content) {
          if (userMessage) {
            setQuestionCount((prev) => prev + 1);
          }
          addMessage("agent", data.content);
          speak(data.content);
        }
      } catch (error) {
        console.error("Error getting Claude response:", error);
        const errorMsg =
          "I'm sorry, I had trouble processing that. Could you please repeat your answer?";
        addMessage("agent", errorMsg, false);
        speak(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationHistory, addMessage, speak]
  );

  const handleSpeechResult = useCallback(
    (transcript: string) => {
      if (!transcript.trim()) return;

      addMessage("user", transcript);
      setCurrentTranscript("");

      setTimeout(() => {
        getClaudeResponse(transcript);
      }, 500);
    },
    [addMessage, getClaudeResponse]
  );

  const handleInterimResult = useCallback((transcript: string) => {
    setCurrentTranscript(transcript);
  }, []);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onInterim: handleInterimResult,
    language: config.language,
    continuous: true,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentTranscript]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      const timer = setTimeout(() => {
        getClaudeResponse();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, getClaudeResponse]);

  const toggleListening = () => {
    if (!isListening) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      stopListening();
      setCurrentTranscript("");
    } else {
      startListening();
    }
  };

  const handleSkipQuestion = () => {
    if (isLoading || isSpeaking) return;
    const skipMessage =
      "I'd like to skip this question and move to a different one.";
    handleSpeechResult(skipMessage);
  };

  const handleEndSession = () => {
    stopListening();
    stopSpeaking();

    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const record: SessionRecord = {
      id: Date.now().toString(),
      topic: config.topic.name,
      questions: questionCount,
      timestamp: new Date(),
      duration,
    };

    onEndSession(record);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <div className="text-3xl">{config.topic.icon}</div>
          </div>
          <h2 className="text-xl font-semibold mb-1">{config.topic.name}</h2>
          <div className="flex items-center gap-4 text-blue-100 text-sm">
            <span>Questions: {questionCount}</span>
            <span>•</span>
            <span className="capitalize">{config.difficulty}</span>
            <span>•</span>
            <span>{config.duration} min</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 h-96 overflow-y-auto space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Starting exam session...</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.type === "agent" && (
                      <Volume2 className="w-4 h-4 text-purple-600" />
                    )}
                    <span
                      className={`text-xs ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}>
                      {message.type === "agent" ? "Examiner" : "You"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}

            {currentTranscript && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 bg-blue-400 text-white opacity-80">
                  <p className="text-sm">{currentTranscript}...</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {isSpeaking && !isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"
                        style={{ animationDelay: "0.15s" }}></div>
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"
                        style={{ animationDelay: "0.3s" }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Speaking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={toggleListening}
              disabled={isLoading}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}>
              {isListening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>

            <p className="text-gray-600 text-sm">
              {!isListening
                ? "Speech recognition not supported"
                : isLoading
                ? "Please wait..."
                : isListening
                ? "Listening... Click to stop"
                : isSpeaking
                ? "Examiner is speaking..."
                : "Click to start speaking"}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleSkipQuestion}
                disabled={isLoading || isSpeaking}
                className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2">
                <SkipForward className="w-4 h-4" />
                Skip Question
              </button>
              <button
                onClick={handleEndSession}
                className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center gap-2">
                <Square className="w-4 h-4" />
                End Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for Success</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Speak clearly and at a natural pace</li>
          <li>• Take a moment to think before answering</li>
          <li>• Use complete sentences in your responses</li>
          <li>• The AI examiner will adapt based on your answers</li>
        </ul>
      </div>
    </div>
  );
}