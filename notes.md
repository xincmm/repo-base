# TODO

## 2025-02-01 08:48

- Deployed the app and a couple of things stand out.
  - The trigger.dev implementation is taking a while:
    - The jobs were running out of memory. `docsProcessingJob`
    - Upgrading to a slightly bigger machine helped it out.
    - I'm concerned about the costs of each job running.
    - Next time just set up mastra in a dedicated server
    - Also hit a rate limit with github
      - If i authenticate I'll get 5000 requests an hour

### Next steps

Handle these things next:

- [ ] handle passing the repository id to the agent
- [x] show jobs status on some sort of status bar
  - [x] `useRealtimeRun`
  - [x] One top level component to track all status as the main part
- [ ] authenticate gh client to get higher rate limits
- [ ] improve rate-limit/token-limit logic for:
  - [ ] github api
  - [ ] open-ai embedding generation (rate + token)
  - [ ] agent chat/queries, especially during tool use
    - [ ] add `topK` in the tools
- [ ] handle repository fetching errors
- [ ] return summary generation during embedding
