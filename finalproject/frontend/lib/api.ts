import type { Movie, MovieCreate, MovieUpdate, MoviesResponse, GenresResponse, MovieStats } from './types';

const API_BASE = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }

  return response.json();
}

export async function getMovies(params?: {
  search?: string;
  genre?: string;
  min_rating?: number;
  sort_by?: string;
  sort_order?: string;
  limit?: number;
  offset?: number;
}): Promise<MoviesResponse> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.genre) searchParams.set('genre', params.genre);
  if (params?.min_rating) searchParams.set('min_rating', params.min_rating.toString());
  if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
  if (params?.sort_order) searchParams.set('sort_order', params.sort_order);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return fetchAPI<MoviesResponse>(`/movies${query ? `?${query}` : ''}`);
}

export async function getMovie(id: string): Promise<Movie> {
  return fetchAPI<Movie>(`/movies/${id}`);
}

export async function getGenres(): Promise<GenresResponse> {
  return fetchAPI<GenresResponse>('/movies/genres');
}

export async function getStats(): Promise<MovieStats> {
  return fetchAPI<MovieStats>('/movies/stats');
}

export async function createMovie(movie: MovieCreate): Promise<Movie> {
  return fetchAPI<Movie>('/movies', {
    method: 'POST',
    body: JSON.stringify(movie),
  });
}

export async function updateMovie(id: string, movie: MovieUpdate): Promise<Movie> {
  return fetchAPI<Movie>(`/movies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(movie),
  });
}

export async function deleteMovie(id: string): Promise<void> {
  await fetchAPI(`/movies/${id}`, {
    method: 'DELETE',
  });
}
