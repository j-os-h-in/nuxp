import { User, UserProgress } from '../types';

/**
 * AUTH SERVICE
 * 
 * Using LocalStorage as the database.
 */

const STORAGE_KEY_USER = 'nus_mc_user';
const STORAGE_KEY_DATA = 'nus_mc_data_';

// Mock DB Call: Login or Register
export const loginUser = async (username: string, avatarUrl: string, isCustom: boolean): Promise<User> => {
  // SIMULATE API DELAY
  await new Promise(resolve => setTimeout(500));
  
  // --- LOCALSTORAGE IMPLEMENTATION ---
  const user: User = {
    username,
    avatarUrl,
    createdAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  return user;
};

// Mock DB Call: Update Avatar (with Bio Stub)
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

// Stub for Bio Update
export const updateUserBio = async (username: string, bio: string): Promise<User> => {
     // For now just return current user, logic similar to avatar update
     const data = localStorage.getItem(STORAGE_KEY_USER);
     if (data) {
        return JSON.parse(data);
     }
     throw new Error("User not found");
};

// Mock DB Call: Save Progress
export const saveUserProgress = async (username: string, progress: UserProgress): Promise<boolean> => {
    localStorage.setItem(STORAGE_KEY_DATA + username, JSON.stringify(progress));
    console.log(`[Database] Saved progress for ${username}`);
    return true;
};

// Mock DB Call: Load Progress
export const loadUserProgress = async (username: string): Promise<UserProgress | null> => {
    const data = localStorage.getItem(STORAGE_KEY_DATA + username);
    if (data) {
        return JSON.parse(data);
    }
    return null;
};

export const logoutUser = async () => {
    localStorage.removeItem(STORAGE_KEY_USER);
};

export const getStoredUser = async (): Promise<User | null> => {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
};

// Stub for User Search
export const getOtherUserProfile = async (username: string): Promise<{ user: User, progress: UserProgress } | null> => {
    // Basic local lookup simulation
    const currentUser = await getStoredUser();
    if (currentUser && currentUser.username === username) {
         const prog = await loadUserProgress(username);
         return { user: currentUser, progress: prog || { unlockedIds: [], proofs: {}, totalXp: 0, unlockedTrophies: [] } };
    }
    return null;
};

// Stub for searchUsers - returns only current user in localStorage mode
export const searchUsers = async (query: string): Promise<User[]> => {
    const currentUser = await getStoredUser();
    if (!currentUser) return [];
    
    // In localStorage mode, we can only return the current user
    if (!query || currentUser.username.toLowerCase().includes(query.toLowerCase())) {
        return [currentUser];
    }
    return [];
};
