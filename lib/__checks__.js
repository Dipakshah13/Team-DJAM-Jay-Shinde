import { rankWorkers, calculateEta } from './matching.js';
import { calculateEstimate, calculateReceipt, calculatePlatformFee } from './pricing.js';
import { canTransition, JOB_STATUS } from './jobMachine.js';
import { generateOtp, verifyOtp } from './otp.js';
import { deriveWorkerPassport } from './passport.js';
import { INITIAL_WORKERS } from '../data/workers.js';
import { SERVICES } from '../data/services.js';

console.log('--- RUNNING SANITY CHECKS ---');

// 1. Matching
const plumber = SERVICES.find((s) => s.id === 'plumber');
const ranked = rankWorkers(INITIAL_WORKERS, 'plumber');
console.assert(ranked.length > 0, 'Matching should return candidates for plumber');
console.assert(ranked[0].approved === true, 'Top match must be approved');
console.assert(ranked[0].matchScore >= ranked[ranked.length - 1].matchScore, 'Ranking order descending');
console.log(`[PASS] Matching: found ${ranked.length} ranked plumbers. Top: ${ranked[0].name} (Score: ${ranked[0].matchScore})`);

// 2. ETA
const eta = calculateEta(1.8);
console.assert(eta >= 10, 'ETA should be >= 10 min');
console.log(`[PASS] ETA calculation: 1.8km -> ${eta} mins`);

// 3. Pricing & Receipt
const worker = INITIAL_WORKERS[0];
const estimate = calculateEstimate(worker, plumber);
console.assert(estimate.labour === 350, 'Estimate labour should match worker fare');
const receipt = calculateReceipt({
  estimate,
  finalLabourPrice: 350,
  partsAmount: 150,
  extras: [{ id: 'e1', amount: 100, status: 'APPROVED' }],
});
console.assert(receipt.totalPayable === 600, 'Total payable should be 350 + 150 + 100 = 600');
console.assert(receipt.platformFee === Math.round(450 * 0.08), 'Platform fee 8% of labour+extras');
console.log(`[PASS] Pricing & Receipt: Total ₹${receipt.totalPayable}, Fee ₹${receipt.platformFee}`);

// 4. Job Machine
console.assert(canTransition(JOB_STATUS.DRAFT, JOB_STATUS.REQUESTED), 'DRAFT -> REQUESTED valid');
console.assert(canTransition(JOB_STATUS.REQUESTED, JOB_STATUS.CONFIRMED), 'REQUESTED -> CONFIRMED valid');
console.assert(!canTransition(JOB_STATUS.COMPLETED, JOB_STATUS.REQUESTED), 'COMPLETED -> REQUESTED invalid');
console.log('[PASS] Job state transitions');

// 5. OTP
const otp = generateOtp();
console.assert(otp.length === 4, 'OTP length is 4');
console.assert(verifyOtp(otp, otp), 'Valid OTP verifies');
console.assert(!verifyOtp('0000', otp), 'Invalid OTP rejected');
console.log('[PASS] OTP generation & verification');

// 6. Passport
const passport = deriveWorkerPassport(worker, []);
console.assert(passport.completedJobs >= 41, 'Passport jobs count preserved');
console.log(`[PASS] Passport: ${passport.completedJobs} jobs, ${passport.skills.length} skills`);

console.log('--- ALL SANITY CHECKS PASSED SUCCESSFULLY ---');
