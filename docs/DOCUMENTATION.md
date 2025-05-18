# Trivia Master - Technical Documentation

This document provides detailed technical information about the Trivia Master application for developers who will maintain or extend the codebase.

## Architecture Overview

Trivia Master is built with the following technology stack:

- **Frontend**: Next.js 14+ (React framework) with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Simple username/password authentication (no OAuth)
- **Deployment**: Vercel

## Database Schema

The application uses a Supabase PostgreSQL database with the following tables:

### users
- `id` (uuid, primary key): Unique identifier
- `username` (text, unique): User's login name
- `password` (text): User's password (should be hashed)
- `display_name` (text): User's display name
- `created_at` (timestamp): Account creation date
- `last_login` (timestamp): Last login timestamp

### game_scores
- `id` (uuid, primary key): Score record ID
- `user_id` (uuid, foreign key): Reference to users.id
- `category` (text): Game category
- `difficulty` (text): Game difficulty level
- `score` (integer): Points scored
- `total_questions` (integer): Total number of questions
- `time_taken` (integer): Time taken in seconds
- `created_at` (timestamp): When the score was recorded

## Authentication Flow

The application uses a simple username and password authentication system:

1. User enters credentials on the login form
2. Credentials are sent to `/api/user` endpoint
3. Server checks credentials against the database
4. If valid, user data is returned and stored in `UserContext`
5. Sessions are maintained using browser localStorage

**Security Note**: The current implementation does not hash passwords. This should be implemented for production use.

## API Implementation Details

### Trivia Questions API (/api/trivia)

The application fetches trivia questions from the Open Trivia Database (opentdb.com) and processes them:

1. Endpoint receives parameters for category, difficulty, and amount
2. Makes a request to opentdb.com API
3. Processes the response:
   - Handles HTML entity decoding
   - Formats questions for frontend use
4. Returns the processed questions

### Scores API (/api/scores)

For storing and retrieving user game scores:

- `POST` - Saves a new score record to the database
- `GET` - Retrieves scores for a specific user

### Leaderboard API (/api/leaderboard)

Retrieves global high scores:

1. Queries the database for top scores
2. Joins with user data to include usernames
3. Orders by score and returns paginated results

## Key Components

### Game Page (/app/game/page.tsx)

The main game interface with these features:
- Timer functionality (10 seconds per question)
- Score calculation based on difficulty
- Answer validation
- Game progression
- Score saving

### User Context (context/UserContext.tsx)

Manages user authentication state:
- Stores current user information
- Provides login/logout functionality
- Makes user data available throughout the application

### Question Count Slider (components/game/QuestionCountSlider.tsx)

Custom component for selecting the number of questions:
- Visual slider with 1-20 range
- Used on the home page for game configuration

## Common Tasks

### Adding a New API Endpoint

1. Create a new folder under `/app/api/`
2. Add a `route.ts` file with request handlers
3. Implement GET, POST, or other methods as needed
4. Import any required database utilities from `/lib`

Example:
```typescript
// app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  // Implement logic
  return NextResponse.json({ data: 'response' })
}
```

### Adding a New Page

1. Create a new folder under `/app/`
2. Add a `page.tsx` file with the page component
3. If needed, create a separate component in `/components/`

Example:
```typescript
// app/new-page/page.tsx
"use client"

import { useState } from 'react'

export default function NewPage() {
  return (
    <div className="container mx-auto py-8">
      <h1>New Page</h1>
      {/* Content here */}
    </div>
  )
}
```

### Modifying the Database Schema

1. Update the `/supabase/schema.sql` file with your changes
2. Run the SQL in the Supabase SQL Editor
3. Update any TypeScript types in `/lib/types/` to match

## Troubleshooting

### Common Issues

#### API Route Errors
- Check correct syntax for Next.js App Router API routes
- Verify that Supabase connection is working
- Check environment variables are set correctly

#### Authentication Problems
- Clear localStorage with `localStorage.removeItem('user')` 
- Verify user exists in the database
- Check database connection settings

#### Deployment Issues
- Ensure all environment variables are set in Vercel
- Verify build is completing successfully
- Check for console errors in browser