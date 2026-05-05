# Frontend-Only Tradeoffs

This MVP intentionally avoids backend infrastructure.

Benefits:

- Fast hackathon build.
- Easy demo and review.
- Transparent scoring.
- No backend attack surface or database setup.

Tradeoffs:

- Public Birdeye key is visible.
- Browser calls can hit CORS or rate limits.
- Unlock gating is not private.
- Watchlist is local-only.

Production should add a secure API proxy, persistent profiles, private report generation, and notification infrastructure.
