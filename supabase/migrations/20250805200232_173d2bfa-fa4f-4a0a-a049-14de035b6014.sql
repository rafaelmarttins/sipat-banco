-- Add localizacao_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN localizacao_id uuid REFERENCES public.localizacoes(id);

-- Create index for better performance
CREATE INDEX idx_profiles_localizacao_id ON public.profiles(localizacao_id);