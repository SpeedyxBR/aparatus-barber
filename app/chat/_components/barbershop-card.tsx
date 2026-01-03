"use client";

import { MapPin, Star, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";

interface Service {
  id: string;
  name: string;
  price: number;
}

interface BarbershopCardProps {
  barbershopId: string;
  name: string;
  address: string;
  imageUrl?: string;
  rating?: number;
  services: Service[];
  onSelect?: (barbershopId: string) => void;
}

export const BarbershopCard = ({
  barbershopId,
  name,
  address,
  imageUrl,
  rating = 4.8,
  services,
  onSelect,
}: BarbershopCardProps) => {
  const displayedServices = services.slice(0, 3);
  const remainingServices = services.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative h-32 w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/40">
                {name.charAt(0)}
              </span>
            </div>
          )}
          {/* Rating Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm flex items-center gap-1"
            >
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-base line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="text-xs line-clamp-1">{address}</span>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5">
            {displayedServices.map((service) => (
              <Badge
                key={service.id}
                variant="outline"
                className="text-xs font-normal"
              >
                {service.name} • R$ {service.price.toFixed(0)}
              </Badge>
            ))}
            {remainingServices > 0 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{remainingServices} mais
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <Button
            variant="default"
            className="w-full group/btn"
            onClick={() => onSelect?.(barbershopId)}
          >
            <Clock className="size-4 mr-2" />
            Ver Horários
            <ChevronRight className="size-4 ml-auto transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
