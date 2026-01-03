"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, Menu, Bot } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./_components/chat-message";
import { ChatInput } from "./_components/chat-input";
import { ChatSidebar } from "./_components/chat-sidebar";
import { ChatHeader } from "./_components/chat-header";
import { Button } from "@/app/_components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGES = [
  {
    id: "system-welcome",
    role: "system" as const,
    parts: [
      {
        type: "text" as const,
        text: "Seu assistente de agendamentos está online.",
      },
    ],
  },
  {
    id: "assistant-welcome",
    role: "assistant" as const,
    parts: [
      {
        type: "text" as const,
        text: "Olá! Sou o Aparatus, seu assistente pessoal. 👋\n\nEstou aqui para te auxiliar a:\n\n• **Encontrar barbearias** próximas a você\n• **Agendar seu corte ou barba** de forma rápida\n• **Responder suas dúvidas** sobre serviços e horários\n\nComo posso te ajudar hoje?",
      },
    ],
  },
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get user session
  const { data: session } = authClient.useSession();

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (err) => {
      console.error("[CHAT] Error:", err);
      // Parse error message if it's a JSON response
      try {
        const parsed = JSON.parse(err.message);
        setErrorMessage(parsed.message || "Ocorreu um erro. Tente novamente.");
      } catch {
        if (err.message.includes("429") || err.message.includes("quota")) {
          setErrorMessage("😅 O serviço está temporariamente indisponível. Tente novamente em alguns minutos.");
        } else {
          setErrorMessage("😔 Desculpe, ocorreu um erro. Por favor, tente novamente.");
        }
      }
      // Clear error after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    },
  });

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true);
      }
    };
    
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({
        text: input,
      });
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const isLoading = status === "streaming" || status === "submitted";
  const isTyping = status === "streaming";

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <ChatSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={() => window.location.reload()}
          user={session?.user ? {
            name: session.user.name || "Usuário",
            email: session.user.email || "",
            image: session.user.image || undefined,
          } : null}
          onLogout={() => authClient.signOut()}
        />
      )}

      {/* Main Chat Area */}
      <motion.div
        animate={{
          marginLeft: isDesktop && sidebarOpen ? 320 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="flex-1 flex flex-col h-screen relative"
      >
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="size-5 text-muted-foreground" />
            <span className="sr-only">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-merriweather text-lg italic text-foreground">
              Aparatus
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground"
          >
            <Menu className="size-5" />
          </Button>
        </header>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <ChatHeader isTyping={isTyping} />
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto pb-32 sm:pb-36 lg:pb-24 scroll-smooth">
          {/* Background Pattern (Desktop only) */}
          <div className="hidden lg:block fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--background)_100%)]" />
          </div>

          {/* Messages */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="popLayout">
              {messages.length === 0
                ? INITIAL_MESSAGES.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))
                : messages.map((msg, index) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      isStreaming={isTyping && index === messages.length - 1}
                    />
                  ))}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2 px-4 sm:px-6 pt-4"
                >
                  <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="size-4 text-destructive" />
                  </div>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm max-w-[80%]">
                    <p className="text-sm text-destructive leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Indicator */}
            <AnimatePresence>
              {status === "submitted" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 px-4 sm:px-6 pt-4"
                >
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="size-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-1"
                    >
                      <span className="size-2 rounded-full bg-primary/60" />
                      <span className="size-2 rounded-full bg-primary/60" />
                      <span className="size-2 rounded-full bg-primary/60" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="lg:relative lg:w-full lg:max-w-4xl lg:mx-auto">
          <ChatInput
            input={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder="Pergunte sobre barbearias, serviços ou agendamentos..."
          />
        </div>
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      {!isDesktop && (
        <ChatSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(false)}
          onNewChat={() => {
            setSidebarOpen(false);
            window.location.reload();
          }}
          user={session?.user ? {
            name: session.user.name || "Usuário",
            email: session.user.email || "",
            image: session.user.image || undefined,
          } : null}
          onLogout={() => authClient.signOut()}
        />
      )}
    </div>
  );
}
