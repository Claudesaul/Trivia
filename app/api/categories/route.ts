import { NextResponse } from 'next/server'

const OPENTDB_API = 'https://opentdb.com/api_category.php'

export async function GET() {
  try {
    const response = await fetch(OPENTDB_API)
    
    if (!response.ok) {
      console.error('OpenTDB API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `OpenTDB API error: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }
    
    const data = await response.json()
    console.log('Categories fetched successfully')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 