"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Web Speech API type declarations
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void;
  onInterim?: (transcript: string) => void;
  onEnd?: () => void;
  language?: string;
  continuous?: boolean;
}

export function useSpeechRecognition({
  onResult,
  onInterim,
  onEnd,
  language = "en-US",
  continuous = true,
}: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  // Check if Speech Recognition is supported
  const isSupported =
    typeof window !== "undefined" &&
    (typeof (window as unknown as { SpeechRecognition?: unknown })
      .SpeechRecognition !== "undefined" ||
      typeof (window as unknown as { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition !== "undefined");

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const windowWithSR = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    };

    const SpeechRecognitionAPI =
      windowWithSR.SpeechRecognition || windowWithSR.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript.trim());
      } else if (interimTranscript && onInterim) {
        onInterim(interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech" && event.error !== "aborted") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current && continuous) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Error restarting recognition:", e);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
        onEnd?.();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language, continuous, onResult, onInterim, onEnd]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error("Error starting recognition:", e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      console.error("Error stopping recognition:", e);
    }
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
}