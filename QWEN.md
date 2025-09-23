# Next.js AI Chatbot Project Context

## Project Overview

This is a Next.js 14 AI Chatbot template built with the App Router, designed to help developers quickly build powerful chatbot applications. The project uses the Vercel AI SDK to integrate with various AI models, with xAI (Grok) as the default provider.

### Key Technologies
- **Next.js 14** with App Router and React Server Components
- **Vercel AI SDK** for AI model integration
- **xAI (Grok)** as the default AI model provider
- **PostgreSQL** via Drizzle ORM for data persistence
- **shadcn/ui** with Tailwind CSS for UI components
- **NextAuth.js** for authentication
- **Vercel Blob** for file storage
- **Redis** for caching

### Architecture
The application follows a modern Next.js 14 architecture with:
- App Router structure in the `app/` directory
- Server Components and Server Actions for performance
- API routes for backend functionality
- Database integration with PostgreSQL
- Authentication via NextAuth.js

## Project Structure

```
├── app/                    # Next.js App Router directory
│   ├── (auth)/            # Authentication pages
│   ├── (chat)/            # Main chat application
│   └── ...                # Other routes
├── components/             # React UI components
├── lib/                    # Core application logic
│   ├── ai/                # AI integration
│   ├── db/                # Database logic
│   └── ...                # Other utilities
├── public/                 # Static assets
├── tests/                  # Test files
└── ...
```

## Development Setup

### Environment Variables
Create a `.env.local` file based on `.env.example` with:
- `AUTH_SECRET`: Authentication secret
- `AI_GATEWAY_API_KEY`: For non-Vercel deployments
- `POSTGRES_URL`: PostgreSQL database connection
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage token
- `REDIS_URL`: Redis connection (optional)

### Installation
```bash
pnpm install
```

### Running Locally
```bash
# Set up environment (first time only)
npm i -g vercel
vercel link
vercel env pull

# Run development server
pnpm dev
```

Your app will be available at [http://localhost:3000](http://localhost:3000).

### Database Management
```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open database studio
pnpm db:studio
```

## AI Model Integration

The project uses the Vercel AI Gateway to access xAI models:
- `xai/grok-2-vision-1212` for general chat
- `xai/grok-3-mini` for reasoning tasks

Models are configured in `lib/ai/providers.ts` and can be switched to other providers like OpenAI by modifying the provider configuration.

## Testing

```bash
# Run Playwright tests
pnpm test
```

## Building for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

## Deployment

Deploy to Vercel with one click using the provided button in the README, or manually by connecting your GitHub repository to Vercel.