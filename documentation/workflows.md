# GitHub Workflows and Dependabot

## GitHub Workflows

This repository uses GitHub Workflows for the purpose of testing all pull requests and managing Dependabot pull requests. Tests includes, for example, ability to build the project.

## Dependatbot ([dependabot.yml](./.github/dependabot.yml))

Dependabot is configured so new NPM dependencies updates are detected. For that, Dependabot creates new update pull request. Update branch created by Dependabot is deleted after merging.

## Auto-merge of dependency updates

Since Dependabot does not take care of automatic merging of its pull requests, GitHub Workflows ([workflows/auto-merge.yml](./.github/workflows/auto-merge.yml)) is set to do that. If update is minor or patch semver change, if source version starts with caret `^` and if all workflows tests pass, then Dependabot pull request is merged automatically.
