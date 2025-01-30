# Notes

## Thoughts at 2025-01-30 13:51

The ui is hooked up with the use chat. The agent is also set up and things are working as expected.

Next steps:

- handle ui sizing.
  - wrap text messages, maybe look into css containers?
  - wrap chat area with a scroll area and limit length
  - co-ordinate the height of the text area to the height of the chat area
  - render makrdown messages properly
  - render role indicators next to the messages
- build up agent capability.
  - build tools.
    - tools for embedded documentations
    - tools for available stats, like stars, forks, etc
    - tools for file tree exploration
  - repo analysis
    - commit history analysis agent/workflows
    - pr and issues analysis agent/workflows
    - more stats. code changes, commits, contributor ranking, etc agents/workflows

## Thoughts at 2025-01-30 11:51

Trying to figure out how to build out the chatting ui.
The ai sdk, specifically the useChat hook seems to work well with mastra
The general flow looks something like this:

- Get messages from the agents memory. Can do this in a server component and pass down messages to the client component using the hook
- use and endopint, instead of a server action to send messages
- this means, to set up the chatting agent on an ai endpoint, instead of a server action
- Submissins are sent automatically to the endopint /api/chat
- call mastra instance from there as well, and send back a streaming response
- so how do I set up the agent?
  - The agent will get the repo id
  - use that to determine the right table on the db to query against the embeddings
  - that sounds like a tool call
  - provide agent with tools while setting it up
  - just show the messages now!

## Exploring the GitHub REST API

### Some endpoints of interest

- Repository collaborators
- List commits: `/repos/{owner}/{repo}/commits`
- Commit comments: `/repos/{owner}/{repo}/comments`
- List repo deployments: `/repos/{owner}/{repo}/deployments`
- List repo issues: `repos/{owner}/{repo}/issues`
- List sub-issues of an issue
- Get the license of a repo
- Get commit stats
  - Weekly commit activity
  - Last year of commit activity
  - All contributor commit activity
  - Weekly commit count
- List pull requests
  - List commits on a pull requests
  - List pull request files
- List review comments in a repo
- List review comments on a pull request
- List reviews for a pull request
- List comments for a pull request review
- Reactions for issues, reviews, comments, commits, etc
- List releases
- Get the latest release
- List release assets
- Repo content
  - Get repo readme
  - Get repo readme for a directory
  - Can recursively get a tree (Git database get a tree)
  - Files are base64 encoded
- Get forks
- List repository activities, pushes, merges, etc
- List repo languages, tags, topics
- List repo security advisories

## Thoughts @ 2025-01-23 12:48

- Initial approach would be to get the metadata and general repo details. These can be stored in the repo easily and embeddings can be generated to get this info.
- Or should I use a tool-based approach for some of this smaller things
- In terms of actual content, doing full processing for some of these things can be quite large and inefficient
- I could start by building out a tree and understanding all the files in the repository
- show this list of files, in a nice tree, folders and all
- fetch file contents directly via the github rest api, instead of having that stored
- I could then just do a summary of what the file does with ai. At the very least this will add some context.
- It could mention what the file does, what symbols are present in the file
- and add this to some sort of context? How would this context be
- imports can start showing what's used in the file, but won't know where the symbols present in the file are used, but that's sort of something for now
- could also show like lists of issues and lists of pull requests
- maybe a summary of what these issues and prs are.

Things like code stats could definitely just use tools, return structured data.

- show things like commit stats, contribution graphs, etc

HOW can we use cached prompts/predicted outputs when we fetch these files?

For someone who just wants to use such a knowledge base, what could be the main use?

- on-boarding to the repo use-case

What does a good starting point look like?

- Get basic stats and a chat agent with some tools for users to interact with.
- Generate small summary with basic stats as repo description.

## Thoughts at 2025-01-29 10:14

Work on the core documentation understanding agent
This agent will get all documentation related
I've formulated a simple SQL query to get common documentation patterns.
This is a nice place to start.

I also need to start on the chat immediately
Goal of today is to start chatting with available info.

The general stats and the doc agent's first phase.

How do we approach this?

- Build out the core documentation agent/workflow
  - It could be a general workflow. With the following logical steps
    - Fetch core documentation related files
    - Clean-up/deduplication of fetched files. Prioritizing root files.
    - Readme's are all important, licenses need some filtering, the path context is important, but we don't need to redo the parsing, etc for each similar license.
    - So this sort of calls for a path based approach, understanding path levels and docs at each level. Making sure all docs are understood and path contexts added to it.
- Trying to tie it all together with the chat agent. The chat agent could be an orchestrator agent. It could have access to other agents, call them when needed. In this case, if there's a documentation based agent ready, the chat agent could ask that agent to provide some information about that. Questions relating to what might be available in readmes' license, contribution, contributor's list, authors, etc
  - How does this documentation agent, store information? Does it build a summary doc of these things and save that for RAG?
