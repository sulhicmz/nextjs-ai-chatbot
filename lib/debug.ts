import { isDevelopmentEnvironment, isTestEnvironment } from './constants';

/**
 * Conditional logging utility that only logs in development and test environments
 * @param message - The message to log
 * @param optionalParams - Additional parameters to log
 */
export function debugLog(message?: any, ...optionalParams: any[]) {
  // Only log in development or test environments
  if (isDevelopmentEnvironment || isTestEnvironment) {
    console.log(message, ...optionalParams);
  }
}
