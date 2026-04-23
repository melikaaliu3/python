"use client";

import Image from "next/image";
import { Star, Clock, Calendar, User, X, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/lib/types";

interface MovieDetailModalProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export function MovieDetailModal({
  movie,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: MovieDetailModalProps) {
  if (!movie) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden border-border/50 bg-card p-0">
        <div className="relative">
          {/* Backdrop image */}
          {movie.backdrop_url ? (
            <div className="relative h-64 w-full">
              <Image
                src={movie.backdrop_url}
                alt={movie.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
            </div>
          ) : (
            <div className="h-32 w-full bg-gradient-to-b from-muted to-card" />
          )}

          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>
        </div>

        <div className="relative -mt-20 px-6 pb-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Poster */}
            <div className="relative -mt-12 h-48 w-32 shrink-0 overflow-hidden rounded-lg border-4 border-card shadow-xl md:h-64 md:w-44">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <span className="text-4xl font-bold text-muted-foreground/30">
                    {movie.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <DialogHeader className="text-left">
                <div className="flex items-start justify-between gap-4">
                  <DialogTitle className="text-balance text-2xl font-bold text-foreground">
                    {movie.title}
                  </DialogTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        onOpenChange(false);
                        onEdit(movie);
                      }}
                      className="h-9 w-9"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        onOpenChange(false);
                        onDelete(movie);
                      }}
                      className="h-9 w-9 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {movie.rating && (
                  <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-semibold text-foreground">
                      {movie.rating}/10
                    </span>
                  </div>
                )}
                {movie.genre && (
                  <Badge variant="secondary">{movie.genre}</Badge>
                )}
                {movie.release_year && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.release_year}</span>
                  </div>
                )}
                {movie.duration_minutes && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {Math.floor(movie.duration_minutes / 60)}h {movie.duration_minutes % 60}m
                    </span>
                  </div>
                )}
              </div>

              {movie.director && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Directed by</span>
                  <span className="font-medium text-foreground">{movie.director}</span>
                </div>
              )}

              {movie.description && (
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {movie.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
