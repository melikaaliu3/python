"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Plane, 
  MapPin, 
  DollarSign, 
  Users,
  ArrowRight,
  Calendar,
  TrendingUp
} from "lucide-react"
import type { View } from "@/app/page"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface DashboardProps {
  onViewChange: (view: View) => void
}

interface Stats {
  total_trips: number
  active_trips: number
  total_destinations: number
  total_revenue: number
  total_users: number
}

interface Trip {
  id: number
  destination_name: string
  destination_country: string
  destination_image: string
  start_date: string
  end_date: string
  status: string
  total_price: number
}

interface Destination {
  id: number
  name: string
  country: string
  image_url: string
  price_per_day: number
  rating: number
}

export function Dashboard({ onViewChange }: DashboardProps) {
  const { data: stats, isLoading: statsLoading } = useSWR<Stats>("/api/stats", fetcher)
  const { data: tripsData, isLoading: tripsLoading } = useSWR<{ trips: Trip[] }>("/api/trips?user_id=1", fetcher)
  const { data: destinationsData, isLoading: destinationsLoading } = useSWR<{ destinations: Destination[] }>("/api/destinations", fetcher)

  const recentTrips = tripsData?.trips?.slice(0, 3) || []
  const topDestinations = destinationsData?.destinations?.slice(0, 4) || []

  const statCards = [
    { 
      title: "Total Trips", 
      value: stats?.total_trips || 0, 
      icon: Plane, 
      color: "text-primary",
      bg: "bg-primary/10" 
    },
    { 
      title: "Active Trips", 
      value: stats?.active_trips || 0, 
      icon: TrendingUp, 
      color: "text-accent",
      bg: "bg-accent/10" 
    },
    { 
      title: "Destinations", 
      value: stats?.total_destinations || 0, 
      icon: MapPin, 
      color: "text-chart-3",
      bg: "bg-chart-3/10" 
    },
    { 
      title: "Total Spent", 
      value: `$${(stats?.total_revenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-chart-4",
      bg: "bg-chart-4/10" 
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Traveler</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your travel journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Trips */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Trips</CardTitle>
              <CardDescription>Your latest travel adventures</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onViewChange("my-trips")}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            {tripsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : recentTrips.length === 0 ? (
              <div className="text-center py-8">
                <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No trips yet</p>
                <Button className="mt-4" onClick={() => onViewChange("book-trip")}>
                  Book Your First Trip
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={trip.destination_image} 
                        alt={trip.destination_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {trip.destination_name}, {trip.destination_country}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={trip.status === "confirmed" ? "default" : "secondary"}>
                      {trip.status}
                    </Badge>
                    <p className="font-semibold text-foreground">${trip.total_price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Destinations */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Destinations</CardTitle>
              <CardDescription>Popular travel spots</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onViewChange("destinations")}>
              Explore <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            {destinationsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topDestinations.map((dest, index) => (
                  <div key={dest.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img 
                        src={dest.image_url} 
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{dest.name}</p>
                      <p className="text-xs text-muted-foreground">{dest.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">${dest.price_per_day}</p>
                      <p className="text-xs text-muted-foreground">per day</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
