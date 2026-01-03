"use client";

import { Mic, Send, Paperclip, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface ChatInputProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput = ({
  input,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "Digite sua mensagem...",
  className,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "bg-card/95 backdrop-blur-md border-t border-border",
        "absolute bottom-0 left-0 right-0 p-3 sm:p-4",
        "lg:static lg:mx-auto lg:max-w-3xl lg:rounded-2xl lg:border lg:shadow-lg lg:mb-4",
        className
      )}
    >
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        {/* Attachment Button - Hidden on mobile */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden sm:flex shrink-0 size-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
          disabled
          title="Em breve: Anexar arquivos"
        >
          <Paperclip className="size-5" />
        </Button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className={cn(
              "w-full resize-none rounded-2xl border border-input bg-background px-4 py-3",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "max-h-[120px] scrollbar-thin scrollbar-thumb-muted"
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Voice Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 size-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
            disabled
            title="Em breve: Gravação de voz"
          >
            <Mic className="size-5" />
          </Button>

          {/* Send Button */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoading ? "loading" : "send"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                type="submit"
                size="icon"
                className={cn(
                  "shrink-0 size-10 rounded-full transition-all duration-200",
                  input.trim() && !isLoading
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground"
                )}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Send className="size-5" />
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </form>

      {/* Typing indicator hint */}
      <AnimatePresence>
        {input.length > 0 && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-muted-foreground mt-2 text-center"
          >
            Pressione Enter para enviar • Shift + Enter para nova linha
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
