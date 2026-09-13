-- One-time recovery for the Resend outage: votes cast while the confirmation
-- email couldn't send got stuck as 'pending' and were never counted, even
-- though the vote row (email + chosen legend_id) was captured correctly.
-- The vote flow no longer requires email confirmation (see vote.ts), so this
-- promotes every stuck vote to 'confirmed' rather than losing it.
UPDATE votes
SET status = 'confirmed',
    confirmed_at = COALESCE(confirmed_at, created_at)
WHERE status = 'pending';
