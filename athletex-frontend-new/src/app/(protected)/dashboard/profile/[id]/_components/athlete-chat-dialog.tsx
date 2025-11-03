"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Loader2, Activity } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGetUser } from "@/utils/getUser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AthleteChatDialogProps {
  athleteId: string;
  athleteName: string;
}

interface DailyLogData {
  kneePain: number;
  legFreshness: number;
  sleepHours: number;
  trainingIntensity: number;
  aclInjuryScore: number;
  stiffnessLevel: number;
  calorieIntake: number;
}

export const AthleteChatDialog: React.FC<AthleteChatDialogProps> = ({
  athleteId,
  athleteName,
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { data: currentUserData } = useGetUser();

  // Fetch athlete's daily logs
  const { data: dailyLogsData } = useQuery({
    queryKey: ["dailyLogs", athleteId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/daily-logs/user/${athleteId}`
      );
      console.log("Daily logs response:", response.data);
      return response.data;
    },
    enabled: open, // Only fetch when dialog is open
  });

  // Calculate weekly averages
  const calculateWeeklySummary = (logs: DailyLogData[]) => {
    if (!logs || logs.length === 0) {
      return {
        avg_pain: 0,
        avg_freshness: 0,
        avg_sleep: 0,
        avg_intensity: 0,
        avg_risk: 0,
        stiff_days: 0,
        avg_calories: 0,
      };
    }

    const recent = logs.slice(-7); // Last 7 days
    return {
      avg_pain: (
        recent.reduce((sum, log) => sum + (log.kneePain || 0), 0) /
        recent.length
      ).toFixed(1),
      avg_freshness: (
        recent.reduce((sum, log) => sum + (log.legFreshness || 0), 0) /
        recent.length
      ).toFixed(1),
      avg_sleep: (
        recent.reduce((sum, log) => sum + (log.sleepHours || 0), 0) /
        recent.length
      ).toFixed(1),
      avg_intensity: (
        recent.reduce((sum, log) => sum + (log.trainingIntensity || 0), 0) /
        recent.length
      ).toFixed(1),
      avg_risk: (
        recent.reduce((sum, log) => sum + (log.aclInjuryScore || 0), 0) /
        recent.length
      ).toFixed(1),
      stiff_days: recent.filter((log) => log.stiffnessLevel > 5).length,
      avg_calories: (
        recent.reduce((sum, log) => sum + (log.calorieIntake || 0), 0) /
        recent.length
      ).toFixed(0),
    };
  };

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const logs = dailyLogsData?.data || [];
      const latestLog = logs[logs.length - 1] || {};
      const weeklySummary = calculateWeeklySummary(logs);

      const response = await axios.post("http://localhost:8080/coach", {
        coach_name: currentUserData?.data?.user?.fullName || "Coach",
        player_name: athleteName,
        daily: {
          kneePain: latestLog.kneePain || 0,
          legFreshness: latestLog.legFreshness || 0,
          sleepHours: latestLog.sleepHours || 0,
          trainingIntensity: latestLog.trainingIntensity || 0,
          aclInjuryScore: latestLog.aclInjuryScore || 0,
          stiffnessLevel: latestLog.stiffnessLevel || 0,
          calorieIntake: latestLog.calorieIntake || 0,
        },
        weekly: weeklySummary,
        mode: "chat",
        input: message,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.summary || "No response",
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
      console.error("Chat error:", error);
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[700px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            AI Chat - {athleteName}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Ask questions about the athlete&apos;s daily logs, performance, and
            recommendations
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-base font-medium mb-2">
                  Start a conversation about {athleteName}&apos;s performance
                </p>
                <p className="text-sm text-muted-foreground">
                  Try asking: &quot;What are the trends in their daily
                  logs?&quot;
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`w-full rounded-2xl p-4 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                        : "bg-card border border-border"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Badge variant="secondary" className="mb-3 text-xs">
                        <Activity className="h-3 w-3 mr-1" />
                        AI Coach
                      </Badge>
                    )}
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none w-full">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ ...props }) => (
                              <h1
                                className="text-xl font-bold mt-4 mb-2"
                                {...props}
                              />
                            ),
                            h2: ({ ...props }) => (
                              <h2
                                className="text-lg font-semibold mt-3 mb-2"
                                {...props}
                              />
                            ),
                            h3: ({ ...props }) => (
                              <h3
                                className="text-base font-semibold mt-2 mb-1"
                                {...props}
                              />
                            ),
                            p: ({ ...props }) => (
                              <p className="mb-2 leading-relaxed" {...props} />
                            ),
                            ul: ({ ...props }) => (
                              <ul
                                className="list-disc ml-4 mb-2 space-y-1"
                                {...props}
                              />
                            ),
                            ol: ({ ...props }) => (
                              <ol
                                className="list-decimal ml-4 mb-2 space-y-1"
                                {...props}
                              />
                            ),
                            li: ({ ...props }) => (
                              <li className="mb-1" {...props} />
                            ),
                            strong: ({ ...props }) => (
                              <strong className="font-semibold" {...props} />
                            ),
                            em: ({ ...props }) => (
                              <em className="italic" {...props} />
                            ),
                            code: ({ className, ...props }) => {
                              const isInline =
                                !className?.includes("language-");
                              return isInline ? (
                                <code
                                  className="bg-muted px-1 py-0.5 rounded text-sm"
                                  {...props}
                                />
                              ) : (
                                <code
                                  className="block bg-muted p-2 rounded text-sm overflow-x-auto"
                                  {...props}
                                />
                              );
                            },
                            blockquote: ({ ...props }) => (
                              <blockquote
                                className="border-l-4 border-blue-500 pl-4 italic my-2"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap w-full">
                        {message.content}
                      </p>
                    )}

                    <span
                      className={`text-xs mt-2 block ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
            {chatMutation.isPending && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm w-full">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-muted-foreground">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about daily logs, performance trends, or get recommendations..."
              className="min-h-[80px] max-h-[120px] resize-none bg-background border-2 focus:border-blue-500 transition-colors"
              disabled={chatMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              size="icon"
              className="h-[80px] w-[80px] rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
            >
              {chatMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
