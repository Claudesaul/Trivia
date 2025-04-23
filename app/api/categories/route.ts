import { NextResponse } from 'next/server'

const OPENTDB_API = 'https://opentdb.com/api.php'

export async function GET() {
  try {
    // Fetch categories from OpenTDB
    const response = await fetch('https://opentdb.com/api_category.php')
    
    if (!response.ok) {
      console.error('OpenTDB API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `OpenTDB API error: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }
    
    const data = await response.json()
    console.log('Categories fetched successfully')

    // Return the categories directly from the API response
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 