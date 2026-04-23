"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { Movie, MovieCreate } from "@/lib/types";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

const movieSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  genre: z.string().optional(),
  release_year: z.coerce
    .number()
    .min(1800)
    .max(2100)
    .optional()
    .or(z.literal("")),
  rating: z.coerce
    .number()
    .min(0)
    .max(10)
    .optional()
    .or(z.literal("")),
  duration_minutes: z.coerce
    .number()
    .min(1)
    .optional()
    .or(z.literal("")),
  director: z.string().optional(),
  poster_url: z.string().url().optional().or(z.literal("")),
  backdrop_url: z.string().url().optional().or(z.literal("")),
});

type MovieFormData = z.infer<typeof movieSchema>;

interface MovieFormModalProps {
  movie?: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MovieCreate) => Promise<void>;
}

export function MovieFormModal({
  movie,
  open,
  onOpenChange,
  onSubmit,
}: MovieFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!movie;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      release_year: "",
      rating: "",
      duration_minutes: "",
      director: "",
      poster_url: "",
      backdrop_url: "",
    },
  });

  const selectedGenre = watch("genre");

  useEffect(() => {
    if (movie) {
      reset({
        title: movie.title,
        description: movie.description || "",
        genre: movie.genre || "",
        release_year: movie.release_year || "",
        rating: movie.rating || "",
        duration_minutes: movie.duration_minutes || "",
        director: movie.director || "",
        poster_url: movie.poster_url || "",
        backdrop_url: movie.backdrop_url || "",
      });
    } else {
      reset({
        title: "",
        description: "",
        genre: "",
        release_year: "",
        rating: "",
        duration_minutes: "",
        director: "",
        poster_url: "",
        backdrop_url: "",
      });
    }
  }, [movie, reset]);

  const handleFormSubmit = async (data: MovieFormData) => {
    setIsSubmitting(true);
    try {
      const submitData: MovieCreate = {
        title: data.title,
      };

      if (data.description) submitData.description = data.description;
      if (data.genre) submitData.genre = data.genre;
      if (data.release_year && data.release_year !== "") {
        submitData.release_year = Number(data.release_year);
      }
      if (data.rating && data.rating !== "") {
        submitData.rating = Number(data.rating);
      }
      if (data.duration_minutes && data.duration_minutes !== "") {
        submitData.duration_minutes = Number(data.duration_minutes);
      }
      if (data.director) submitData.director = data.director;
      if (data.poster_url) submitData.poster_url = data.poster_url;
      if (data.backdrop_url) submitData.backdrop_url = data.backdrop_url;

      await onSubmit(submitData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border/50 bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Edit Movie" : "Add New Movie"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter movie title"
              className="border-border/50 bg-background/50"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter movie description"
              rows={3}
              className="border-border/50 bg-background/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={selectedGenre}
                onValueChange={(value) => setValue("genre", value)}
              >
                <SelectTrigger className="border-border/50 bg-background/50">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="release_year">Release Year</Label>
              <Input
                id="release_year"
                type="number"
                {...register("release_year")}
                placeholder="e.g., 2024"
                className="border-border/50 bg-background/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-10)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                {...register("rating")}
                placeholder="e.g., 8.5"
                className="border-border/50 bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                {...register("duration_minutes")}
                placeholder="e.g., 120"
                className="border-border/50 bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="director">Director</Label>
            <Input
              id="director"
              {...register("director")}
              placeholder="Enter director name"
              className="border-border/50 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poster_url">Poster URL</Label>
            <Input
              id="poster_url"
              {...register("poster_url")}
              placeholder="https://..."
              className="border-border/50 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backdrop_url">Backdrop URL</Label>
            <Input
              id="backdrop_url"
              {...register("backdrop_url")}
              placeholder="https://..."
              className="border-border/50 bg-background/50"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2" />}
              {isEditing ? "Save Changes" : "Add Movie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
