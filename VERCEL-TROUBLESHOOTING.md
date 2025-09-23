# Vercel Deployment Troubleshooting Guide

## Issue: Chat Bot Not Responding with "No Internet" Error

If your chat bot is deployed on Vercel and showing a "no internet" error despite having a working internet connection, this guide will help you diagnose and fix the issue.

## Common Causes on Vercel

1. **Environment Variables Not Properly Set**
2. **AI Gateway Integration Issues**
3. **Database Connection Problems**
4. **Authentication Configuration Issues**

## Diagnostic Steps

### 1. Check Environment Variables

Navigate to your Vercel project settings:
1. Go to your project dashboard on Vercel
2. Click on "Settings" → "Environment Variables"
3. Verify that all required variables are set:
   - `AI_GATEWAY_API_KEY`
   - `POSTGRES_URL`
   - `AUTH_SECRET`
   - `BLOB_READ_WRITE_TOKEN`

### 2. Use the Debug Endpoint

Visit your deployed application at `/debug` to check the environment status:
```
https://your-app.vercel.app/debug
```

This will show you which environment variables are properly set.

### 3. Check Vercel Logs

1. Go to your Vercel project dashboard
2. Click on "Logs" in the sidebar
3. Look for error messages when trying to send a message
4. Pay attention to:
   - Database connection errors
   - AI Gateway authentication errors
   - Missing environment variable warnings

### 4. Verify AI Gateway Configuration

1. Ensure your `AI_GATEWAY_API_KEY` is correctly set
2. Check that your Vercel project has access to the AI Gateway
3. Verify your API key hasn't expired or been revoked

## Solutions

### Solution 1: Fix Environment Variables

If any environment variables are missing:
1. Add them in your Vercel project settings
2. Redeploy your application
3. Wait for the deployment to complete

### Solution 2: Database Connection

If there are database connection issues:
1. Verify your `POSTGRES_URL` format is correct
2. Ensure your database is accessible from Vercel
3. Check that your database credentials are correct

### Solution 3: AI Gateway Authentication

If there are AI Gateway issues:
1. Verify your `AI_GATEWAY_API_KEY` is valid
2. Check that your Vercel project is properly integrated with AI Gateway
3. Ensure your API key has sufficient credits

## Testing Your Fix

After making changes:
1. Redeploy your application
2. Visit `/debug` to verify environment variables
3. Try sending a message in the chat
4. Check Vercel logs for any remaining errors

## Need More Help?

If you're still experiencing issues:
1. Check the Vercel logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your AI Gateway API key is valid and has credits
4. Contact Vercel support if the issue persists