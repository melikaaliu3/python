"use client"

import useSWR, { mutate } from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Plane, 
  Calendar, 
  Users,
  MapPin,
  Trash2,
  PlusCircle
} from "lucide-react"
import { toast } from "sonner"
import type { View } from "@/app/page"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface MyTripsProps {
  onViewChange: (view: View) => void
}

interface Trip {
  id: number
  destination_name: string
  destination_country: string
  destination_image: string
  start_date: string
  end_date: string
  guests: number
  status: string
  total_price: number
  notes: string | null
}

export function MyTrips({ onViewChange }: MyTripsProps) {
  const { data, isLoading } = useSWR<{ trips: Trip[] }>("/api/trips?user_id=1", fetcher)

  const trips = data?.trips || []

  const handleDeleteTrip = async (tripId: number) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE"
      })
      
      if (response.ok) {
        toast.success("Trip cancelled successfully")
        mutate("/api/trips?user_id=1")
        mutate("/api/stats")
      } else {
        toast.error("Failed to cancel trip")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-primary text-primary-foreground"
      case "pending": return "bg-accent text-accent-foreground"
      case "cancelled": return "bg-destructive text-destructive-foreground"
      default: return "bg-secondary text-secondary-foreground"
    }
  }

  const getDaysUntilTrip = (startDate: string) => {
    const start = new Date(startDate)
    const today = new Date()
    const diffTime = start.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
          <p className="text-muted-foreground mt-1">Manage your upcoming adventures</p>
        </div>
        <Button onClick={() => onViewChange("book-trip")}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Book New Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-16 text-center">
            <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No trips booked yet</h3>
            <p className="text-muted-foreground mb-6">Start planning your next adventure today!</p>
            <Button onClick={() => onViewChange("destinations")}>
              Explore Destinations
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {trips.map((trip) => {
            const daysUntil = getDaysUntilTrip(trip.start_date)
            const isPast = daysUntil < 0
            
            return (
              <Card key={trip.id} className="border-border overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                    <img 
                      src={trip.destination_image} 
                      alt={trip.destination_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {trip.destination_name}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          {trip.destination_country}
                        </div>
                      </div>
                      <Badge className={getStatusColor(trip.status)}>
                        {trip.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Check-in</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(trip.start_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Check-out</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(trip.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Guests</p>
                          <p className="text-sm font-medium text-foreground">{trip.guests}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Price</p>
                        <p className="text-lg font-bold text-primary">${trip.total_price.toLocaleString()}</p>
                      </div>
                    </div>

                    {trip.notes && (
                      <p className="text-sm text-muted-foreground mb-4 italic">
                        &quot;{trip.notes}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        {!isPast && trip.status === "confirmed" && (
                          <Badge variant="outline" className="text-primary border-primary">
                            {daysUntil === 0 ? "Today!" : `${daysUntil} days away`}
                          </Badge>
                        )}
                        {isPast && (
                          <Badge variant="secondary">Completed</Badge>
                        )}
                      </div>
                      
                      {trip.status !== "cancelled" && !isPast && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Cancel Trip
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel this trip?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Your trip to {trip.destination_name} will be cancelled.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Trip</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTrip(trip.id)}>
                                Cancel Trip
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
