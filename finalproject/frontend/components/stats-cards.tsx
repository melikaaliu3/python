"use client";

import { Film, Star, Clock, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { MovieStats } from "@/lib/types";

interface StatsCardsProps {
  stats: MovieStats | undefined;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Movies",
      value: stats?.total_movies ?? 0,
      icon: Film,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Average Rating",
      value: stats?.average_rating ? `${stats.average_rating}/10` : "N/A",
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Genres",
      value: stats?.genres_count ?? 0,
      icon: Layers,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Total Hours",
      value: stats?.total_duration_hours ? `${stats.total_duration_hours}h` : "0h",
      icon: Clock,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              {isLoading ? (
                <div className="mt-1 h-7 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
