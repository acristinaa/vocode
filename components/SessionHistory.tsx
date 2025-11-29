"use client";

import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { SessionRecord } from "@/types/index";
import { useExamStore } from "@/store/examStore";

interface SessionHistoryProps {
  sessions?: SessionRecord[];
}

export function SessionHistory({
  sessions: propSessions,
}: SessionHistoryProps) {
  const { sessions: storeSessions, clearSessions } = useExamStore();
  const sessions = propSessions || storeSessions;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTime = (date: Date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(dateObj);
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-gray-400 text-4xl mb-3">📚</div>
        <p className="text-gray-600">No practice sessions yet.</p>
        <p className="text-gray-500 text-sm">
          Start your first exam to see your history here!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-800 text-xl font-semibold">
          Recent Practice Sessions
        </h2>
        {sessions.length > 0 && (
          <button
            onClick={clearSessions}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {session.topic}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatTime(session.timestamp)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      {session.questions}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {formatDuration(session.duration)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}