import { generateDummyPassword } from './db/utils';

export const isProductionEnvironment = process.env.NODE_ENV === 'production';
export const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

// Add logging to see the environment detection
console.log('Environment Detection:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PLAYWRIGHT_TEST_BASE_URL:', process.env.PLAYWRIGHT_TEST_BASE_URL);
console.log('- PLAYWRIGHT:', process.env.PLAYWRIGHT);
console.log('- CI_PLAYWRIGHT:', process.env.CI_PLAYWRIGHT);
console.log('- Is Production:', isProductionEnvironment);
console.log('- Is Development:', isDevelopmentEnvironment);
console.log('- Is Test:', isTestEnvironment);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();
