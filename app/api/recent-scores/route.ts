import { NextResponse } from 'next/server';
import { getRecentScores } from '@/lib/score';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '5', 10);
  
  try {
    const { data, error } = await getRecentScores(limit);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recent scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent scores' },
      { status: 500 }
    );
  }
}