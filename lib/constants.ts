import { generateDummyPassword } from './db/utils';
import { debugLog } from './debug';

export const isProductionEnvironment = process.env.NODE_ENV === 'production';
export const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

// Add logging to see the environment detection
debugLog('Environment Detection:');
debugLog('- NODE_ENV:', process.env.NODE_ENV);
debugLog('- PLAYWRIGHT_TEST_BASE_URL:', process.env.PLAYWRIGHT_TEST_BASE_URL);
debugLog('- PLAYWRIGHT:', process.env.PLAYWRIGHT);
debugLog('- CI_PLAYWRIGHT:', process.env.CI_PLAYWRIGHT);
debugLog('- Is Production:', isProductionEnvironment);
debugLog('- Is Development:', isDevelopmentEnvironment);
debugLog('- Is Test:', isTestEnvironment);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();
