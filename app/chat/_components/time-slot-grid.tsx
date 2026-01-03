"use client";

import { motion } from "framer-motion";
import { Clock, Sun, Sunset, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";

interface TimeSlotGridProps {
  availableSlots: string[];
  selectedSlot?: string;
  onSelectSlot?: (slot: string) => void;
  barbershopName?: string;
  date?: string;
}

const getPeriodInfo = (hour: number) => {
  if (hour >= 6 && hour < 12) {
    return { label: "Manhã", icon: Sun, color: "text-yellow-500" };
  } else if (hour >= 12 && hour < 18) {
    return { label: "Tarde", icon: Sunset, color: "text-orange-500" };
  } else {
    return { label: "Noite", icon: Moon, color: "text-indigo-500" };
  }
};

const groupSlotsByPeriod = (slots: string[]) => {
  const groups: Record<string, string[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  slots.forEach((slot) => {
    const hour = parseInt(slot.split(":")[0]);
    if (hour >= 6 && hour < 12) {
      groups.morning.push(slot);
    } else if (hour >= 12 && hour < 18) {
      groups.afternoon.push(slot);
    } else {
      groups.evening.push(slot);
    }
  });

  return groups;
};

export const TimeSlotGrid = ({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  barbershopName,
  date,
}: TimeSlotGridProps) => {
  const groupedSlots = groupSlotsByPeriod(availableSlots);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  const renderPeriodSection = (
    periodKey: string,
    slots: string[],
    periodHour: number
  ) => {
    if (slots.length === 0) return null;

    const { label, icon: Icon, color } = getPeriodInfo(periodHour);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("size-4", color)} />
          <span className="text-sm font-medium text-foreground">{label}</span>
          <Badge variant="secondary" className="text-xs">
            {slots.length} horários
          </Badge>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
        >
          {slots.map((slot) => (
            <motion.div key={slot} variants={item}>
              <Button
                variant={selectedSlot === slot ? "default" : "outline"}
                size="sm"
                className={cn(
                  "w-full h-10 font-mono transition-all duration-200",
                  selectedSlot === slot
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-accent hover:border-primary/50"
                )}
                onClick={() => onSelectSlot?.(slot)}
              >
                <Clock className="size-3.5 mr-1.5" />
                {slot}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  if (availableSlots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-6 text-center"
      >
        <Clock className="size-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Não há horários disponíveis para esta data.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Tente selecionar outro dia.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card p-4 space-y-4"
    >
      {/* Header */}
      {(barbershopName || date) && (
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-0.5">
            {barbershopName && (
              <p className="text-sm font-medium text-foreground">
                {barbershopName}
              </p>
            )}
            {date && (
              <p className="text-xs text-muted-foreground">
                {new Date(date).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {availableSlots.length} disponíveis
          </Badge>
        </div>
      )}

      {/* Time Slots by Period */}
      <div className="space-y-4">
        {renderPeriodSection("morning", groupedSlots.morning, 9)}
        {renderPeriodSection("afternoon", groupedSlots.afternoon, 14)}
        {renderPeriodSection("evening", groupedSlots.evening, 19)}
      </div>

      {/* Selected Indicator */}
      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pt-3 border-t border-border"
        >
          <div className="flex items-center justify-between bg-primary/10 rounded-md px-3 py-2">
            <span className="text-sm text-foreground">Horário selecionado:</span>
            <Badge className="bg-primary text-primary-foreground">
              {selectedSlot}
            </Badge>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
