# Trivia Master

A modern, interactive trivia game built with Next.js and Supabase that challenges players with questions across various categories and difficulty levels.

## Description

Trivia Master is a web application that allows users to test their knowledge with custom trivia sessions. Players can select categories, difficulty levels, and the number of questions for each game. The application features a countdown timer for each question, user authentication, personal profiles, and a global leaderboard to track high scores.

Key features:
- Custom game configuration (categories, difficulty, number of questions)
- 10-second timer for each question
- Point system based on question difficulty
- Personal user profiles and statistics
- Global leaderboard
- HTML entity decoding for clear question display
- Responsive design for various screen sizes

## Target Browsers

Trivia Master is designed to work on all modern browsers including:
- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+
- Mobile browsers: iOS Safari 13.4+, Chrome for Android 80+

The application is responsive and works well on both desktop and mobile devices.

## Links

- [Live Vercel Deployment](https://trivia-lovat-ten.vercel.app/)
- [Developer Manual](#developer-manual)
- [Technical Documentation](./docs/DOCUMENTATION.md)

---

# Developer Manual

## Installation

### Prerequisites

- Node.js 18.x or newer
- Bun 1.0.0+ (alternative to npm, recommended for faster performance)
- Supabase account for database

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/Claudesaul/Trivia.git
cd Trivia
```

2. Install dependencies:
```bash
# With Bun (recommended)
bun install

# OR with npm
npm install --legacy-peer-deps
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the Supabase database:
   - Create a new Supabase project
   - Run the SQL schema from `/supabase/schema.sql` in the Supabase SQL editor

## Running the Application

### Development Mode

```bash
# With Bun
bun run dev

# OR with npm
npm run dev
```

The application will be available at http://localhost:3000

### Production Build

```bash
# Build the application
bun run build
# OR
npm run build

# Start the production server
bun run start
# OR
npm run start
```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the Next.js project and set up the build settings
4. Add the environment variables in the Vercel project settings
5. Deploy!

After initial deployment, any changes pushed to the main branch will automatically trigger a new deployment.

## Running Tests

Currently, the project does not include automated tests. This is an area for future development.

## API Endpoints

The application provides the following API endpoints:

### GET `/api/categories`
- Returns a list of available trivia categories
- No parameters required
- Response: Array of category objects `{ id: number, name: string }`

### GET `/api/trivia`
- Fetches trivia questions based on parameters
- Query parameters:
  - `amount`: Number of questions (default: 5)
  - `category`: Category ID (optional)
  - `difficulty`: Difficulty level - 'easy', 'medium', 'hard' (optional)
- Response: Array of question objects

### GET `/api/leaderboard`
- Retrieves the global leaderboard data
- Query parameters:
  - `limit`: Maximum number of scores to return (default: 10)
  - `offset`: Pagination offset (default: 0)
- Response: Array of score objects with user information

### POST `/api/scores`
- Saves a game score to the database
- Request body:
  ```json
  {
    "user_id": "string",
    "category": "string",
    "difficulty": "string",
    "score": number,
    "total_questions": number,
    "time_taken": number
  }
  ```
- Response: Success message or error

### GET `/api/scores`
- Retrieves a user's scores
- Query parameters:
  - `userId`: User ID (required)
  - `limit`: Maximum number of scores to return (default: 10)
  - `offset`: Pagination offset (default: 0)
- Response: Array of user's score objects

### GET `/api/category-counts`
- Gets statistics on questions by category
- No parameters required
- Response: Array of category count objects

### GET `/api/user`
- Retrieves user information
- Query parameters:
  - `userId`: User ID (required)
- Response: User object with profile information

## Known Bugs and Limitations

- No password hashing for user authentication (should be implemented for production)
- Timer occasionally resets incorrectly when moving between questions
- Limited error handling for network connectivity issues
- No offline mode support
- No progressive web app (PWA) capabilities

## Roadmap for Future Development

### Short-term Improvements
1. Implement password hashing for secure authentication
2. Add comprehensive error handling
3. Develop automated tests (unit and integration)
4. Add loading indicators for better UX

### Medium-term Features
1. Add achievements system
2. Implement social sharing capabilities
3. Add multiplayer functionality
4. Create a PWA version for offline play
5. Add question submission feature for users

### Long-term Vision
1. Develop mobile apps using React Native
2. Implement WebSocket for real-time multiplayer
3. Add AI-powered question generation
4. Create a tournament system
5. Develop an admin panel for content management