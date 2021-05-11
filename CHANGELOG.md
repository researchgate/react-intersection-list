## [3.0.12](https://github.com/researchgate/react-intersection-list/compare/v3.0.11...v3.0.12) (2021-05-11)


### Bug Fixes

* **renovate:** Force default branch to be main ([74fa774](https://github.com/researchgate/react-intersection-list/commit/74fa77474de0c95d94f4bfcf24d7b198bfda98e6))

## [3.0.11](https://github.com/researchgate/react-intersection-list/compare/v3.0.10...v3.0.11) (2020-08-14)


### Bug Fixes

* **security:** Fix security issue with serialize-javascript ([8c3265e](https://github.com/researchgate/react-intersection-list/commit/8c3265e10a4de29a7717edc53f6be7158f41b77d))

## [3.0.10](https://github.com/researchgate/react-intersection-list/compare/v3.0.9...v3.0.10) (2020-05-04)


### Bug Fixes

* fix import path of intersection-observer dependency in sentinel ([#124](https://github.com/researchgate/react-intersection-list/issues/124)) ([659afa8](https://github.com/researchgate/react-intersection-list/commit/659afa8835ede0b07bd49d3d23f8e652312c1dff))

## [3.0.9](https://github.com/researchgate/react-intersection-list/compare/v3.0.8...v3.0.9) (2020-03-26)


### Bug Fixes

* **intersection-observer:** upgrade to latest version and adapt ([1a5fa7c](https://github.com/researchgate/react-intersection-list/commit/1a5fa7c60e1aaab3a4056b4bd1e5049fbb3c7294))

## [3.0.8](https://github.com/researchgate/react-intersection-list/compare/v3.0.7...v3.0.8) (2019-12-01)


### Bug Fixes

* **deps:** lock file maintenance ([#79](https://github.com/researchgate/react-intersection-list/issues/79)) ([fd19604](https://github.com/researchgate/react-intersection-list/commit/fd1960478c2dadb8518c45fc113216168325061a))

## [3.0.7](https://github.com/researchgate/react-intersection-list/compare/v3.0.6...v3.0.7) (2019-11-23)


### Bug Fixes

* **publish:** Do not publish tests ([ef19403](https://github.com/researchgate/react-intersection-list/commit/ef19403259e91b9fd27109d3c56cae5f84679167))

## [3.0.6](https://github.com/researchgate/react-intersection-list/compare/v3.0.5...v3.0.6) (2019-11-23)


### Bug Fixes

* **spire:** change tooling and build system to spire ([36bdcd7](https://github.com/researchgate/react-intersection-list/commit/36bdcd7bc9f61d5c3f33e0e73f0afbdba6cc353f))

# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.0.5"></a>
## [3.0.5](https://github.com/researchgate/react-intersection-list/compare/v3.0.4...v3.0.5) (2019-05-16)



<a name="3.0.4"></a>
## [3.0.4](https://github.com/researchgate/react-intersection-list/compare/v3.0.3...v3.0.4) (2019-04-25)


### Bug Fixes

* **reobserve:** using externalUnobserver to operate on the right target ([f6d9dc2](https://github.com/researchgate/react-intersection-list/commit/f6d9dc2))



<a name="3.0.3"></a>
## [3.0.3](https://github.com/researchgate/react-intersection-list/compare/v3.0.2...v3.0.3) (2019-04-23)



<a name="3.0.2"></a>
## [3.0.2](https://github.com/researchgate/react-intersection-list/compare/v3.0.1...v3.0.2) (2018-06-18)



<a name="3.0.1"></a>
## [3.0.1](https://github.com/researchgate/react-intersection-list/compare/v3.0.0...v3.0.1) (2018-05-28)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/researchgate/react-intersection-list/compare/v1.0.2...v3.0.0) (2018-05-15)


### Features

* **prop_api_update:** introducing API for 2.0.0 ([276ca7b](https://github.com/researchgate/react-intersection-list/commit/276ca7b))
* **React16.4:** Migrated codebase to stop using legacy lifecycles ([ab7fc85](https://github.com/researchgate/react-intersection-list/commit/ab7fc85))


### BREAKING CHANGES

* **prop_api_update:** * Replace `currentLength` with more descriptive `itemCount` prop
* New render prop `renderItem` to completement `children` as render prop
* New prop `items` as a unique identifier/symbol to provide an easier integration of reusable lists
* TypeScript Module definitions



<a name="2.0.0"></a>
# [2.0.0](https://github.com/researchgate/react-intersection-list/compare/v1.0.2...v2.0.0) (2018-05-09)


### Features

* **prop_api_update:** introducing API for 2.0.0


### BREAKING CHANGES

* **prop_api_update:** * Replace `currentLength` with more descriptive `itemCount` prop
* New render prop `renderItem` to completement `children` as render prop
* New prop `items` as a unique identifier/symbol to provide an easier integration of reusable lists
* TypeScript Module definitions



<a name="1.0.2"></a>
## [1.0.2](https://github.com/researchgate/react-intersection-list/compare/v1.0.1...v1.0.2) (2018-04-12)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/researchgate/react-intersection-list/compare/v1.0.0...v1.0.1) (2018-02-26)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/researchgate/react-intersection-list/compare/v0.4.1...v1.0.0) (2017-11-24)


### Features

* **React16:** support for React 16 ([12ba423](https://github.com/researchgate/react-intersection-list/commit/12ba423))
* **setRootNode:** save call to getComputedStyle if root node is unchanged ([80659dd](https://github.com/researchgate/react-intersection-list/commit/80659dd))


### BREAKING CHANGES

* **React16:** <sentinel> tag replaced by a <span> tag.
* **React16:** deprecation warning will not longer appear for itemsLength prop.



<a name="0.4.1"></a>
## [0.4.1](https://github.com/researchgate/react-intersection-list/compare/v0.4.0...v0.4.1) (2017-10-11)


* Update @researchgate/react-intersection-observer dependency to the latest version



<a name="0.4.0"></a>
# [0.4.0](https://github.com/researchgate/react-intersection-list/compare/v0.3.2...v0.4.0) (2017-10-10)


### Features

* **currentLength:** replace itemsLength with more explicit currentLength prop name ([de19504](https://github.com/researchgate/react-intersection-list/commit/de19504))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/researchgate/react-intersection-list/compare/v0.3.1...v0.3.2) (2017-09-23)


### Bug Fixes

* **dependencies:** Remove rimraf from dependencies ([b78adde](https://github.com/researchgate/react-intersection-list/commit/b78adde))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/researchgate/react-intersection-list/compare/v0.3.0...v0.3.1) (2017-09-20)



<a name="0.3.0"></a>
# 0.3.0 (2017-09-14)


### Features

* **core_dep_update:** update react-intersection-observer to latest version ([201c2d1](https://github.com/researchgate/react-intersection-list/commit/201c2d1))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/researchgate/react-intersection-list/compare/v0.1.0...v0.1.1) (2017-09-12)


### Bug Fixes

* **sentinel:** ensure sentinel re-observes after items render ([e6d0fa5](https://github.com/researchgate/react-intersection-list/commit/e6d0fa5))



<a name="0.1.0"></a>
# 0.1.0 (2017-09-11)


### Features

* **awaitMore:** improved API with awaitMore ([6c58e95](https://github.com/researchgate/react-intersection-list/commit/6c58e95))
* **hasMore:** prop that allows to bypass the length-size check ([f67ab3d](https://github.com/researchgate/react-intersection-list/commit/f67ab3d))
