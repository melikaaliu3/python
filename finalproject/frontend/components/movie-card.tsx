"use client";

import Image from "next/image";
import { Star, Clock, Calendar, User, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Movie } from "@/lib/types";

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onClick: (movie: Movie) => void;
}

export function MovieCard({ movie, onEdit, onDelete, onClick }: MovieCardProps) {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.poster_url ? (
          <Image
            src={movie.poster_url}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-4xl font-bold text-muted-foreground/30">
              {movie.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Rating badge */}
        {movie.rating && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-foreground">{movie.rating}</span>
          </div>
        )}

        {/* Actions menu */}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(movie);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(movie);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">
            {movie.title}
          </h3>
        </div>

        {movie.genre && (
          <Badge variant="secondary" className="mb-3 text-xs">
            {movie.genre}
          </Badge>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {movie.release_year && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{movie.release_year}</span>
            </div>
          )}
          {movie.duration_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{Math.floor(movie.duration_minutes / 60)}h {movie.duration_minutes % 60}m</span>
            </div>
          )}
          {movie.director && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="line-clamp-1">{movie.director}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
