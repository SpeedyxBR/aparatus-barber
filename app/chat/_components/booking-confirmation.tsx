"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Scissors,
  CreditCard,
  Check,
  Edit2,
} from "lucide-react";
import Image from "next/image";
import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { Separator } from "@/app/_components/ui/separator";

interface BookingConfirmationProps {
  barbershopName: string;
  barbershopAddress?: string;
  barbershopImageUrl?: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  onConfirm?: () => void;
  onEdit?: () => void;
  isLoading?: boolean;
}

export const BookingConfirmation = ({
  barbershopName,
  barbershopAddress,
  barbershopImageUrl,
  serviceName,
  servicePrice,
  date,
  time,
  onConfirm,
  onEdit,
  isLoading = false,
}: BookingConfirmationProps) => {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-border bg-card shadow-lg">
        {/* Header with Image */}
        <div className="relative h-24 sm:h-32 w-full overflow-hidden">
          {barbershopImageUrl ? (
            <Image
              src={barbershopImageUrl}
              alt={barbershopName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/30 to-accent/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-semibold text-foreground text-lg line-clamp-1">
              {barbershopName}
            </h3>
            {barbershopAddress && (
              <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                <MapPin className="size-3" />
                <span className="text-xs line-clamp-1">{barbershopAddress}</span>
              </div>
            )}
          </div>
          <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
            Agendamento
          </Badge>
        </div>

        {/* Details */}
        <div className="p-4 space-y-4">
          {/* Service */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Scissors className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {serviceName}
                </p>
                <p className="text-xs text-muted-foreground">Serviço</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm font-semibold">
              R$ {servicePrice.toFixed(2)}
            </Badge>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-accent/50 flex items-center justify-center">
                <Calendar className="size-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground capitalize">
                  {formattedDate.split(",")[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formattedDate.split(",").slice(1).join(",").trim()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-accent/50 flex items-center justify-center">
                <Clock className="size-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{time}</p>
                <p className="text-xs text-muted-foreground">Horário</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total a pagar</span>
            </div>
            <span className="text-lg font-bold text-foreground">
              R$ {servicePrice.toFixed(2)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={onEdit}
                disabled={isLoading}
              >
                <Edit2 className="size-4 mr-2" />
                Alterar
              </Button>
            )}
            {onConfirm && (
              <Button
                className="flex-1"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Check className="size-4 mr-2" />
                    Confirmar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
