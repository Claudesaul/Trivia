import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Delete all records from the game_scores table
    const { error } = await supabase
      .from('game_scores')
      .delete()
      .is('id', 'not.null'); // This is a workaround to delete all records
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true, message: 'All scores cleared successfully' });
  } catch (error) {
    console.error('Error clearing scores:', error);
    return NextResponse.json(
      { error: 'Failed to clear scores' },
      { status: 500 }
    );
  }
}