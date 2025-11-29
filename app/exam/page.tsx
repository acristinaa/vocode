"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useExamStore } from "@/store/examStore";
import { VoiceAgent } from "@/components/VoiceAgent";
import { SessionRecord } from "@/types/index";

const emptySubscribe = () => () => {};

export default function ExamPage() {
  const router = useRouter();
  const { config, addSession, clearConfig, startSession, endSession } =
    useExamStore();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!isClient) return;

    if (!config) {
      router.push("/");
    } else {
      startSession();
    }
  }, [isClient, config, router, startSession]);

  const handleEndSession = (record: SessionRecord) => {
    addSession(record);
    endSession();
    clearConfig();
    router.push("/");
  };

  const handleBack = () => {
    endSession();
    clearConfig();
    router.push("/");
  };

  if (!isClient || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam session...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <VoiceAgent
        config={config}
        onEndSession={handleEndSession}
        onBack={handleBack}
      />
    </main>
  );
}