import { createClient } from '@supabase/supabase-js';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export const getIconUrl = (iconName) => {
  const { data } = supabase
    .storage
    .from('icons') // El nombre de tu bucket público
    .getPublicUrl(iconName); // El nombre del archivo del ícono
  return data.publicUrl;
};
