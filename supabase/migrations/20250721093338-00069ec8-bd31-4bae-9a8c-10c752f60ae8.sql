-- Enable RLS on courses table and add policies for public read access
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view courses" 
ON public.courses 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Enable RLS on modules table and add policies for public read access
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view modules" 
ON public.modules 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Enable RLS on tests table and add policies for public read access
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view tests" 
ON public.tests 
FOR SELECT 
USING (auth.role() = 'authenticated');