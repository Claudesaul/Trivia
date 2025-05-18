import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/user';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('id');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const { user, error } = await getUserById(userId);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}