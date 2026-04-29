"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { Destinations } from "@/components/destinations"
import { MyTrips } from "@/components/my-trips"
import { BookTrip } from "@/components/book-trip"

export type View = "dashboard" | "destinations" | "my-trips" | "book-trip"

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null)

  const handleBookDestination = (destinationId: number) => {
    setSelectedDestination(destinationId)
    setCurrentView("book-trip")
  }

  const handleViewChange = (view: View) => {
    if (view !== "book-trip") {
      setSelectedDestination(null)
    }
    setCurrentView(view)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-auto">
        {currentView === "dashboard" && (
          <Dashboard onViewChange={handleViewChange} />
        )}
        {currentView === "destinations" && (
          <Destinations onBookDestination={handleBookDestination} />
        )}
        {currentView === "my-trips" && (
          <MyTrips onViewChange={handleViewChange} />
        )}
        {currentView === "book-trip" && (
          <BookTrip 
            selectedDestinationId={selectedDestination} 
            onSuccess={() => handleViewChange("my-trips")}
            onCancel={() => handleViewChange("destinations")}
          />
        )}
      </main>
    </div>
  )
}
