import { supabase } from '@/lib/supabaseClient'

export const getIconUrl = (iconName) => {
  const { data } = supabase
    .storage
    .from('icons') // El nombre de tu bucket público
    .getPublicUrl(iconName); // El nombre del archivo del ícono
  return data.publicUrl;
};
