-- Create app role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add approval status to certificates table
ALTER TABLE public.certificates 
ADD COLUMN approved BOOLEAN DEFAULT false,
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;

-- Update courses table to allow admin management
ALTER TABLE public.courses 
ADD COLUMN created_by UUID REFERENCES auth.users(id),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Update modules table to allow admin management
ALTER TABLE public.modules 
ADD COLUMN created_by UUID REFERENCES auth.users(id),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Update tests table to allow admin management
ALTER TABLE public.tests 
ADD COLUMN created_by UUID REFERENCES auth.users(id),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Update courses policies for admin management
DROP POLICY IF EXISTS "Allow authenticated users to view courses" ON public.courses;

CREATE POLICY "Everyone can view courses" 
ON public.courses 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert courses" 
ON public.courses 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses" 
ON public.courses 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses" 
ON public.courses 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Update modules policies for admin management
DROP POLICY IF EXISTS "Allow authenticated users to view modules" ON public.modules;

CREATE POLICY "Everyone can view modules" 
ON public.modules 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert modules" 
ON public.modules 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update modules" 
ON public.modules 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete modules" 
ON public.modules 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Update tests policies for admin management
DROP POLICY IF EXISTS "Allow authenticated users to view tests" ON public.tests;

CREATE POLICY "Everyone can view tests" 
ON public.tests 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert tests" 
ON public.tests 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tests" 
ON public.tests 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tests" 
ON public.tests 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Update certificates policies for approval system
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can insert their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can update their own certificates" ON public.certificates;

CREATE POLICY "Users can view their own approved certificates" 
ON public.certificates 
FOR SELECT 
USING (auth.uid() = user_id AND approved = true);

CREATE POLICY "Admins can view all certificates" 
ON public.certificates 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own certificates" 
ON public.certificates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certificates" 
ON public.certificates 
FOR UPDATE 
USING (auth.uid() = user_id AND approved = false);

CREATE POLICY "Admins can update all certificates" 
ON public.certificates 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tests_updated_at
BEFORE UPDATE ON public.tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert admin role for the first user (you can modify this email)
-- Replace 'admin@example.com' with your actual admin email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'admin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;