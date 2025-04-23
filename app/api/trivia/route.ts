import { NextResponse } from 'next/server'

const OPENTDB_API = 'https://opentdb.com/api.php'

export async function GET(request: Request) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url)
    const amount = searchParams.get('amount') || '10'
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const type = searchParams.get('type') || 'multiple'

    // Build the API URL with parameters
    let apiUrl = `${OPENTDB_API}?amount=${amount}&type=${type}`
    if (category) apiUrl += `&category=${category}`
    if (difficulty) apiUrl += `&difficulty=${difficulty}`

    console.log('Fetching from OpenTDB API:', apiUrl)

    // Fetch questions from OpenTDB
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      console.error('OpenTDB API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `OpenTDB API error: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }
    
    const data = await response.json()
    console.log('OpenTDB API response:', JSON.stringify(data).substring(0, 200) + '...')

    if (data.response_code !== 0) {
      console.error('OpenTDB API response code error:', data.response_code)
      return NextResponse.json(
        { error: `OpenTDB API response code error: ${data.response_code}` },
        { status: 500 }
      )
    }

    // Return the results directly from the API response
    return NextResponse.json(data.results)
  } catch (error) {
    console.error('Error fetching trivia questions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 