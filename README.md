# YodlBoard - A Yodl Message Board Yapp

A customizable community message board that runs as a mini-app (Yapp) within the [Yodl](https://yodl.me) super app ecosystem.

## Overview

YodlBoard is a decentralized community message board where users can:

- Post content with tags (costs a small fee)
- Comment on posts
- Upvote/downvote content
- Browse community messages

All interactions are stored in a PostgreSQL database using Prisma ORM, while the posting fee is processed through the Yodl payment protocol.

## Prerequisites

- ENS name or subname for your Yapp
- PostgreSQL database
- Host for deployment
- Docker (if using local development database)

## Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/yourusername/messageboard-yapp.git
cd messageboard-yapp
```

### 2. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### 3. Database Setup

#### Option A: Local development with Docker

This requires Docker to be installed on your system. If you don't have Docker, you can install it from [the official Docker website](https://docs.docker.com/get-docker/).

```bash
# Start PostgreSQL in Docker
npm run db:start

# Run migrations
npm run db:migrate

# Seed the database with initial data (optional)
npm run db:seed

# Access Prisma Studio (database UI)
npm run db:studio
```

#### Option B: External PostgreSQL Database

Create a PostgreSQL database and add the connection string to your `.env` file:

```
DATABASE_URL=postgresql://username:password@host:port/database
REVALIDATION_TOKEN=your_secure_token_here
```

Then run migrations:

```bash
npm run db:migrate
```

### 4. Configuration

Edit `src/constants/index.ts` to configure your Yapp:

```typescript
// Required changes:
export const POST_FEE = {
  currency: FiatCurrency.USD, // Change to your preferred currency
  amount: 0.01, // Set your desired post fee amount
  address: '0x123...', // Your wallet address to receive fees
};

export const YAPP_URL = 'https://your-yapp-url.com';
export const YAPP_ENS_NAME = 'your-yapp.eth'; // Your ENS name for the Yapp
export const PARENT_URL = 'https://yodl-app-url.com'; // Yodl app URL

export const BOARD_TITLE = 'Your Community Board Name';
```

Optionally, customize post tags in `src/constants/tag.ts`:

```typescript
export const TAGS: Tag[] = [
  { name: 'announcement', color: 'iris' },
  { name: 'vote', color: 'amber' },
  // Add your custom tags here
];
```

### 5. Development and Deployment

#### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your Yapp.

#### Deployment

You can deploy the Yapp on any hosting platform that supports Next.js applications, for example on Vercel.

Learn how to create and deploy a project on Vercel in the [Vercel documentation](https://vercel.com/docs/getting-started-with-vercel).

Make sure to add the required environment variables in your hosting platform's settings.

## How It Works

1. **Yodl Integration**: YodlBoard runs as an iframe inside the Yodl super app
2. **Payments**: Uses the Yodl protocol to process post fees
3. **Verification**: Leverages the Yodl indexer API to verify payments
4. **Storage**: All posts, comments and votes are saved to your PostgreSQL database

## Available Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run lint         # Run linting
npm run typecheck    # Type checking

# Database
npm run db:seed      # Seed database with sample data
npm run db:start     # Start PostgreSQL in Docker
npm run db:stop      # Stop PostgreSQL Docker container
npm run db:reset     # Reset database (caution: deletes all data)
npm run db:migrate   # Run database migrations
npm run db:studio    # Launch Prisma Studio UI

# Production
npm run build        # Build for production
npm run start        # Start production server
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Yodl Documentation](https://docs.yodl.me)
- [Prisma Documentation](https://www.prisma.io/docs)

## License

This project is licensed under the MIT License.
