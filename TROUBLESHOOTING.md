# Troubleshooting "We're having trouble sending your message" Error

## Problem Analysis

The error message "We're having trouble sending your message. Please check your internet connection and try again." is appearing even though your internet connection is fine. This suggests the issue is with the application configuration or API connectivity rather than actual network connectivity.

## Root Causes

1. **Missing Environment Variables**: The application requires specific environment variables to function properly
2. **AI Gateway API Key Missing**: Without a valid API key, the AI models cannot be accessed
3. **Database Connection Issues**: If the database is not properly configured, the application may fail
4. **Incorrect Test Environment Detection**: The application might be using mock models instead of real AI models

## Solutions

### 1. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Generate a random secret: https://generate-secret.vercel.app/32 or `openssl rand -base64 32`
AUTH_SECRET=your-auth-secret-here

# AI Gateway API Key (required for non-Vercel deployments)
AI_GATEWAY_API_KEY=your-ai-gateway-api-key-here

# PostgreSQL database URL
POSTGRES_URL=your-postgres-database-url-here

# Vercel Blob Store token
BLOB_READ_WRITE_TOKEN=your-blob-read-write-token-here

# Redis URL (optional but recommended)
REDIS_URL=your-redis-url-here
```

### 2. Obtain Required API Keys

- **AI Gateway API Key**: Sign up at [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) to get an API key
- **PostgreSQL Database**: Set up a PostgreSQL database (you can use services like Supabase, Neon, or Vercel Postgres)
- **Vercel Blob Store**: Set up Vercel Blob storage for file uploads

### 3. Verify Configuration

Check that you're not in a test environment by ensuring these environment variables are NOT set:
- `PLAYWRIGHT_TEST_BASE_URL`
- `PLAYWRIGHT`
- `CI_PLAYWRIGHT`

### 4. Restart the Development Server

After setting up your environment variables, restart the development server:

```bash
npm run dev
```

## Additional Debugging Steps

1. **Check the Console**: Look at the browser console and terminal for specific error messages
2. **Verify AI Gateway Access**: Test your AI Gateway API key independently
3. **Check Database Connection**: Ensure your PostgreSQL database is accessible
4. **Review Logs**: Check application logs for more detailed error information

## Common Issues and Fixes

### Issue: Using Mock Models Instead of Real AI Models
**Solution**: Ensure you're not in a test environment and have set the `AI_GATEWAY_API_KEY`.

### Issue: Database Connection Failed
**Solution**: Verify your `POSTGRES_URL` is correctly formatted and the database is accessible.

### Issue: Rate Limiting
**Solution**: If you're getting rate limit errors, wait a few minutes before sending more messages.

## Need More Help?

If you're still experiencing issues after following these steps:

1. Check the browser developer tools console for specific error messages
2. Look at the terminal where you're running the development server for backend errors
3. Verify all environment variables are correctly set in your `.env.local` file
4. Ensure your AI Gateway API key is valid and has sufficient credits