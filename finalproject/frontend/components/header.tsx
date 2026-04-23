"use client";

import { Film, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddMovie: () => void;
}

export function Header({ onAddMovie }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Film className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              CineVault
            </h1>
            <p className="text-xs text-muted-foreground">Movie Management System</p>
          </div>
        </div>
        <Button onClick={onAddMovie} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Movie
        </Button>
      </div>
    </header>
  );
}
