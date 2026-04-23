"use client";

import { Film } from "lucide-react";
import { MovieCard } from "./movie-card";
import type { Movie } from "@/lib/types";

interface MovieGridProps {
  movies: Movie[] | undefined;
  isLoading: boolean;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onClick: (movie: Movie) => void;
}

function MovieSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50">
      <div className="aspect-[2/3] animate-pulse bg-muted" />
      <div className="p-4">
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mb-3 h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="flex gap-4">
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function MovieGrid({ movies, isLoading, onEdit, onDelete, onClick }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <MovieSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Film className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No movies found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or add a new movie.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
