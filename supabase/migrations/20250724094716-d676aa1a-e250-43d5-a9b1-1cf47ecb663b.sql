-- Update admin user assignment to use admin@admin.com
-- First, remove any existing admin role assignment
DELETE FROM public.user_roles WHERE role = 'admin'::app_role;

-- Insert admin role for the admin@admin.com user (after they sign up)
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'admin@admin.com'
ON CONFLICT (user_id, role) DO NOTHING;