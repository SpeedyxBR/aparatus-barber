"use client";

import { Bot, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  isTyping?: boolean;
  className?: string;
}

export const ChatHeader = ({ isTyping = false, className }: ChatHeaderProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 border-b border-border bg-card/80 backdrop-blur-sm",
        className
      )}
    >
      {/* Avatar with Status */}
      <div className="relative">
        <Avatar className="size-10 ring-2 ring-primary/20">
          <AvatarFallback className="bg-primary/10">
            <Bot className="size-5 text-primary" />
          </AvatarFallback>
        </Avatar>
        {/* Status Indicator */}
        <motion.div
          animate={
            isTyping
              ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            isTyping
              ? { duration: 1.5, repeat: Infinity }
              : { duration: 0.3 }
          }
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-card",
            isTyping ? "bg-yellow-500" : "bg-green-500"
          )}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-foreground">
          Aparatus.ai
        </h2>
        <div className="flex items-center gap-1.5">
          {isTyping ? (
            <motion.div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Digitando</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs text-muted-foreground"
              >
                ...
              </motion.span>
            </motion.div>
          ) : (
            <>
              <Wifi className="size-3 text-green-500" />
              <span className="text-xs text-muted-foreground">
                Assistente de agendamentos online
              </span>
            </>
          )}
        </div>
      </div>

      {/* Optional: Settings or more options */}
      {/* <Button variant="ghost" size="icon">
        <Settings className="size-4" />
      </Button> */}
    </div>
  );
};
