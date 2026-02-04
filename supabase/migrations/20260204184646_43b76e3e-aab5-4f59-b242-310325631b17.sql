-- Update handle_new_user trigger to set password_reset_required = true for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Insert profile with password_reset_required = true
  INSERT INTO public.profiles (id, nome, email, setor, localizacao, password_reset_required)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'setor', 'Geral'),
    NEW.raw_user_meta_data->>'localizacao',
    true
  );
  
  -- Insert user role (default 'user', or 'admin' if specified)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id, 
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'user')
  );
  
  RETURN NEW;
END;
$function$;