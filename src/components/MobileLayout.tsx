import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, User, ArrowLeft } from "lucide-react";

interface MobileLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
}

export const MobileLayout = ({ children, showBackButton = false, backTo = "/dashboard", title }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex flex-col">
      {/* Mobile Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <Button variant="ghost" size="sm" onClick={() => navigate(backTo)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold text-primary">Cosmetic Academy</h1>
            </div>
          )}
          {title && (
            <h2 className="text-sm font-medium text-center flex-1 px-4">{title}</h2>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="grid grid-cols-3 h-16">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center gap-1 h-full rounded-none ${
              isActive("/dashboard") ? "text-primary bg-primary/5" : "text-muted-foreground"
            }`}
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center gap-1 h-full rounded-none ${
              location.pathname.startsWith("/course") ? "text-primary bg-primary/5" : "text-muted-foreground"
            }`}
            onClick={() => navigate("/course/1")}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Courses</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center gap-1 h-full rounded-none ${
              isActive("/certificate") ? "text-primary bg-primary/5" : "text-muted-foreground"
            }`}
            onClick={() => navigate("/certificate")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Certificate</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};