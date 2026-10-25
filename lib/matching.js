import { MATCHING_WEIGHTS } from './constants.js';

/**
 * Computes match score and ranks workers for a given service.
 * Only online and approved workers offering the service are returned.
 */
export function rankWorkers(workers, serviceId) {
  if (!workers || !serviceId) return [];

  const candidates = workers.filter(
    (w) => w.approved && w.online && w.services.includes(serviceId)
  );

  const scored = candidates.map((worker) => {
    // Offers service -> base 0.6 + experienceYears/20, capped at 1.0
    const skillScore = Math.min(1.0, 0.6 + (worker.experienceYears || 0) / 20);
    const availScore = worker.online ? 1.0 : 0.0;
    const distScore = Math.max(0.0, 1.0 - (worker.distanceKm || 0) / 10);
    const verifScore = worker.verified ? 1.0 : 0.0;

    const totalScore =
      MATCHING_WEIGHTS.SKILL * skillScore +
      MATCHING_WEIGHTS.AVAILABILITY * availScore +
      MATCHING_WEIGHTS.DISTANCE * distScore +
      MATCHING_WEIGHTS.VERIFIED * verifScore;

    const etaMinutes = calculateEta(worker.distanceKm);

    return {
      ...worker,
      matchScore: Number(totalScore.toFixed(3)),
      etaMinutes,
      etaLabel: formatEtaLabel(etaMinutes),
    };
  });

  // Sort descending by score; tie-break by lower distance
  return scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return (a.distanceKm || 0) - (b.distanceKm || 0);
  });
}

/**
 * Calculate ETA in minutes: 8 + distanceKm * 4, rounded to nearest 5
 */
export function calculateEta(distanceKm = 1) {
  const rawMinutes = 8 + distanceKm * 4;
  return Math.max(10, Math.round(rawMinutes / 5) * 5);
}

/**
 * Format ETA label e.g., "about 20 min"
 */
export function formatEtaLabel(minutes) {
  return `about ${minutes} min`;
}
