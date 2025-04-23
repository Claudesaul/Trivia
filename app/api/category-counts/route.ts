import { NextResponse } from 'next/server'

// Map of category names to their IDs
const CATEGORY_MAP = {
  "General Knowledge": 9,
  "Entertainment: Books": 10,
  "Entertainment: Film": 11,
  "Entertainment: Music": 12,
  "Entertainment: Musicals & Theatres": 13,
  "Entertainment: Television": 14,
  "Entertainment: Video Games": 15,
  "Entertainment: Board Games": 16,
  "Science & Nature": 17,
  "Science: Computers": 18,
  "Science: Mathematics": 19,
  "Science: Gadgets": 30,
  "Mythology": 20,
  "Sports": 21,
  "Geography": 22,
  "History": 23,
  "Politics": 24,
  "Art": 25,
  "Celebrities": 26,
  "Animals": 27,
  "Vehicles": 28,
  "Entertainment: Comics": 29,
  "Entertainment: Japanese Anime & Manga": 31,
  "Entertainment: Cartoon & Animations": 32
}

export async function GET() {
  try {
    // Fetch all categories first
    const categoriesResponse = await fetch('https://opentdb.com/api_category.php')
    
    if (!categoriesResponse.ok) {
      console.error('OpenTDB API error:', categoriesResponse.status, categoriesResponse.statusText)
      return NextResponse.json(
        { error: `OpenTDB API error: ${categoriesResponse.status} ${categoriesResponse.statusText}` },
        { status: 500 }
      )
    }
    
    const categoriesData = await categoriesResponse.json()
    const categories = categoriesData.trivia_categories || []
    
    // Fetch count for each category
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        try {
          const countResponse = await fetch(`https://opentdb.com/api_count.php?category=${category.id}`)
          
          if (!countResponse.ok) {
            console.error(`Error fetching count for category ${category.id}:`, countResponse.status, countResponse.statusText)
            return {
              id: category.id,
              name: category.name,
              count: {
                total_question_count: 0,
                total_easy_question_count: 0,
                total_medium_question_count: 0,
                total_hard_question_count: 0
              },
              error: `API error: ${countResponse.status}`
            }
          }
          
          const countData = await countResponse.json()
          return {
            id: category.id,
            name: category.name,
            count: {
              total_question_count: countData.category_question_count?.total_question_count || 0,
              total_easy_question_count: countData.category_question_count?.total_easy_question_count || 0,
              total_medium_question_count: countData.category_question_count?.total_medium_question_count || 0,
              total_hard_question_count: countData.category_question_count?.total_hard_question_count || 0
            }
          }
        } catch (error) {
          console.error(`Error fetching count for category ${category.id}:`, error)
          return {
            id: category.id,
            name: category.name,
            count: {
              total_question_count: 0,
              total_easy_question_count: 0,
              total_medium_question_count: 0,
              total_hard_question_count: 0
            },
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )
    
    console.log('All category counts fetched successfully')
    
    return NextResponse.json({ categories: categoryCounts })
  } catch (error) {
    console.error('Error fetching category counts:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 