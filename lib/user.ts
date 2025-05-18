import { supabase } from './supabase';

export type User = {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  total_points: number;
  created_at?: string;
};

/**
 * Simplified login function - checks for username and password match
 */
export async function login(username: string, password: string) {
  try {
    // First check if the user exists
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) throw error;
    
    // Check if password matches
    if (data && data.password === password) {
      return { user: data as User, error: null };
    } else {
      return { user: null, error: { message: 'Invalid username or password' } };
    }
  } catch (error: any) {
    console.error('Error logging in:', error);
    return { user: null, error: { message: 'Username not found' } };
  }
}

/**
 * Simplified register function - creates a new user with the given username and password
 */
export async function register(username: string, password: string, displayName?: string) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    
    if (existingUser) {
      return { user: null, error: { message: 'Username already taken' } };
    }
    
    // Create new user with password
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          username, 
          password, // Save the user's password
          display_name: displayName || username,
          total_points: 0
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return { user: data as User, error: null };
  } catch (error: any) {
    console.error('Error registering user:', error);
    return { user: null, error };
  }
}

/**
 * Gets a user by ID
 */
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { user: data as User, error: null };
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return { user: null, error };
  }
}

/**
 * Gets the leaderboard (top users)
 */
export async function getLeaderboard(limit = 10) {
  try {
    const { data, error } = await supabase
      .rpc('get_leaderboard', { limit_count: limit });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return { data: [], error };
  }
}