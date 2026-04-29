"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  MapPin, 
  Plane, 
  PlusCircle,
  Compass
} from "lucide-react"
import type { View } from "@/app/page"

interface SidebarProps {
  currentView: View
  onViewChange: (view: View) => void
}

const navItems = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "destinations" as View, label: "Destinations", icon: MapPin },
  { id: "my-trips" as View, label: "My Trips", icon: Plane },
  { id: "book-trip" as View, label: "Book Trip", icon: PlusCircle },
]

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Compass className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-foreground">TravelHub</h1>
            <p className="text-xs text-muted-foreground">Your Journey Awaits</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11 px-4",
                isActive 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="p-4 rounded-xl bg-primary/10">
          <p className="text-sm font-medium text-foreground mb-1">Need Help?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Contact our travel experts for personalized assistance.
          </p>
          <Button size="sm" className="w-full">
            Get Support
          </Button>
        </div>
      </div>
    </aside>
  )
}
