# npm-module-template

## What
* [bun](https://bun.sh/docs/bundler) build - with types the best I could (see build notes below)
* [eslint](https://eslint.org/) with [prettier](https://prettier.io/) formatting
* [fixpack](https://www.npmjs.com/package/fixpack) to normalize package.json changes along with `npm pkg fix`
* [husky](https://typicode.github.io/husky/) pre commit hooks
* [changesets](https://github.com/changesets/changesets) change and release workflow

## Installation
Click the [Use this template](https://github.com/Enalmada/npm-module-template/generate) button to create a new repository 
(or run `bun create Enalmada/npm-module-template <your-new-library-name>`)

To switch existing repository 
* `git remote add template https://github.com/Enalmada/npm-module-template`
* `git fetch template`
* `git merge template/main --allow-unrelated-histories`
* resolve conflicts and merge

### Github settings
* add NPM_TOKEN with access to deploy to npm to environment variables
* Actions > General > Workflow Permissions
  * Read and Write (to allow changesets to create changelog, and release)
  * Allow github actions to create and approve PR

## Workflow
* install dependencies `bun install`
* lint files `bun lint:fix`
* run tests `bun run test` (not `bun test` as we are not using native tests)
* run build `bun run build` (not `bun build` as we are using build script)
* create changeset before PR `changeset` and choose appropriate semver and changelog

### TODO
- [ ] tests framework to bun (when bun supports mocking modules)

### inspiration
* [bun-lib-starter](https://github.com/wobsoriano/bun-lib-starter)

## Notes
### Build
* Using [latest module and target settings](https://stackoverflow.com/questions/72380007/what-typescript-configuration-produces-output-closest-to-node-js-18-capabilities/72380008#72380008) for current LTS
* using tsc for types until [bun support](https://github.com/oven-sh/bun/issues/5141#issuecomment-1727578701) comes around

## Contribute
Using [changesets](https://github.com/changesets/changesets) so please remember to run "changeset" with any PR that might be interesting to people on an older template.
Although this isn't being deployed as a module, I would like to call out things worth keeping in sync.