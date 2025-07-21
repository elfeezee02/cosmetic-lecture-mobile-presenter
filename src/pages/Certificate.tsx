import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { CertificateComponent } from "@/components/CertificateComponent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const Certificate = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleClose = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <MobileLayout title="Certificate" showBackButton={true}>
        <div className="p-4 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <CertificateComponent 
      userName={user.user_metadata?.full_name || user.email?.split('@')[0] || "Student"}
      courseName="Cosmetic Production Academy Certificate"
      onClose={handleClose}
    />
  );
};

export default Certificate;
