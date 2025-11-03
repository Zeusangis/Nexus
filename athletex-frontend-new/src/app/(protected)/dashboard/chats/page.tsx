"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic } from "lucide-react";
import { useFetchChat, useSendChatMessage } from "@/utils/getChat";
import { useGetUser } from "@/utils/getUser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "@/store/chat-store";

export default function ChatPage() {
  const { data: chatData, isLoading, isError } = useFetchChat();
  const { data: currentUser } = useGetUser();
  const sendMessage = useSendChatMessage();

  // Use Zustand store instead of local state
  const {
    messages,
    addMessage,
    clearMessages,
    isExpired,
    initializeWithWelcome,
  } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages with first response from API or from cache
  useEffect(() => {
    if (chatData) {
      const welcomeMessage =
        chatData.message ||
        "Hello! How can I help you with your training today?";

      // Check if cache is expired
      if (isExpired()) {
        clearMessages();
      }

      // Initialize with welcome message if empty
      initializeWithWelcome(welcomeMessage);
    }
  }, [chatData, isExpired, clearMessages, initializeWithWelcome]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea as content changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const messageText = inputValue;

      // Add user message immediately using Zustand
      addMessage({
        text: messageText,
        sender: "user",
        avatar: "/diverse-user-avatars.png",
      });
      setInputValue("");

      try {
        // Send message to API with correct structure matching FastAPI ChatRequest model
        const response = await sendMessage.mutateAsync({
          username: currentUser?.data?.user?.email || "user",
          user_input: messageText,
          input_params: {
            data: "chat", // "chat" or "exercise"
            height: 175,
            weight: 70,
            gender: "male",
            age: 25,
            training_type: "strength",
            experience_level: "intermediate",
            limitations: "none",
          },
        });

        // Add assistant response using Zustand
        addMessage({
          text:
            response.response || response.message || "I received your message.",
          sender: "assistant",
        });
      } catch (error) {
        // Add error message using Zustand
        addMessage({
          text: "Sorry, I couldn't process your message. Please try again.",
          sender: "assistant",
        });
        console.error("Chat error:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-semibold text-foreground">Chat</h1>
          {isLoading && (
            <p className="text-xs text-muted-foreground">Connecting to AI...</p>
          )}
          {isError && (
            <p className="text-xs text-destructive">Connection failed</p>
          )}
          {chatData && <p className="text-xs text-green-600">Connected ✓</p>}
        </div>
      </header>

      {/* Messages */}
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-4 py-8">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Loading chat...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Start a conversation...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage
                    src={
                      message.sender === "user"
                        ? message.avatar
                        : "/placeholder.svg?height=36&width=36&query=gemini+logo"
                    }
                  />
                  <AvatarFallback>
                    {message.sender === "user" ? "U" : "G"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.sender === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-2 ml-4 list-disc space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="mb-2 ml-4 list-decimal space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-muted-foreground/10 px-1 py-0.5 text-xs">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="mb-2 overflow-x-auto rounded bg-muted-foreground/10 p-2">
                              {children}
                            </pre>
                          ),
                          h1: ({ children }) => (
                            <h1 className="mb-2 text-lg font-bold">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="mb-2 text-base font-bold">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="mb-2 text-sm font-semibold">
                              {children}
                            </h3>
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src="/placeholder.svg?height=36&width=36&query=gemini+logo" />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-2xl bg-muted px-5 py-3 text-foreground">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Gemini-style Input Area */}
      <div className="border-t border-border bg-card px-4 py-4">
        <div className="mx-auto w-full max-w-4xl">
          <div className="relative flex items-end gap-2 rounded-3xl border border-input bg-background px-4 py-3 shadow-sm transition-all focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>

            {/* Auto-expanding Textarea */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter a prompt here"
              rows={1}
              className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />

            {/* Voice Input Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Mic className="h-5 w-5" />
              <span className="sr-only">Voice input</span>
            </Button>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={
                !inputValue.trim() || isLoading || sendMessage.isPending
              }
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>

          {/* Helper Text */}
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Gemini can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
