import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Home, Play, Pause } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
  type: "intro" | "content" | "interactive";
}

interface PresentationLayoutProps {
  slides: Slide[];
  onSlideChange?: (slideIndex: number) => void;
}

export const PresentationLayout = ({ slides, onSlideChange }: PresentationLayoutProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const newSlide = currentSlide + 1;
      setCurrentSlide(newSlide);
      onSlideChange?.(newSlide);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      const newSlide = currentSlide - 1;
      setCurrentSlide(newSlide);
      onSlideChange?.(newSlide);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    onSlideChange?.(index);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (currentSlide < slides.length - 1) {
          nextSlide();
        } else {
          setIsPlaying(false);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSlide, slides.length]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => goToSlide(0)}>
              <Home className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Slide Content */}
      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div 
            key={currentSlide}
            className="animate-fade-in"
          >
            {slides[currentSlide]?.content}
          </div>
        </div>
      </main>

      {/* Slide Navigation Dots */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "bg-primary scale-125 shadow-glow" 
                    : "bg-muted hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};