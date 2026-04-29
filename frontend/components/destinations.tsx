"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { 
  MapPin, 
  Star, 
  Search,
  DollarSign
} from "lucide-react"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface DestinationsProps {
  onBookDestination: (destinationId: number) => void
}

interface Destination {
  id: number
  name: string
  country: string
  description: string
  image_url: string
  price_per_day: number
  rating: number
}

export function Destinations({ onBookDestination }: DestinationsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { data, isLoading } = useSWR<{ destinations: Destination[] }>("/api/destinations", fetcher)

  const destinations = data?.destinations || []
  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Explore Destinations</h1>
          <p className="text-muted-foreground mt-1">Discover your next adventure</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search destinations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No destinations found</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden border-border group hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={destination.image_url} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 right-4 bg-background/90 text-foreground backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1 fill-accent text-accent" />
                  {destination.rating}
                </Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{destination.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="w-3 h-3" />
                      {destination.country}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary font-bold text-lg">
                      <DollarSign className="w-4 h-4" />
                      {destination.price_per_day}
                    </div>
                    <span className="text-xs text-muted-foreground">per day</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {destination.description}
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => onBookDestination(destination.id)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
