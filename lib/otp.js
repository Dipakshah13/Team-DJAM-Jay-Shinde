import { DEMO_OTP } from './constants.js';

/**
 * Generates a random 4-digit OTP
 */
export function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Validates entered OTP against expected OTP
 */
export function verifyOtp(enteredOtp, expectedOtp) {
  if (!enteredOtp || !expectedOtp) return false;
  return enteredOtp.trim() === expectedOtp.trim();
}

/**
 * Validates demo login OTP (accepts 1234 or actual)
 */
export function verifyDemoOtp(enteredOtp) {
  return enteredOtp?.trim() === DEMO_OTP;
}
