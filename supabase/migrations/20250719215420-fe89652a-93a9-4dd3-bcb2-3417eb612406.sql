-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tests table
CREATE TABLE public.tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  test_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for certificates
CREATE POLICY "Users can view their own certificates" 
ON public.certificates 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample course data
INSERT INTO public.courses (id, title, description, duration_hours) VALUES 
('11111111-1111-1111-1111-111111111111', 'Cosmetic Production Fundamentals', 'Complete course on cosmetic science and production', 8);

-- Insert sample modules
INSERT INTO public.modules (course_id, title, description, content, order_index) VALUES 
('11111111-1111-1111-1111-111111111111', 'Introduction to Cosmetic Science', 'Understanding the fundamentals of cosmetic formulation and production', '{"type": "text", "data": "Cosmetic science combines chemistry, biology, and engineering to create products that enhance appearance and maintain skin health. This comprehensive course will guide you through every aspect of cosmetic production, from initial formulation to final packaging."}', 1),
('11111111-1111-1111-1111-111111111111', 'Essential Cosmetic Ingredients', 'Understanding the building blocks of cosmetic formulations', '{"type": "grid", "data": [{"title": "Active Ingredients", "description": "Components that provide the primary benefit - vitamins, peptides, acids, and botanical extracts"}, {"title": "Emulsifiers", "description": "Allow oil and water to blend smoothly - lecithin, polysorbates, and stearic acid"}, {"title": "Preservatives", "description": "Prevent microbial growth and extend shelf life - parabens, phenoxyethanol, and natural alternatives"}, {"title": "Thickeners", "description": "Control texture and viscosity - carbomers, xanthan gum, and natural gums"}]}', 2),
('11111111-1111-1111-1111-111111111111', 'Manufacturing Process', 'Step-by-step guide to cosmetic production', '{"type": "steps", "data": [{"title": "Ingredient Preparation", "description": "Weigh and prepare all raw materials according to the formulation. Ensure proper temperature and pH conditions."}, {"title": "Phase Mixing", "description": "Combine oil and water phases separately, then blend together using appropriate mixing equipment."}, {"title": "Homogenization", "description": "Use high-speed mixing or homogenizers to create a smooth, uniform texture without air bubbles."}, {"title": "Quality Control", "description": "Test pH, viscosity, stability, and microbial contamination before packaging."}, {"title": "Packaging & Labeling", "description": "Fill into sterile containers and apply accurate labeling with ingredient lists and usage instructions."}]}', 3),
('11111111-1111-1111-1111-111111111111', 'Safety Standards & Regulations', 'Ensuring compliance and consumer safety in cosmetic production', '{"type": "list", "data": ["FDA cosmetic regulations require proper labeling and ingredient disclosure", "EU cosmetic regulation demands safety assessments and CPNP notification", "Patch testing and stability studies ensure product safety and efficacy", "Good Manufacturing Practices (GMP) maintain quality and consistency", "Proper documentation tracks every batch from ingredients to final product", "Regular training ensures all personnel understand safety protocols"]}', 4);

-- Insert sample tests
INSERT INTO public.tests (module_id, title, questions, passing_score) 
SELECT 
  m.id,
  'Module ' || m.order_index || ' Test',
  CASE m.order_index
    WHEN 1 THEN '[
      {
        "question": "What does cosmetic science combine?",
        "options": ["Chemistry, biology, and engineering", "Only chemistry", "Only biology", "Physics and mathematics"],
        "correct": 0
      },
      {
        "question": "What is the main goal of cosmetic production?",
        "options": ["Make money", "Enhance appearance and maintain skin health", "Use chemicals", "Create colors"],
        "correct": 1
      }
    ]'::jsonb
    WHEN 2 THEN '[
      {
        "question": "What are active ingredients?",
        "options": ["Colorants", "Components that provide the primary benefit", "Water", "Preservatives"],
        "correct": 1
      },
      {
        "question": "What do emulsifiers do?",
        "options": ["Add color", "Allow oil and water to blend smoothly", "Preserve the product", "Add fragrance"],
        "correct": 1
      }
    ]'::jsonb
    WHEN 3 THEN '[
      {
        "question": "What is the first step in manufacturing?",
        "options": ["Packaging", "Quality Control", "Ingredient Preparation", "Marketing"],
        "correct": 2
      },
      {
        "question": "What does homogenization create?",
        "options": ["Color", "A smooth, uniform texture", "Preservatives", "Fragrance"],
        "correct": 1
      }
    ]'::jsonb
    WHEN 4 THEN '[
      {
        "question": "What do FDA regulations require?",
        "options": ["Only testing", "Proper labeling and ingredient disclosure", "Only packaging", "Only marketing"],
        "correct": 1
      },
      {
        "question": "What does GMP stand for?",
        "options": ["Good Marketing Practices", "Good Manufacturing Practices", "Good Management Practices", "Good Medical Practices"],
        "correct": 1
      }
    ]'::jsonb
  END,
  70
FROM public.modules m 
WHERE m.course_id = '11111111-1111-1111-1111-111111111111';

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();