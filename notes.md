# Notes

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
