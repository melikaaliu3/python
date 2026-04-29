"use client"

import { useState, useEffect } from "react"
import useSWR, { mutate } from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { 
  CalendarIcon, 
  Users, 
  MapPin,
  DollarSign,
  Star,
  Check
} from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface BookTripProps {
  selectedDestinationId: number | null
  onSuccess: () => void
  onCancel: () => void
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

export function BookTrip({ selectedDestinationId, onSuccess, onCancel }: BookTripProps) {
  const [destinationId, setDestinationId] = useState<string>(selectedDestinationId?.toString() || "")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("1")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: destinationsData, isLoading } = useSWR<{ destinations: Destination[] }>("/api/destinations", fetcher)
  
  const destinations = destinationsData?.destinations || []
  const selectedDestination = destinations.find(d => d.id.toString() === destinationId)

  useEffect(() => {
    if (selectedDestinationId) {
      setDestinationId(selectedDestinationId.toString())
    }
  }, [selectedDestinationId])

  const calculateTotal = () => {
    if (!selectedDestination || !checkIn || !checkOut) return 0
    const days = differenceInDays(checkOut, checkIn)
    if (days <= 0) return 0
    return selectedDestination.price_per_day * days * parseInt(guests)
  }

  const handleSubmit = async () => {
    if (!destinationId || !checkIn || !checkOut) {
      toast.error("Please fill in all required fields")
      return
    }

    if (checkOut <= checkIn) {
      toast.error("Check-out date must be after check-in date")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          destination_id: parseInt(destinationId),
          start_date: format(checkIn, "yyyy-MM-dd"),
          end_date: format(checkOut, "yyyy-MM-dd"),
          guests: parseInt(guests),
          notes: notes || null
        })
      })

      if (response.ok) {
        toast.success("Trip booked successfully!")
        mutate("/api/trips?user_id=1")
        mutate("/api/stats")
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.detail || "Failed to book trip")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Book Your Trip</h1>
        <p className="text-muted-foreground mt-1">Plan your perfect getaway</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Destination Selection */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Select Destination</CardTitle>
              <CardDescription>Choose where you want to go</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={destinationId} onValueChange={setDestinationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.id} value={dest.id.toString()}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {dest.name}, {dest.country} - ${dest.price_per_day}/day
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDestination && (
                <div className="mt-4 p-4 rounded-xl bg-secondary/50 flex gap-4">
                  <img 
                    src={selectedDestination.image_url} 
                    alt={selectedDestination.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{selectedDestination.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedDestination.country}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{selectedDestination.rating}</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-sm font-medium text-primary">${selectedDestination.price_per_day}/day</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trip Dates */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Trip Dates</CardTitle>
              <CardDescription>When do you want to travel?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date < (checkIn || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travelers & Notes */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Travelers & Notes</CardTitle>
              <CardDescription>Additional trip details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Number of Guests</Label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Special Requests (Optional)</Label>
                <Textarea 
                  placeholder="Any special requests or notes for your trip..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="border-border sticky top-8">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDestination ? (
                <>
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedDestination.image_url}
                      alt={selectedDestination.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{selectedDestination.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedDestination.country}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per day</span>
                      <span className="text-foreground">${selectedDestination.price_per_day}</span>
                    </div>
                    {checkIn && checkOut && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="text-foreground">{differenceInDays(checkOut, checkIn)} nights</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="text-foreground">{guests}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Total</span>
                      <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                        <DollarSign className="w-5 h-5" />
                        {calculateTotal().toLocaleString()}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a destination to see pricing
                </p>
              )}

              <div className="space-y-2 pt-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!destinationId || !checkIn || !checkOut || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                You won&apos;t be charged yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
