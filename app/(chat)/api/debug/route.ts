import { NextResponse } from 'next/server';

export async function GET() {
  // Check environment variables
  const envStatus = {
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY ? 'SET' : 'MISSING',
    POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? 'SET' : 'MISSING',
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? 'SET' : 'MISSING',
    REDIS_URL: process.env.REDIS_URL ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    isTestEnvironment: Boolean(
      process.env.PLAYWRIGHT_TEST_BASE_URL ||
        process.env.PLAYWRIGHT ||
        process.env.CI_PLAYWRIGHT
    ),
  };

  return NextResponse.json({
    status: 'Environment check complete',
    environment: envStatus,
  });
}