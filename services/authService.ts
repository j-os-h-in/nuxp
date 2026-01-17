import { User, UserProgress } from '../types';
import { createClient } from '../src/lib/supabase/client';

// Only create Supabase client if env vars are set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabase = supabaseUrl ? createClient() : null;

/**
 * AUTH SERVICE - Uses localStorage with optional Supabase sync
 */

const STORAGE_KEY_USER = 'nus_mc_user';
const STORAGE_KEY_DATA = 'nus_mc_data_';

// Helper to get formatted error
const getError = (err: any) => err?.message || 'An unexpected error occurred';

// Login with Supabase Auth
export const loginUser = async (username: string, avatarUrl: string, isCustom: boolean): Promise<User> => {
  // For localStorage fallback (when not using email auth)
  const user: User = {
    username,
    avatarUrl,
    createdAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  return user;
};

// Update Avatar
export const updateUserAvatar = async (username: string, avatarUrl: string): Promise<User> => {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    if (data) {
        const user = JSON.parse(data);
        if (user.username === username) {
            user.avatarUrl = avatarUrl;
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
            return user;
        }
    }
    throw new Error("User not found or session invalid");
};

// Bio Update
export const updateUserBio = async (username: string, bio: string): Promise<User> => {
     const data = localStorage.getItem(STORAGE_KEY_USER);
     if (data) {
        return JSON.parse(data);
     }
     throw new Error("User not found");
};

// Save Progress (localStorage + Supabase sync)
export const saveUserProgress = async (username: string, progress: UserProgress): Promise<boolean> => {
    localStorage.setItem(STORAGE_KEY_DATA + username, JSON.stringify(progress));
    
    // Try to sync with Supabase if available and user is authenticated
    if (supabase) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('user_progress')
                    .upsert({ 
                        user_id: user.id, 
                        unlocked_ids: progress.unlockedIds, 
                        total_xp: progress.totalXp,
                        proofs: progress.proofs,
                        unlocked_trophies: progress.unlockedTrophies,
                        updated_at: new Date()
                    });
            }
        } catch (e) {
            console.log('Supabase sync skipped (offline or not logged in)');
        }
    }
    
    console.log(`[Database] Saved progress for ${username}`);
    return true;
};

// Load Progress
export const loadUserProgress = async (username: string): Promise<UserProgress | null> => {
    // Try Supabase first if available
    if (supabase) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('user_progress')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();
                
                if (data && !error) {
                    return {
                        unlockedIds: data.unlocked_ids || [],
                        totalXp: data.total_xp || 0,
                        unlockedTrophies: data.unlocked_trophies || [],
                        proofs: data.proofs || {}
                    };
                }
            }
        } catch (e) {
            console.log('Supabase load failed, using localStorage');
        }
    }
    
    // Fallback to localStorage
    const data = localStorage.getItem(STORAGE_KEY_DATA + username);
    if (data) {
        return JSON.parse(data);
    }
    return null;
};

export const logoutUser = async () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    if (supabase) {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            // Ignore if not logged in with Supabase
        }
    }
};

export const getStoredUser = (): User | null => {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
};

// User Search
export const getOtherUserProfile = async (username: string): Promise<{ user: User, progress: UserProgress } | null> => {
    const currentUser = getStoredUser();
    if (currentUser && currentUser.username === username) {
         const prog = await loadUserProgress(username);
         return { user: currentUser, progress: prog || { unlockedIds: [], proofs: {}, totalXp: 0, unlockedTrophies: [] } };
    }
    return null;
};

// Search Users
export const searchUsers = async (query: string): Promise<User[]> => {
    const currentUser = getStoredUser();
    if (!currentUser) return [];
    
    if (!query || currentUser.username.toLowerCase().includes(query.toLowerCase())) {
        return [currentUser];
    }
    return [];
};
