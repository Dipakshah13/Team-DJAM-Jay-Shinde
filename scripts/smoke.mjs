import assert from 'assert';
import { calculatePlatformFee, calculateReceipt } from '../lib/pricing.js';
import { rankWorkers } from '../lib/matching.js';
import { JOB_STATUS, canTransition, TRANSITIONS } from '../lib/jobMachine.js';
import { deriveWorkerPassport } from '../lib/passport.js';
import { FEE_RATE } from '../lib/constants.js';

console.log('🧪 Starting Book My Service Smoke Tests...\n');

// 1. Fee Assertions
console.log('1. Checking Platform Fee calculation...');
const labour = 500;
const extras = 150;
const expectedFee = Math.round((labour + extras) * FEE_RATE);
const actualFee = calculatePlatformFee(labour + extras);
assert.strictEqual(actualFee, expectedFee, `Fee should equal round(8% of labour + extras)`);

const receipt = calculateReceipt({
  estimate: { labour: 400, parts: 100 },
  finalLabourPrice: 400,
  partsAmount: 100,
  extras: [{ amount: 100, status: 'APPROVED' }],
});
assert.strictEqual(receipt.platformFee, Math.round((400 + 100) * FEE_RATE));
assert.strictEqual(receipt.workerPayout, receipt.totalPayable - receipt.platformFee);
console.log('   ✅ Fee calculation test passed.');

// 2. Offline Workers Excluded Assertion
console.log('2. Checking offline & unapproved workers filtering...');
const testWorkers = [
  { id: 'w1', name: 'Online Worker', services: ['plumber'], online: true, approved: true, baseFare: 300 },
  { id: 'w2', name: 'Offline Worker', services: ['plumber'], online: false, approved: true, baseFare: 300 },
  { id: 'w3', name: 'Unapproved Worker', services: ['plumber'], online: true, approved: false, baseFare: 300 },
  { id: 'w4', name: 'Different Service Worker', services: ['electrician'], online: true, approved: true, baseFare: 300 },
];
const ranked = rankWorkers(testWorkers, 'plumber');
assert.strictEqual(ranked.length, 1, 'Only online and approved plumber must be returned');
assert.strictEqual(ranked[0].id, 'w1');
console.log('   ✅ Worker matching filter test passed.');

// 3. State Machine Transitions Assertion
console.log('3. Checking Job Machine transitions...');
assert.strictEqual(canTransition(JOB_STATUS.REQUESTED, JOB_STATUS.CANCELLED), true);
assert.strictEqual(canTransition(JOB_STATUS.COUNTERED, JOB_STATUS.CANCELLED), true);
assert.strictEqual(canTransition(JOB_STATUS.CONFIRMED, JOB_STATUS.CANCELLED), true);
assert.strictEqual(TRANSITIONS[JOB_STATUS.DECLINED].length, 0, 'DECLINED must be terminal');
assert.strictEqual(TRANSITIONS[JOB_STATUS.RATED].length, 0, 'RATED must be terminal');
assert.strictEqual(TRANSITIONS[JOB_STATUS.CANCELLED].length, 0, 'CANCELLED must be terminal');
console.log('   ✅ Job Machine transitions test passed.');

// 4. Passport Count Increment Assertion
console.log('4. Checking Passport count derivation...');
const mockWorker = {
  id: 'w1',
  name: 'Ramesh',
  jobsDone: 15,
  passport: { skills: [{ name: 'Plumber', source: 'jobs', count: 15 }] },
};
const mockBookings = [
  { id: 'b1', workerId: 'w1', status: 'COMPLETED', serviceId: 'plumber' },
  { id: 'b2', workerId: 'w1', status: 'CONFIRMED', serviceId: 'plumber' },
];
const derived = deriveWorkerPassport(mockWorker, mockBookings);
assert.strictEqual(derived.completedJobs, 16, 'Completed jobs count must increment by 1 for completed booking');
console.log('   ✅ Passport count derivation test passed.');

console.log('\n🎉 ALL SMOKE TESTS PASSED SUCCESSFULLY!');
process.exit(0);
