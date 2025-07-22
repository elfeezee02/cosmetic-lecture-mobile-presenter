import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Navigate, useNavigate } from 'react-router-dom';
import { Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    duration_hours: 0
  });

  useEffect(() => {
    if (isAdmin) {
      loadCourses();
      loadCertificates();
    }
  }, [isAdmin]);

  const loadCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    setCourses(data || []);
  };

  const loadCertificates = async () => {
    const { data } = await supabase
      .from('certificates')
      .select(`
        *,
        profiles!certificates_user_id_fkey(full_name, email),
        courses(title)
      `)
      .order('issued_at', { ascending: false });
    setCertificates(data || []);
  };

  const createCourse = async () => {
    const { error } = await supabase
      .from('courses')
      .insert([{
        ...courseForm,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      setCourseForm({ title: '', description: '', duration_hours: 0 });
      loadCourses();
    }
  };

  const approveCertificate = async (certificateId: string) => {
    const { error } = await supabase
      .from('certificates')
      .update({
        approved: true,
        approved_by: (await supabase.auth.getUser()).data.user?.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', certificateId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve certificate",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Certificate approved successfully",
      });
      loadCertificates();
    }
  };

  const rejectCertificate = async (certificateId: string) => {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', certificateId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject certificate",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Certificate rejected successfully",
      });
      loadCertificates();
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Course Title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
              />
              <Textarea
                placeholder="Course Description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Duration (hours)"
                value={courseForm.duration_hours}
                onChange={(e) => setCourseForm({...courseForm, duration_hours: parseInt(e.target.value) || 0})}
              />
              <Button onClick={createCourse}>Create Course</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-muted-foreground">{course.description}</p>
                      <p className="text-sm text-muted-foreground">{course.duration_hours} hours</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/course/${course.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{cert.profiles?.full_name}</h3>
                      <p className="text-muted-foreground">{cert.profiles?.email}</p>
                      <p className="text-sm text-muted-foreground">Course: {cert.courses?.title}</p>
                      <Badge variant={cert.approved ? "default" : "secondary"}>
                        {cert.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    {!cert.approved && (
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => approveCertificate(cert.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => rejectCertificate(cert.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;