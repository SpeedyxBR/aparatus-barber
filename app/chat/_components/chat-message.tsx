"use client";

import { UIMessage } from "ai";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import { Streamdown } from "streamdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
  userImage?: string;
  userName?: string;
}

export const ChatMessage = ({
  message,
  isStreaming = false,
  userImage,
  userName,
}: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const content = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  // System message
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex w-full flex-col gap-3 px-4 sm:px-6 pt-4 pb-0"
      >
        <div className="border border-border rounded-xl p-3 mx-auto max-w-md bg-card/50 backdrop-blur-sm">
          <p className="text-muted-foreground text-sm text-center leading-relaxed">
            {content}
          </p>
        </div>
      </motion.div>
    );
  }

  // User message
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex w-full items-end justify-end gap-2 pt-4 px-4 sm:px-6"
      >
        <div className="flex flex-col items-end gap-1 max-w-[80%] sm:max-w-[70%] lg:max-w-[60%]">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
        </div>
        <Avatar className="size-8 shrink-0 ring-2 ring-primary/20">
          <AvatarImage src={userImage} alt={userName || "Você"} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {userName?.charAt(0).toUpperCase() || <User className="size-4" />}
          </AvatarFallback>
        </Avatar>
      </motion.div>
    );
  }

  // Assistant message
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex w-full items-start gap-2 pt-4 px-4 sm:px-6"
    >
      <Avatar className="size-8 shrink-0 ring-2 ring-primary/20 mt-0.5">
        <AvatarFallback className="bg-primary/10">
          <Bot className="size-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 max-w-[80%] sm:max-w-[70%] lg:max-w-[60%]">
        <div
          className={cn(
            "bg-card border border-border rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm",
            isStreaming && "animate-pulse"
          )}
        >
          <div className="text-sm text-foreground leading-relaxed prose prose-sm prose-neutral dark:prose-invert max-w-none">
            <Streamdown>{content}</Streamdown>
          </div>
        </div>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 px-2"
          >
            <span className="text-xs text-muted-foreground">Digitando</span>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex gap-0.5"
            >
              <span className="size-1 rounded-full bg-primary/60" />
              <span className="size-1 rounded-full bg-primary/60" />
              <span className="size-1 rounded-full bg-primary/60" />
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
