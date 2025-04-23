import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get the category ID from the URL query parameters
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }
    
    // Fetch the category count from the OpenTDB API
    const response = await fetch(`https://opentdb.com/api_count.php?category=${categoryId}`)
    
    if (!response.ok) {
      console.error('OpenTDB API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `OpenTDB API error: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }
    
    const data = await response.json()
    console.log(`Category count fetched successfully for category ${categoryId}`)

    // Format the response to match our expected structure
    const formattedData = {
      categoryId: parseInt(categoryId),
      count: {
        total_question_count: data.category_question_count?.total_question_count || 0,
        total_easy_question_count: data.category_question_count?.total_easy_question_count || 0,
        total_medium_question_count: data.category_question_count?.total_medium_question_count || 0,
        total_hard_question_count: data.category_question_count?.total_hard_question_count || 0
      }
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching category count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 