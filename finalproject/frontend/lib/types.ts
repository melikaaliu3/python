export interface Movie {
  id: string;
  title: string;
  description: string | null;
  genre: string | null;
  release_year: number | null;
  rating: number | null;
  duration_minutes: number | null;
  director: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MovieCreate {
  title: string;
  description?: string;
  genre?: string;
  release_year?: number;
  rating?: number;
  duration_minutes?: number;
  director?: string;
  poster_url?: string;
  backdrop_url?: string;
}

export interface MovieUpdate extends Partial<MovieCreate> {}

export interface MovieStats {
  total_movies: number;
  average_rating: number;
  genres_count: number;
  total_duration_hours: number;
}

export interface MoviesResponse {
  movies: Movie[];
  count: number;
}

export interface GenresResponse {
  genres: string[];
}
