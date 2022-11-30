# Bifrost-js

Mono-repo library for Bifrost log streamer web bundle
- client - A JavaScript client for Bifrost(An elastic search log streamer);
- angular-js - Bifrost log streamer angular-js component, module that bridge the library with angular-js.
- demo - [CURRENTLY UNAVAILABLE] A simple demo to give an example of how to use bifrost-js library;
- web-component - A Web Component for displaying Bifrost streams.

## Prerequisites

See `"engines"` in [package.json](./package.json) for minimum version requirements (for example `node` and `npm`).

## Build project
- `git clone https://github.com/project-ncl/bifrost-js.git bifrost-js`
- `cd ./bifrost-js／`
- `npm install `

- `npm run build`
  - run install for all components(use Lerna Hoisting to hoist dependencies up to the topmost);
  - transpile TypeScript to JavaScript, output: packages/<component_name>/dist/(it's accessible via bower.json main property).
  - run tests available in bifrost-js/

## Release
Release process:
1) Create & checkout version branch (0.1.5 for example)
2) Update versions for root package and sub packages:

	2.1 `npx lerna version 0.1.5 --no-git-tag-version --no-push --force-publish`

	2.2 Manually update root package.json version

3) `npm run build`
4) Commit all changes and raise a PR
5) After merging the PR pull the changes locally
6) Tag the release with a semver compatible version (for example v0.1.5)
7) `git push upstream --tags`

8) (Not doing right now) `npm publish`

## GitHub Workflows and Dependabot

To see more details about our GitHub Workflows and Dependabot, open [documentation/workflows.md](./documentation/workflows.md).
