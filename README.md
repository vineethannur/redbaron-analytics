# RedBaron Analytics Dashboard

A comprehensive analytics dashboard built with React, TypeScript, and Vite, featuring data visualization using D3.js and integration with Google Analytics 4 API.

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
- **Visualization**: D3.js, Chart.js, React-Chartjs-2
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
   git clone https://github.com/your-username/redbaron-analytics-dashboard.git
   cd redbaron-analytics-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_GA4_PROPERTY_ID=your_ga4_property_id
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

The application can be deployed on Vercel by connecting your GitHub repository to your Vercel account.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 