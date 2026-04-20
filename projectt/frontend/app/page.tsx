'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Movie {
  id: string
  title: string
  description: string | null
  release_year: number | null
  genre: string | null
  director: string | null
  rating: number | null
  poster_url: string | null
  duration_minutes: number | null
  created_at: string
  updated_at: string
}

interface Stats {
  total_movies: number
  average_rating: number
  oldest_movie_year: number
  newest_movie_year: number
  total_genres: number
  total_directors: number
}

// Icons as components
function FilmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function StarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return filled ? (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
    </svg>
  ) : (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}

export default function MoviesPage() {
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [order, setOrder] = useState('desc')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [showStats, setShowStats] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const queryParams = new URLSearchParams()
  if (search) queryParams.set('search', search)
  if (selectedGenre) queryParams.set('genre', selectedGenre)
  queryParams.set('sort_by', sortBy)
  queryParams.set('order', order)

  const { data: moviesData, error: moviesError, isLoading } = useSWR(
    `/api/movies?${queryParams.toString()}`,
    fetcher
  )

  const { data: genresData } = useSWR('/api/genres', fetcher)
  const { data: statsData } = useSWR('/api/stats', fetcher)

  const movies: Movie[] = moviesData?.movies || []
  const genres: string[] = genresData?.genres || []
  const stats: Stats | null = statsData || null

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return
    
    await fetch(`/api/movies/${id}`, { method: 'DELETE' })
    mutate(`/api/movies?${queryParams.toString()}`)
    mutate('/api/stats')
    mutate('/api/genres')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FilmIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Movies</h1>
                <p className="text-sm text-muted-foreground">Manage your collection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  showStats 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                <ChartIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Statistics</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Add Movie</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Panel */}
        {showStats && stats && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard 
                label="Total Movies" 
                value={stats.total_movies} 
                icon={<FilmIcon className="w-5 h-5" />}
                color="primary"
              />
              <StatCard 
                label="Avg Rating" 
                value={stats.average_rating?.toFixed(1) || 'N/A'} 
                icon={<StarIcon className="w-5 h-5" filled />}
                color="accent"
              />
              <StatCard 
                label="Oldest Year" 
                value={stats.oldest_movie_year || 'N/A'} 
                icon={<CalendarIcon className="w-5 h-5" />}
                color="chart-3"
              />
              <StatCard 
                label="Newest Year" 
                value={stats.newest_movie_year || 'N/A'} 
                icon={<SparklesIcon className="w-5 h-5" />}
                color="chart-4"
              />
              <StatCard 
                label="Genres" 
                value={stats.total_genres} 
                icon={<ChartIcon className="w-5 h-5" />}
                color="chart-5"
              />
              <StatCard 
                label="Directors" 
                value={stats.total_directors} 
                icon={<UserIcon className="w-5 h-5" />}
                color="chart-1"
              />
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies, directors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all duration-200"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all duration-200"
                >
                  <option value="created_at">Date Added</option>
                  <option value="title">Title</option>
                  <option value="release_year">Release Year</option>
                  <option value="rating">Rating</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all duration-200"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading movies...</p>
          </div>
        ) : moviesError ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
              <XIcon className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load movies</h3>
            <p className="text-muted-foreground">Make sure the database is set up correctly.</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-card border border-border mb-6">
              <FilmIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-muted-foreground mb-6">
              {search || selectedGenre ? 'Try adjusting your filters' : 'Add your first movie to get started'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Movie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onEdit={() => setEditingMovie(movie)}
                onDelete={() => handleDelete(movie.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || editingMovie) && (
        <MovieModal
          movie={editingMovie}
          onClose={() => {
            setShowAddModal(false)
            setEditingMovie(null)
          }}
          onSave={() => {
            mutate(`/api/movies?${queryParams.toString()}`)
            mutate('/api/stats')
            mutate('/api/genres')
            setShowAddModal(false)
            setEditingMovie(null)
          }}
        />
      )}
    </div>
  )
}

function StatCard({ 
  label, 
  value, 
  icon, 
  color 
}: { 
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    'chart-1': 'bg-chart-1/10 text-chart-1',
    'chart-2': 'bg-chart-2/10 text-chart-2',
    'chart-3': 'bg-chart-3/10 text-chart-3',
    'chart-4': 'bg-chart-4/10 text-chart-4',
    'chart-5': 'bg-chart-5/10 text-chart-5',
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-border/80 transition-all duration-200">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function MovieCard({ 
  movie, 
  onEdit, 
  onDelete,
  index
}: { 
  movie: Movie
  onEdit: () => void
  onDelete: () => void
  index: number
}) {
  return (
    <div 
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Poster */}
      <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
        {movie.poster_url ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FilmIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Rating Badge */}
        {movie.rating && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-lg">
            <StarIcon className="w-4 h-4 text-accent" filled />
            <span className="text-sm font-semibold text-foreground">{movie.rating}</span>
          </div>
        )}

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={onEdit}
            className="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">{movie.title}</h3>
        
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {movie.genre && (
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
              {movie.genre}
            </span>
          )}
          {movie.release_year && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="w-3.5 h-3.5" />
              {movie.release_year}
            </span>
          )}
          {movie.duration_minutes && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ClockIcon className="w-3.5 h-3.5" />
              {movie.duration_minutes}m
            </span>
          )}
        </div>
        
        {/* Description */}
        {movie.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {movie.description}
          </p>
        )}
        
        {/* Director */}
        {movie.director && (
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">{movie.director}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function MovieModal({ 
  movie, 
  onClose, 
  onSave 
}: { 
  movie: Movie | null
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    release_year: movie?.release_year?.toString() || '',
    genre: movie?.genre || '',
    director: movie?.director || '',
    rating: movie?.rating?.toString() || '',
    poster_url: movie?.poster_url || '',
    duration_minutes: movie?.duration_minutes?.toString() || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title: formData.title,
      description: formData.description || null,
      release_year: formData.release_year ? parseInt(formData.release_year) : null,
      genre: formData.genre || null,
      director: formData.director || null,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      poster_url: formData.poster_url || null,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
    }

    if (movie) {
      await fetch(`/api/movies/${movie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {movie ? 'Edit Movie' : 'Add New Movie'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {movie ? 'Update movie details' : 'Fill in the movie information'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <XIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              placeholder="Enter movie title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all duration-200"
              placeholder="Brief movie description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Release Year</label>
              <input
                type="number"
                min="1800"
                max="2100"
                value={formData.release_year}
                onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Genre</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                placeholder="Action, Drama..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Director</label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                placeholder="Director name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rating (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                placeholder="8.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Duration (min)</label>
              <input
                type="number"
                min="1"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Poster URL</label>
              <input
                type="url"
                value={formData.poster_url}
                onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                placeholder="https://..."
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-secondary/30">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-secondary text-foreground rounded-xl font-medium hover:bg-muted transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !formData.title}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              movie ? 'Update Movie' : 'Add Movie'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
