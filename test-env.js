// Simple script to test environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PLAYWRIGHT_TEST_BASE_URL:', process.env.PLAYWRIGHT_TEST_BASE_URL);
console.log('PLAYWRIGHT:', process.env.PLAYWRIGHT);
console.log('CI_PLAYWRIGHT:', process.env.CI_PLAYWRIGHT);
console.log('AI_GATEWAY_API_KEY:', process.env.AI_GATEWAY_API_KEY ? 'SET' : 'NOT SET');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');

// Check if we're in test environment
const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

console.log('Is Test Environment:', isTestEnvironment);