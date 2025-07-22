import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, BookOpen, Award, Clock, Settings } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";

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
  course_id: string;
}

interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  issued_at: string;
}

const Dashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchProgress();
      fetchCertificates();
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
        .select("module_id, completed_at, test_score, course_id")
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

  const fetchCertificates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .eq("approved", true);

      if (error) throw error;
      setCertificates(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading certificates",
        description: error.message,
        variant: "destructive",
      });
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

  const getProgressPercentage = (courseId?: string) => {
    if (courseId) {
      // Get progress for specific course
      const courseProgress = progress.filter(p => p.course_id === courseId);
      const completedModules = courseProgress.filter(p => p.completed_at).length;
      // Assuming each course has multiple modules, we'll get total from DB
      // For now using 4 as default, but should be dynamic based on actual module count
      return completedModules > 0 ? (completedModules / 4) * 100 : 0;
    }
    // Overall progress across all courses
    const completedModules = progress.filter(p => p.completed_at).length;
    return completedModules > 0 ? (completedModules / 20) * 100 : 0; // Total modules across all courses
  };

  const isCourseCompleted = (courseId: string) => {
    const courseProgress = progress.filter(p => p.course_id === courseId);
    const completedModules = courseProgress.filter(p => p.completed_at).length;
    return completedModules >= 4; // Assuming 4 modules per course
  };

  const hasCertificate = () => {
    return certificates.length > 0;
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
    <MobileLayout showCertificateButton={hasCertificate()}>
      <div className="p-4 space-y-4">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Welcome back!</h2>
            <p className="text-sm text-muted-foreground">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress.filter(p => p.completed_at).length} completed</span>
              <span>4 modules total</span>
            </div>
          </CardContent>
        </Card>

        {/* Available Courses */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Available Courses</h3>
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {course.duration_hours} hours
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant={isCourseCompleted(course.id) ? "default" : "secondary"}>
                      {isCourseCompleted(course.id) ? "Completed" : "In Progress"}
                    </Badge>
                    <Button 
                      onClick={() => startCourse(course.id)}
                      variant={isCourseCompleted(course.id) ? "outline" : "default"}
                      size="sm"
                    >
                      {isCourseCompleted(course.id) ? "Review" : "Continue"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.filter(p => p.completed_at).length > 0 && (
                <Badge variant="outline" className="text-xs">First Module</Badge>
              )}
              {progress.filter(p => p.completed_at).length >= 2 && (
                <Badge variant="outline" className="text-xs">Halfway There</Badge>
              )}
              {getProgressPercentage() === 100 && (
                <Badge className="text-xs">All Courses Complete</Badge>
              )}
              {hasCertificate() && (
                <Badge variant="outline" className="text-xs">Certificate Earned</Badge>
              )}
              {progress.filter(p => p.test_score && p.test_score >= 90).length > 0 && (
                <Badge variant="outline" className="text-xs">High Scorer</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;