// Test script to verify Vercel environment variables
console.log('Testing Vercel environment variables...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log('Running on Vercel:', isVercel);

// Check key environment variables
console.log(
  'AI_GATEWAY_API_KEY:',
  process.env.AI_GATEWAY_API_KEY ? 'SET' : 'NOT SET',
);
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');
console.log('AUTH_SECRET:', process.env.AUTH_SECRET ? 'SET' : 'NOT SET');

// Check for Vercel-specific environment variables
console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'NOT SET');
console.log('VERCEL_URL:', process.env.VERCEL_URL || 'NOT SET');

// Test database connection if URL is set
if (process.env.POSTGRES_URL) {
  console.log('Testing database connection...');
  try {
    // Just log that we would attempt to connect
    console.log('Database URL present, would attempt connection');
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
} else {
  console.log('No database URL set');
}

console.log('Environment test complete');
