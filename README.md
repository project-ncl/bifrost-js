# Bifrost-js

Mono-repo library for Bifrost log streamer web bundle
- client - A JavaScript client for Bifrost(An elastic search log streamer);
- angular-js - Bifrost log streamer angular-js component, module that bridge the library with angular-js.
- demo - [CURRENTLY UNAVAILABLE] A simple demo to give an example of how to use bifrost-js library;
- web-component - A Web Component for displaying Bifrost streams.

## Prerequisites

- locall instalation of **Node** and **npm**

Once the pre-reqs have been taken care of, run:

    npm install -g grunt-cli


## Build project
- `git clone https://github.com/project-ncl/bifrost-js.git bifrost-js`
- `cd ./bifrost-js／`
- `npm install `

- `npm run build`
  - run install for all components(use Lerna Hoisting to hoist dependencies up to the topmost);
  - transpile TypeScript to JavaScript, output: packages/<component_name>/dist/(it's accessible via bower.json main property).
  - run tests available in bifrost-js/


## Release
- we're using bower as package manager in main ui project that's using this library, it's 
  enough to create signed tag in github and new version will be picked up by bower.
