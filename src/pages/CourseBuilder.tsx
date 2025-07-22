import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface Module {
  id?: string;
  title: string;
  description: string;
  content: any;
  order_index: number;
}

interface Test {
  id?: string;
  title: string;
  questions: any;
  passing_score: number;
  module_id?: string;
}

const CourseBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [newModule, setNewModule] = useState<Module>({
    title: '',
    description: '',
    content: { slides: [] },
    order_index: 0
  });

  useEffect(() => {
    if (courseId && isAdmin) {
      loadCourse();
      loadModules();
      loadTests();
    }
  }, [courseId, isAdmin]);

  const loadCourse = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    setCourse(data);
  };

  const loadModules = async () => {
    const { data } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');
    setModules(data || []);
  };

  const loadTests = async () => {
    const { data } = await supabase
      .from('tests')
      .select('*')
      .in('module_id', modules.map(m => m.id!))
      .order('created_at');
    setTests(data || []);
  };

  const createModule = async () => {
    if (!newModule.title || !newModule.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('modules')
      .insert([{
        ...newModule,
        course_id: courseId,
        order_index: modules.length,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create module",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Module created successfully",
      });
      setNewModule({
        title: '',
        description: '',
        content: { slides: [] },
        order_index: 0
      });
      loadModules();
    }
  };

  const deleteModule = async (moduleId: string) => {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Module deleted successfully",
      });
      loadModules();
    }
  };

  const createTest = async (moduleId: string) => {
    const testData = {
      title: `Test for Module`,
      module_id: moduleId,
      questions: [
        {
          question: "Sample question?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct_answer: 0
        }
      ],
      passing_score: 70,
      created_by: (await supabase.auth.getUser()).data.user?.id
    };

    const { error } = await supabase
      .from('tests')
      .insert([testData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create test",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Test created successfully",
      });
      loadTests();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/admin')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold">Course Builder: {course?.title}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Module</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Module Title"
              value={newModule.title}
              onChange={(e) => setNewModule({...newModule, title: e.target.value})}
            />
            <Textarea
              placeholder="Module Description"
              value={newModule.description}
              onChange={(e) => setNewModule({...newModule, description: e.target.value})}
            />
            <Button onClick={createModule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.map((module, index) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Module {index + 1}: {module.title}</h3>
                      <p className="text-muted-foreground">{module.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => createTest(module.id!)}
                      >
                        Add Test
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteModule(module.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {tests.filter(t => t.module_id === module.id).map((test) => (
                    <div key={test.id} className="bg-muted p-3 rounded mt-2">
                      <p className="font-medium">Test: {test.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {test.questions.length} questions | Passing score: {test.passing_score}%
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseBuilder;