# TODO

## 2025-02-02 18:08

- [ ] If there are files in the repo already, manually show the pill on the status bar as completed
  - the public access key we store on the db expires after some time

## 2025-02-01 13:07

- What really needs to go to trigger.dev?
  - Getting file content from github api
  - Chunking
  - Embedding
- These are the long running tasks really.
- Can I trigger trigger.dev from a mastra workflow? I think so
- Also, we might just have to have the file fetching happen on nextjs
- We'll test it out and see

- So here's how I'm thinking of it now.
  - Mastra workflow is an orchestrator
  - We call this directly from the server action, instead of trigger.dev
  - Steps in the workflow:
    - First step is fetching file metadata that's stored in the db
    - Divide the files into managable batches. Trigger area now. Will return handle(s)
      - Getting file contents
      - Chunking happens next
      - Embedding
      - Storing

## 2025-02-01 08:48

- Deployed the app and a couple of things stand out.
  - The trigger.dev implementation is taking a while:
    - The jobs were running out of memory. `docsProcessingJob`
    - Upgrading to a slightly bigger machine helped it out.
    - I'm concerned about the costs of each job running.
    - Next time just set up mastra in a dedicated server
    - Also hit a rate limit with github
      - If i authenticate I'll get 5000 requests an hour
    - Rate limit with the embedding api as well at 500 requests a minute

### Next steps

Handle these things next:

- [x] handle passing the repository id to the agent
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
- [ ] show user's session repositories on home page
- [ ] disable/enable prompt textarea based on:
  - [ ] agent responding
  - [ ] initial files and docs not present
