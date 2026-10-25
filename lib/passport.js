/**
 * Derives the Skill Passport for a worker based on completed jobs and verified checks.
 * No fake certificates: milestones require >= 10 jobs and admin-checked skills.
 */
export function deriveWorkerPassport(worker, bookings = []) {
  if (!worker) return null;

  const completedBookings = bookings.filter(
    (b) => b.workerId === worker.id && (b.status === 'COMPLETED' || b.status === 'RATED')
  );

  const totalCompleted = (worker.jobsDone || 0) + completedBookings.length;

  // Aggregate skills
  const skillsMap = {};

  // Existing skills on profile
  if (worker.passport?.skills) {
    worker.passport.skills.forEach((s) => {
      skillsMap[s.name] = {
        name: s.name,
        source: s.source || 'jobs',
        count: s.count || 0,
      };
    });
  }

  // Count from newly completed bookings in current session
  completedBookings.forEach((b) => {
    const serviceName = b.serviceId
      ? b.serviceId.charAt(0).toUpperCase() + b.serviceId.slice(1)
      : 'General Service';
    if (!skillsMap[serviceName]) {
      skillsMap[serviceName] = { name: serviceName, source: 'jobs', count: 0 };
    }
    skillsMap[serviceName].count += 1;
  });

  const skills = Object.values(skillsMap);

  // Certificates rules:
  // Requires at least 10 completed jobs + verified or admin-checked skill
  const certificates = [];
  if (worker.passport?.certificates) {
    certificates.push(...worker.passport.certificates);
  }

  if (totalCompleted >= 10 && !certificates.some((c) => c.includes('Pro Performer'))) {
    certificates.push('Pro Performer Level 1 (10+ completed jobs)');
  }
  if (totalCompleted >= 50 && !certificates.some((c) => c.includes('Master Veteran'))) {
    certificates.push('Master Craftsman (50+ completed jobs)');
  }

  return {
    completedJobs: totalCompleted,
    skills,
    certificates,
    nextMilestone:
      totalCompleted < 10
        ? { target: 10, remaining: 10 - totalCompleted, title: 'Pro Performer Level 1' }
        : totalCompleted < 50
        ? { target: 50, remaining: 50 - totalCompleted, title: 'Master Craftsman' }
        : null,
  };
}
