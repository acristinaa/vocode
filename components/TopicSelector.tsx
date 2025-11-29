"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2 } from "lucide-react";
import { ExamTopic, ExamConfig } from "@/types/index";
import { useExamStore } from "@/store/examStore";
import { defaultTopics } from "@/lib/prompts";

interface TopicSelectorProps {
  topics?: ExamTopic[];
}

export function TopicSelector({ topics = defaultTopics }: TopicSelectorProps) {
  const router = useRouter();
  const setConfig = useExamStore((state) => state.setConfig);

  const [selectedTopic, setSelectedTopic] = useState<ExamTopic | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");
  const [duration, setDuration] = useState(10);
  const [showSettings, setShowSettings] = useState(false);

  const handleTopicSelect = (topic: ExamTopic) => {
    setSelectedTopic(topic);
    setShowSettings(true);
  };

  const handleStartExam = () => {
    if (!selectedTopic) return;

    let finalTopic = selectedTopic;

    if (selectedTopic.id === "custom") {
      if (!customTopic.trim()) return;
      finalTopic = {
        id: "custom",
        name: customTopic,
        description:
          customDescription || `Oral exam practice on ${customTopic}`,
        icon: "✏️",
      };
    }

    const config: ExamConfig = {
      topic: finalTopic,
      difficulty,
      duration,
      language: "en-US",
    };

    setConfig(config);
    router.push("/exam");
  };

  return (
    <div className="space-y-8">
      {/* Topic Grid */}
      <div>
        <h2 className="text-gray-800 text-xl font-semibold mb-6">
          Choose Your Practice Topic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border text-left group ${
                selectedTopic?.id === topic.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-100 hover:border-blue-300"
              }`}>
              <div className="text-4xl mb-3">{topic.icon}</div>
              <h3 className="text-gray-900 font-medium mb-2 group-hover:text-blue-600 transition-colors">
                {topic.name}
              </h3>
              <p className="text-gray-600 text-sm">{topic.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && selectedTopic && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Exam Settings
            </h3>
          </div>

          <div className="space-y-6">
            {/* Custom topic input */}
            {selectedTopic.id === "custom" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic Name *
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g., Machine Learning, World War II, Organic Chemistry"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Add context about what you want to be tested on..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="flex gap-3">
                {(["beginner", "intermediate", "advanced"] as const).map(
                  (level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors capitalize ${
                        difficulty === level
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                      }`}>
                      {level}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration: {duration} minutes
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 min</span>
                <span>30 min</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartExam}
              disabled={selectedTopic.id === "custom" && !customTopic.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
              Start Exam Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}