import { NextResponse } from 'next/server';

export async function GET() {
  // Simple health check
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  });
}