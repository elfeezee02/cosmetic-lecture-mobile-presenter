import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlaskConical, Sparkles, ChevronDown } from "lucide-react";
import cosmeticHero from "@/assets/cosmetic-hero.jpg";

interface HeroSlideProps {
  onGetStarted?: () => void;
}

export const HeroSlide = ({ onGetStarted }: HeroSlideProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cosmeticHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-primary-foreground/10 rounded-full">
              <FlaskConical className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 tracking-tight">
            Cosmetic Production
            <span className="block text-primary-glow">Mastery Course</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover the science and art behind creating beautiful, safe, and effective cosmetic products
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="hero" 
              size="lg"
              className="text-lg px-8 py-4"
              onClick={onGetStarted}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Learning
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Course Overview
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-foreground mb-2">12+</div>
                <div className="text-primary-foreground/80">Modules</div>
              </div>
            </Card>
            
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-foreground mb-2">50+</div>
                <div className="text-primary-foreground/80">Formulations</div>
              </div>
            </Card>
            
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-foreground mb-2">100%</div>
                <div className="text-primary-foreground/80">Interactive</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-primary-foreground/70" />
        </div>
      </div>
    </div>
  );
};