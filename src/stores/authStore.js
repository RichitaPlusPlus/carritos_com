import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const session = ref(null);
  const role = ref('viewer');
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => role.value === 'admin');
  const isEditor = computed(() => role.value === 'admin' || role.value === 'editor');
  const userDisplayName = computed(() => user.value?.user_metadata?.full_name || user.value?.email || 'User');

  const fetchUserRole = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentUser.id)
          .single();
        
        if (data && !error) {
          role.value = data.role;
        } else {
          console.warn('Role not found or error fetching role, defaulting to viewer:', error);
          role.value = 'viewer';
        }
      }
    } catch (err) {
      console.error('Error in fetchUserRole:', err);
      role.value = 'viewer';
    }
  };

  const initialize = async () => {
    loading.value = true;
    try {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      session.value = initialSession;
      user.value = initialSession?.user || null;

      if (user.value) {
        await fetchUserRole();
      }

      supabase.auth.onAuthStateChange(async (event, currentSession) => {
        session.value = currentSession;
        user.value = currentSession?.user || null;
        if (event === 'SIGNED_IN') {
          await fetchUserRole();
        } else if (event === 'SIGNED_OUT') {
          role.value = 'viewer';
        }
      });
    } catch (err) {
      console.error('Error during auth initialization:', err);
    } finally {
      loading.value = false;
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    user.value = null;
    session.value = null;
    role.value = 'viewer';
    loading.value = false;
  };

  return {
    user,
    session,
    role,
    loading,
    isAuthenticated,
    isAdmin,
    isEditor,
    userDisplayName,
    initialize,
    signInWithGoogle,
    signOut,
    fetchUserRole,
  };
});
