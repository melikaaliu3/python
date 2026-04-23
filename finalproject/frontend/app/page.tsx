"use client";

import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";
import { MovieFilters } from "@/components/movie-filters";
import { MovieGrid } from "@/components/movie-grid";
import { MovieDetailModal } from "@/components/movie-detail-modal";
import { MovieFormModal } from "@/components/movie-form-modal";
import { DeleteDialog } from "@/components/delete-dialog";
import {
  getMovies,
  getGenres,
  getStats,
  createMovie,
  updateMovie,
  deleteMovie,
} from "@/lib/api";
import type { Movie, MovieCreate } from "@/lib/types";

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function HomePage() {
  // Filter state
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Debounced search for API calls
  const debouncedSearch = useDebounce(search, 300);

  // Modal state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  // Data fetching with SWR
  const {
    data: moviesData,
    isLoading: isLoadingMovies,
    mutate: mutateMovies,
  } = useSWR(
    ["movies", debouncedSearch, genre, sortBy, sortOrder],
    () =>
      getMovies({
        search: debouncedSearch || undefined,
        genre: genre !== "all" ? genre : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
    { revalidateOnFocus: false }
  );

  const { data: genresData } = useSWR("genres", getGenres, {
    revalidateOnFocus: false,
  });

  const { data: statsData, isLoading: isLoadingStats, mutate: mutateStats } = useSWR(
    "stats",
    getStats,
    { revalidateOnFocus: false }
  );

  // Event handlers
  const handleAddMovie = useCallback(() => {
    setEditingMovie(null);
    setFormModalOpen(true);
  }, []);

  const handleEditMovie = useCallback((movie: Movie) => {
    setEditingMovie(movie);
    setFormModalOpen(true);
  }, []);

  const handleDeleteMovie = useCallback((movie: Movie) => {
    setDeletingMovie(movie);
    setDeleteDialogOpen(true);
  }, []);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setDetailModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: MovieCreate) => {
      try {
        if (editingMovie) {
          await updateMovie(editingMovie.id, data);
          toast.success("Movie updated successfully");
        } else {
          await createMovie(data);
          toast.success("Movie added successfully");
        }
        mutateMovies();
        mutateStats();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An error occurred");
        throw error;
      }
    },
    [editingMovie, mutateMovies, mutateStats]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingMovie) return;
    try {
      await deleteMovie(deletingMovie.id);
      toast.success("Movie deleted successfully");
      mutateMovies();
      mutateStats();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
  }, [deletingMovie, mutateMovies, mutateStats]);

  return (
    <div className="min-h-screen bg-background">
      <Header onAddMovie={handleAddMovie} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Section */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Overview</h2>
            <StatsCards stats={statsData} isLoading={isLoadingStats} />
          </section>

          {/* Filters Section */}
          <section>
            <MovieFilters
              search={search}
              onSearchChange={setSearch}
              genre={genre}
              onGenreChange={setGenre}
              genres={genresData?.genres ?? []}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
          </section>

          {/* Movies Grid */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Movies{" "}
                {moviesData?.count !== undefined && (
                  <span className="text-muted-foreground">({moviesData.count})</span>
                )}
              </h2>
            </div>
            <MovieGrid
              movies={moviesData?.movies}
              isLoading={isLoadingMovies}
              onEdit={handleEditMovie}
              onDelete={handleDeleteMovie}
              onClick={handleMovieClick}
            />
          </section>
        </div>
      </main>

      {/* Modals */}
      <MovieDetailModal
        movie={selectedMovie}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onEdit={handleEditMovie}
        onDelete={handleDeleteMovie}
      />

      <MovieFormModal
        movie={editingMovie}
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        onSubmit={handleFormSubmit}
      />

      <DeleteDialog
        movie={deletingMovie}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
