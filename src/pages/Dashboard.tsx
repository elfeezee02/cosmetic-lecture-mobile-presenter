import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, BookOpen, Award, Clock } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  duration_hours: number;
}

interface UserProgress {
  module_id: string;
  completed_at: string | null;
  test_score: number | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchProgress();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("module_id, completed_at, test_score")
        .eq("user_id", user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading progress",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const getProgressPercentage = () => {
    // Assuming 4 modules total
    const completedModules = progress.filter(p => p.completed_at).length;
    return (completedModules / 4) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Cosmetic Academy</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Progress Overview */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your Learning Progress
              </CardTitle>
              <CardDescription>
                Track your advancement through the cosmetic production course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(getProgressPercentage())}%</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{progress.filter(p => p.completed_at).length} modules completed</span>
                  <span>4 modules total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Courses */}
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {course.duration_hours} hours
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant={getProgressPercentage() === 100 ? "default" : "secondary"}>
                    {getProgressPercentage() === 100 ? "Completed" : "In Progress"}
                  </Badge>
                  <Button 
                    onClick={() => startCourse(course.id)}
                    variant={getProgressPercentage() === 100 ? "outline" : "default"}
                  >
                    {getProgressPercentage() === 100 ? "Review" : "Continue"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progress.filter(p => p.completed_at).length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">First Module</Badge>
                  </div>
                )}
                {progress.filter(p => p.completed_at).length >= 2 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Halfway There</Badge>
                  </div>
                )}
                {getProgressPercentage() === 100 && (
                  <div className="flex items-center gap-2">
                    <Badge>Course Complete</Badge>
                  </div>
                )}
                {progress.filter(p => p.test_score && p.test_score >= 90).length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">High Scorer</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;