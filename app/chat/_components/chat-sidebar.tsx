"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquarePlus,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/_components/ui/avatar";
import { Separator } from "@/app/_components/ui/separator";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory?: ChatHistory[];
  currentChatId?: string;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  user?: {
    name: string;
    email: string;
    image?: string;
  } | null;
  onLogout?: () => void;
}

export const ChatSidebar = ({
  isOpen,
  onToggle,
  chatHistory = [],
  currentChatId,
  onNewChat,
  onSelectChat,
  user,
  onLogout,
}: ChatSidebarProps) => {
  const recentChats = chatHistory.slice(0, 10);

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 z-40 h-screen w-[320px] bg-sidebar border-r border-sidebar-border flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-merriweather text-xl italic text-sidebar-foreground">
                  Aparatus
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ChevronLeft className="size-5" />
              </Button>
            </div>

            <Separator className="bg-sidebar-border" />

            {/* New Chat Button */}
            <div className="p-3">
              <Button
                onClick={onNewChat}
                className="w-full justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              >
                <MessageSquarePlus className="size-4" />
                Nova Conversa
              </Button>
            </div>

            <Separator className="bg-sidebar-border" />

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <p className="px-3 py-2 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                Conversas Recentes
              </p>
              {recentChats.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <MessageCircle className="size-8 mx-auto text-sidebar-foreground/30 mb-2" />
                  <p className="text-sm text-sidebar-foreground/50">
                    Nenhuma conversa ainda
                  </p>
                  <p className="text-xs text-sidebar-foreground/40 mt-1">
                    Inicie uma nova conversa
                  </p>
                </div>
              ) : (
                recentChats.map((chat) => (
                  <motion.button
                    key={chat.id}
                    whileHover={{ x: 4 }}
                    onClick={() => onSelectChat?.(chat.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                      currentChatId === chat.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="size-4 shrink-0 opacity-60" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs opacity-60 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            <Separator className="bg-sidebar-border" />

            {/* User Section */}
            <div className="p-3">
              {user ? (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/30">
                  <Avatar className="size-10 ring-2 ring-sidebar-border">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className="text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground"
                  >
                    <User className="size-4" />
                    Fazer Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle Button (when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            onClick={onToggle}
            className="fixed left-4 top-4 z-30 size-10 rounded-lg bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronRight className="size-5 text-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};
