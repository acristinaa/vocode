"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface UseSpeechSynthesisProps {
  onStart?: () => void;
  onEnd?: () => void;
  language?: string;
  rate?: number;
  pitch?: number;
}

export function useSpeechSynthesis({
  onStart,
  onEnd,
  language = "en-US",
  rate = 0.95,
  pitch = 1,
}: UseSpeechSynthesisProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check if Speech Synthesis is supported
  const isSupported =
    typeof window !== "undefined" &&
    typeof window.speechSynthesis !== "undefined";

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || !isSupported) return;

      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1;

      const langPrefix = language.split("-")[0];
      const preferredVoice =
        voices.find(
          (v) => v.lang.startsWith(langPrefix) && v.name.includes("Google")
        ) ||
        voices.find((v) => v.lang.startsWith(langPrefix) && v.localService) ||
        voices.find((v) => v.lang.startsWith(langPrefix));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    },
    [isSupported, language, rate, pitch, voices, onStart, onEnd]
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    isSupported,
    voices,
    speak,
    stop,
  };
}