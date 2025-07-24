-- Create admin user in auth.users table (you'll need to sign up with this email first)
-- Then assign admin role to a specific user
-- Replace 'admin@example.com' with the actual admin email after signup

-- For now, let's create a policy that allows inserting admin roles
-- and then you can manually assign admin role after signup

-- Insert admin role for a user (replace the email with actual admin email after they sign up)
-- This is a template - you'll need to update with actual user ID after signup
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'admin@lovable.dev'
ON CONFLICT (user_id, role) DO NOTHING;