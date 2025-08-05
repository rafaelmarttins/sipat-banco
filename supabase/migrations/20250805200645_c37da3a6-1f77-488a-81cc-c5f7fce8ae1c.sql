-- Update the handle_new_user function to include localizacao_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, nome, email, role, setor, localizacao_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'setor', 'Geral'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'localizacao_id' = '' THEN NULL
      ELSE NEW.raw_user_meta_data->>'localizacao_id'::uuid
    END
  );
  RETURN NEW;
END;
$function$;