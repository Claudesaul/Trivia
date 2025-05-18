import { supabase } from './supabase';

export type GameScore = {
  id?: string;
  user_id: string;
  category: string;
  difficulty: string;
  score: number;
  total_questions: number;
  time_taken?: number;
  created_at?: string;
};

export type ScoreWithUser = GameScore & {
  users: {
    username: string;
    display_name?: string;
  },
  user_id: string;
};

/**
 * Saves a game score to the database
 */
export async function saveScore(score: GameScore) {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .insert([score])
      .select();

    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error: any) {
    console.error('Error saving score:', error);
    return { data: null, error };
  }
}

/**
 * Gets a user's game scores
 */
export async function getUserScores(userId: string) {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error fetching user scores:', error);
    return { data: [], error };
  }
}

/**
 * Gets recent scores from all users
 */
export async function getRecentScores(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select(`
        *,
        users (
          username,
          display_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data as ScoreWithUser[], error: null };
  } catch (error: any) {
    console.error('Error fetching recent scores:', error);
    return { data: [], error };
  }
}