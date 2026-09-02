-- Local Legends voting. `email` as the primary key is the actual enforcement
-- of "one vote per person" - a second vote from the same email either gets
-- rejected (already confirmed) or overwrites their pending choice (they
-- haven't clicked the confirm link yet, so they're still allowed to change
-- their mind). See src/pages/api/legends/vote.ts.
CREATE TABLE IF NOT EXISTS votes (
  email TEXT PRIMARY KEY,
  legend_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'confirmed'
  confirm_token TEXT NOT NULL,
  created_at TEXT NOT NULL,
  confirmed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_votes_legend_id ON votes (legend_id);
CREATE INDEX IF NOT EXISTS idx_votes_confirm_token ON votes (confirm_token);
