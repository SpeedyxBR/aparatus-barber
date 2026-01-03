"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Scissors,
  Share2,
  CalendarPlus,
  Home,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { Separator } from "@/app/_components/ui/separator";

interface BookingReceiptProps {
  bookingId?: string;
  barbershopName: string;
  barbershopAddress?: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  onGoHome?: () => void;
}

export const BookingReceipt = ({
  bookingId,
  barbershopName,
  barbershopAddress,
  serviceName,
  servicePrice,
  date,
  time,
  onGoHome,
}: BookingReceiptProps) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleCopyId = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCalendar = () => {
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(":");
    dateObj.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(dateObj.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${serviceName} - ${barbershopName}`
    )}&dates=${dateObj.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]}Z&location=${encodeURIComponent(
      barbershopAddress || ""
    )}&details=${encodeURIComponent(
      `Agendamento confirmado na ${barbershopName}`
    )}`;
    
    window.open(googleCalendarUrl, "_blank");
  };

  const handleShare = async () => {
    const shareData = {
      title: "Meu Agendamento - Aparatus",
      text: `Agendei ${serviceName} na ${barbershopName} para ${formattedDate} às ${time}!`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-border bg-card shadow-lg relative">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 py-8 relative overflow-hidden">
          {/* Confetti Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: -50,
                  x: Math.sin(i * 30 * (Math.PI / 180)) * 60,
                }}
                transition={{
                  delay: 0.3 + i * 0.05,
                  duration: 1,
                  ease: "easeOut",
                }}
                className="absolute size-2 rounded-full bg-primary"
                style={{
                  backgroundColor:
                    i % 3 === 0
                      ? "var(--primary)"
                      : i % 3 === 1
                      ? "var(--accent)"
                      : "var(--chart-2)",
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="size-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Reserva Confirmada!
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Seu agendamento foi realizado com sucesso
            </p>
          </motion.div>
        </div>

        {/* Receipt Body */}
        <div className="p-4 space-y-4">
          {/* Booking ID */}
          {bookingId && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Código da reserva:
                </span>
                <code className="text-xs font-mono text-foreground bg-background px-2 py-0.5 rounded">
                  {bookingId.slice(0, 8).toUpperCase()}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={handleCopyId}
              >
                {copied ? (
                  <Check className="size-3 text-primary" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </motion.div>
          )}

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {/* Barbershop */}
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-lg bg-accent/50 flex items-center justify-center shrink-0">
                <MapPin className="size-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {barbershopName}
                </p>
                {barbershopAddress && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {barbershopAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Service */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-accent/50 flex items-center justify-center shrink-0">
                <Scissors className="size-4 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {serviceName}
                </p>
              </div>
              <Badge variant="secondary">R$ {servicePrice.toFixed(2)}</Badge>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-xs text-foreground capitalize">
                  {formattedDate.split(",")[0]}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-xs text-foreground">{time}</span>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-2"
          >
            <Button variant="outline" size="sm" onClick={handleAddToCalendar}>
              <CalendarPlus className="size-4 mr-1.5" />
              Calendário
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="size-4 mr-1.5" />
              Compartilhar
            </Button>
          </motion.div>

          {onGoHome && (
            <Button className="w-full" onClick={onGoHome}>
              <Home className="size-4 mr-2" />
              Voltar ao Início
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
