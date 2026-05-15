import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const session = ref(null);
  const role = ref('viewer');
  const loading = ref(true);
  const initialized = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => role.value === 'admin');
  const isEditor = computed(() => role.value === 'admin' || role.value === 'editor');
  const userDisplayName = computed(() => user.value?.user_metadata?.full_name || user.value?.email || 'User');

  const fetchUserRole = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        role.value = 'viewer';
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching role:', error);
        role.value = 'viewer';
        return;
      }

      role.value = data?.role || 'viewer';
    } catch (err) {
      console.error('Error in fetchUserRole:', err);
      role.value = 'viewer';
    }
  };

  const initialize = async () => {
    if (initialized.value) return;

    loading.value = true;
    try {
      // 1. Get initial session
      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      session.value = initialSession;
      user.value = initialSession?.user || null;

      if (user.value) {
        await fetchUserRole();
      }

      // 2. Setup listener for future changes
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
      initialized.value = true;
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
    initialized,
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
