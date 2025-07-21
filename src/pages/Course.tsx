import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, CheckCircle, Award, Play } from "lucide-react";
import { ContentSlide } from "@/components/slides/ContentSlide";
import { TestComponent } from "@/components/TestComponent";
import { CertificateComponent } from "@/components/CertificateComponent";
import { MobileLayout } from "@/components/MobileLayout";

interface Module {
  id: string;
  title: string;
  description: string;
  content: any;
  order_index: number;
}

interface Test {
  id: string;
  module_id: string;
  title: string;
  questions: any;
  passing_score: number;
}

interface UserProgress {
  id?: string;
  module_id: string;
  completed_at: string | null;
  test_score: number | null;
}

const Course = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && courseId) {
      fetchCourseData();
    }
  }, [user, courseId]);

  const fetchCourseData = async () => {
    try {
      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

      // Fetch tests
      const { data: testsData, error: testsError } = await supabase
        .from("tests")
        .select("*")
        .in("module_id", (modulesData || []).map(m => m.id));

      if (testsError) throw testsError;
      setTests((testsData || []).map(test => ({
        ...test,
        questions: typeof test.questions === 'string' ? JSON.parse(test.questions) : test.questions
      })));

      // Fetch user progress
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId);

        if (progressError) throw progressError;
        setProgress(progressData || []);
      }
    } catch (error: any) {
      toast({
        title: "Error loading course",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentModule = () => modules[currentModuleIndex];
  const getCurrentTest = () => tests.find(t => t.module_id === getCurrentModule()?.id);
  
  const isModuleCompleted = (moduleId: string) => {
    return progress.some(p => p.module_id === moduleId && p.completed_at);
  };

  const getTestScore = (moduleId: string) => {
    const moduleProgress = progress.find(p => p.module_id === moduleId);
    return moduleProgress?.test_score;
  };

  const markModuleComplete = async () => {
    const currentModule = getCurrentModule();
    if (!currentModule || !user) return;

    try {
      const { error } = await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          course_id: courseId!,
          module_id: currentModule.id,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Refresh progress
      await fetchCourseData();
      
      toast({
        title: "Module completed!",
        description: "Great job! Ready for the test?",
      });
    } catch (error: any) {
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTestComplete = async (score: number) => {
    const currentModule = getCurrentModule();
    if (!currentModule || !user) return;

    try {
      const { error } = await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          course_id: courseId!,
          module_id: currentModule.id,
          completed_at: new Date().toISOString(),
          test_score: score,
        }, {
          onConflict: "user_id,module_id"
        });

      if (error) throw error;

      await fetchCourseData();
      setShowTest(false);

      const passed = score >= (getCurrentTest()?.passing_score || 70);
      
      if (passed) {
        toast({
          title: "Test passed!",
          description: `You scored ${score}%. Moving to next module.`,
        });

        // Check if this was the last module
        if (currentModuleIndex === modules.length - 1) {
          // Generate certificate
          await generateCertificate();
          setShowCertificate(true);
        } else {
          // Move to next module
          setTimeout(() => {
            setCurrentModuleIndex(prev => prev + 1);
          }, 2000);
        }
      } else {
        toast({
          title: "Test failed",
          description: `You scored ${score}%. You need ${getCurrentTest()?.passing_score}% to pass. Try again!`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error saving test results",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateCertificate = async () => {
    if (!user || !courseId) return;

    try {
      const { error } = await supabase
        .from("certificates")
        .upsert({
          user_id: user.id,
          course_id: courseId,
          issued_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error generating certificate:", error);
    }
  };

  const getOverallProgress = () => {
    const completedModules = modules.filter(m => isModuleCompleted(m.id)).length;
    return (completedModules / modules.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (showCertificate) {
    return (
      <CertificateComponent
        userName={user?.user_metadata?.full_name || user?.email || "Student"}
        courseName="Cosmetic Production Fundamentals"
        onClose={() => {
          setShowCertificate(false);
          navigate("/dashboard");
        }}
      />
    );
  }

  if (showTest) {
    const currentTest = getCurrentTest();
    if (!currentTest) return null;

    return (
      <TestComponent
        test={currentTest}
        onComplete={handleTestComplete}
        onCancel={() => setShowTest(false)}
      />
    );
  }

  const currentModule = getCurrentModule();
  if (!currentModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Course not found</CardTitle>
            <CardDescription>The requested course could not be loaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <MobileLayout 
      showBackButton={true} 
      backTo="/dashboard"
      title={`Module ${currentModule.order_index}/${modules.length}`}
    >
      <div className="p-4 space-y-4">
        {/* Progress Header */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(getOverallProgress())}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Module Content */}
        <ContentSlide
          title={currentModule.title}
          subtitle={currentModule.description}
          learning_objectives={[]}
          content={currentModule.content}
        />

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Mark Complete Button */}
          {!isModuleCompleted(currentModule.id) && (
            <Button 
              onClick={markModuleComplete}
              className="w-full"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark as Complete
            </Button>
          )}

          {/* Test Button */}
          {isModuleCompleted(currentModule.id) && getCurrentTest() && (
            <Button
              onClick={() => setShowTest(true)}
              variant={getTestScore(currentModule.id) ? "outline" : "default"}
              className="w-full"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              {getTestScore(currentModule.id) ? 
                `Retake Test (${getTestScore(currentModule.id)}%)` : 
                "Take Test"
              }
            </Button>
          )}

          {/* Certificate Button - Fixed condition */}
          {isModuleCompleted(currentModule.id) && 
           getTestScore(currentModule.id) !== null && 
           getTestScore(currentModule.id)! >= (getCurrentTest()?.passing_score || 70) && 
           currentModuleIndex === modules.length - 1 && (
            <Button 
              onClick={() => setShowCertificate(true)}
              className="w-full"
              size="lg"
              variant="default"
            >
              <Award className="h-5 w-5 mr-2" />
              View Certificate
            </Button>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentModuleIndex(prev => Math.max(0, prev - 1))}
              disabled={currentModuleIndex === 0}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {isModuleCompleted(currentModule.id) && 
             getTestScore(currentModule.id) !== null && 
             getTestScore(currentModule.id)! >= (getCurrentTest()?.passing_score || 70) && 
             currentModuleIndex < modules.length - 1 && (
              <Button 
                onClick={() => setCurrentModuleIndex(prev => prev + 1)}
                className="flex-1"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Course;