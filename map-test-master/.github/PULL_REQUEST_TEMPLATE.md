### PR: Cleanup and UX/AI improvements

This PR contains the following grouped changes (branch: cleanup/remove-duplicates):

- chore: remove duplicated nested app and Python caches
- feat(ui): add visible map error banners for token/WebGL/tiles errors
- feat(ui): polish landing search panel styles for a more professional look
- fix(map): expose `window.currentMap` for debugging and add map error handlers
- feat(ai): add safe_call wrapper for AI agents with retries and basic caching
- chore: add `__pycache__/` to .gitignore

Please review the changes and test locally.

Notes:
- The runtime token is read from `public/assets/runtime-env.js` during local dev. Consider not committing secrets in production.
- I recommend reviewing the `ai_reasoning_agent` changes and running the local playground to ensure the agent works as expected.
