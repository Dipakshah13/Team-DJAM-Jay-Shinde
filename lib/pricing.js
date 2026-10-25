import { FEE_RATE } from './constants.js';

/**
 * Calculates initial estimate
 */
export function calculateEstimate(worker, service) {
  const labour = worker?.baseFare || 350;
  const parts = service?.defaultParts || 100;
  return {
    labour,
    parts,
    total: labour + parts,
  };
}

/**
 * Computes approved extra charges total
 */
export function getApprovedExtrasTotal(extras = []) {
  return extras
    .filter((e) => e.status === 'APPROVED')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

/**
 * Calculates platform fee based on labour + approved extras (services rendered)
 */
export function calculatePlatformFee(labourAmount = 0, feeRate = FEE_RATE) {
  return Math.round(labourAmount * feeRate);
}

/**
 * Calculates complete receipt breakdown
 */
export function calculateReceipt({ estimate, finalLabourPrice, partsAmount, extras = [] }) {
  const labour = finalLabourPrice !== null && finalLabourPrice !== undefined 
    ? Number(finalLabourPrice) 
    : (estimate?.labour || 0);

  const parts = partsAmount !== null && partsAmount !== undefined 
    ? Number(partsAmount) 
    : (estimate?.parts || 0);

  const approvedExtras = getApprovedExtrasTotal(extras);
  const totalPayable = labour + parts + approvedExtras;
  const platformFee = calculatePlatformFee(labour + approvedExtras);
  const workerPayout = totalPayable - platformFee;

  return {
    labour,
    parts,
    approvedExtras,
    totalPayable,
    platformFee,
    workerPayout,
    feeRatePercentage: Math.round(FEE_RATE * 100),
  };
}
