// Single source of truth for the two values the brief left for Michael to
// confirm. Both src/pages/local-legends.astro and src/pages/api/legends/*
// import from here, so confirming the real deadline is a one-line edit.

// CONFIGURE: placeholder - replace with the real voting close date/time once Michael confirms.
export const VOTING_CLOSES_AT = new Date('2026-12-31T23:59:59+02:00');

// CONFIGURE: true = live public tally, false = hidden until voting closes.
// Either way, results are always shown once VOTING_CLOSES_AT has passed.
export const LEADERBOARD_LIVE = false;

export function isVotingOpen(): boolean {
  return Date.now() < VOTING_CLOSES_AT.getTime();
}

export function isLeaderboardVisible(): boolean {
  return LEADERBOARD_LIVE || !isVotingOpen();
}
