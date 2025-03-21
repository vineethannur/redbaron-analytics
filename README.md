# RedBaron Analytics Dashboard

A comprehensive analytics dashboard built with React, TypeScript, and Vite, featuring data visualization and integration with Google Analytics 4 API.

## Features

- User authentication system
- Interactive date range picker
- Multiple analytics components:
  - Summary metrics
  - Page views chart
  - User demographics
  - Traffic sources
  - Device usage breakdown
  - Active users map
  - Top performing pages
  - Search engine referrals
  - Users by country

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Visualization**: Chart.js, React-Chartjs-2
- **Backend**: Node.js, Express
- **API Integration**: Google Analytics 4 API

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Google Analytics 4 account with appropriate credentials

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/vineethannur/redbaron-analytics.git
   cd redbaron-analytics
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory based on `.env.example`:
   ```
   # Google Analytics 4 credentials
   # Variables with VITE_ prefix are available to the frontend
   VITE_GA_PROPERTY_ID=your_property_id
   VITE_GA_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
   VITE_GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   
   # These variables are for the backend
   # The backend will also be able to use the variables above
   GA4_PROPERTY_ID=your_property_id
   GA4_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
   GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   
   # Server configuration
   PORT=3001
   NODE_ENV=development
   
   # API configuration - for local development
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server (frontend and backend):
   ```
   npm start
   ```

   Or run them separately:
   ```
   # Frontend only
   npm run dev
   
   # Backend only
   npm run server:dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src` - Frontend React application
- `/backend` - Backend Express server
- `/api` - Serverless API routes for Vercel deployment
- `/public` - Static assets

## Deployment to Vercel

This project is configured for easy deployment to Vercel. Follow these steps:

1. Push your code to GitHub
2. Go to Vercel dashboard and import your repository
3. Configure the project with these settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Add these environment variables in the Vercel project settings:
   - `GA_PROPERTY_ID` = your GA4 property ID
   - `GA_CLIENT_EMAIL` = your service account email
   - `GA_PRIVATE_KEY` = your private key with newlines escaped

5. Deploy the project

The application uses serverless API routes in the `/api` directory that run directly on Vercel, so no separate backend is needed for the deployed version.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

#   R e d - B a r o n - A n a l y t i c s 
 
 