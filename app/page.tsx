"use client";

import { Mic } from "lucide-react";
import { TopicSelector } from "@/components/TopicSelector";
import { SessionHistory } from "@/components/SessionHistory";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vocode
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice for any oral exam with an AI voice assessor. Choose your
            topic, speak your answers, and get real-time feedback.
          </p>
        </header>

        <TopicSelector />

        <SessionHistory />

        {/* Browser Support Notice */}
        <div className="text-center text-sm text-gray-500">
          <p>
            💡 For best results, use <strong>Chrome</strong> or{" "}
            <strong>Edge</strong> browser with a working microphone.
          </p>
        </div>
      </div>
    </main>
  );
}
