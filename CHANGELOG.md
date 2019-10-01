## [0.0.93](https://github.com/wessberg/polyfiller/compare/v0.0.92...v0.0.93) (2019-10-01)

## [0.0.92](https://github.com/wessberg/polyfiller/compare/v0.0.86...v0.0.92) (2019-09-25)

## [0.0.86](https://github.com/wessberg/polyfiller/compare/v0.0.85...v0.0.86) (2019-09-09)

## [0.0.85](https://github.com/wessberg/polyfiller/compare/v0.0.83...v0.0.85) (2019-07-18)

## [0.0.83](https://github.com/wessberg/polyfiller/compare/v0.0.82...v0.0.83) (2019-05-08)

### Features

- **logging:** adds referrer logging ([77cbce8](https://github.com/wessberg/polyfiller/commit/77cbce8))

## [0.0.82](https://github.com/wessberg/polyfiller/compare/v0.0.81...v0.0.82) (2019-04-11)

## [0.0.81](https://github.com/wessberg/polyfiller/compare/v0.0.80...v0.0.81) (2019-04-06)

### Bug Fixes

- **proto:** makes the proto polyfill not entirely crash IE 8. Fixes [#5](https://github.com/wessberg/polyfiller/issues/5) ([4cfec27](https://github.com/wessberg/polyfiller/commit/4cfec27))

## [0.0.80](https://github.com/wessberg/polyfiller/compare/v0.0.79...v0.0.80) (2019-04-06)

### Features

- **polyfill:** adds a 'proto' polyfill that adds support for '**proto**' on IE <11 ([41ba4c2](https://github.com/wessberg/polyfiller/commit/41ba4c2))

## [0.0.79](https://github.com/wessberg/polyfiller/compare/v0.0.78...v0.0.79) (2019-04-06)

### Bug Fixes

- **bug:** fixes a bug that would lead to crashes when requesting global-this ([a24d038](https://github.com/wessberg/polyfiller/commit/a24d038))

## [0.0.78](https://github.com/wessberg/polyfiller/compare/v0.0.77...v0.0.78) (2019-04-02)

### Bug Fixes

- **bug:** stops auto-applying zone patches for ShadyDOM when requesting both Zone and shadow-dom since this may lead to issues in IE11 ([fb6c5cf](https://github.com/wessberg/polyfiller/commit/fb6c5cf))

## [0.0.77](https://github.com/wessberg/polyfiller/compare/v0.0.76...v0.0.77) (2019-04-01)

## [0.0.76](https://github.com/wessberg/polyfiller/compare/v0.0.75...v0.0.76) (2019-04-01)

### Features

- **shadow-dom:** adds a 'experimental' option to the shadow-dom polyfill which may reduce bugs in older browsers such as IE and Edge <=15 ([fb1a8f9](https://github.com/wessberg/polyfiller/commit/fb1a8f9))

## [0.0.75](https://github.com/wessberg/polyfiller/compare/v0.0.74...v0.0.75) (2019-03-28)

### Bug Fixes

- **bug:** fixes an issue where polyfills with es2015 block scoping would cause issues in older browers ([4efd9dd](https://github.com/wessberg/polyfiller/commit/4efd9dd))

### Features

- **zone:** added ResizeObserver patch for Zone ([1cdcbb5](https://github.com/wessberg/polyfiller/commit/1cdcbb5))
- **zone.js:** adds additional configuration options for Zone.js ([315b0c1](https://github.com/wessberg/polyfiller/commit/315b0c1))

## [0.0.74](https://github.com/wessberg/polyfiller/compare/v0.0.73...v0.0.74) (2019-03-27)

### Bug Fixes

- **resize-observer:** Changes ResizeObserver polyfill implementation since the current one causes significant performance issues in some browsers ([aa5ffd8](https://github.com/wessberg/polyfiller/commit/aa5ffd8))

## [0.0.73](https://github.com/wessberg/polyfiller/compare/v0.0.72...v0.0.73) (2019-03-17)

### Bug Fixes

- **zone:** fixes an issue where zone would break polyfill bundles for web workers/service workers ([22b45c5](https://github.com/wessberg/polyfiller/commit/22b45c5))

## [0.0.72](https://github.com/wessberg/polyfiller/compare/v0.0.71...v0.0.72) (2019-03-12)

### Bug Fixes

- **feature detection:** adds feature detections for newer features such as Intl.ListFormat, String.prototype.matchAll, and Constructable Stylesheets/DocumentOrShadowRoot.adoptedStyleSheets ([c14c118](https://github.com/wessberg/polyfiller/commit/c14c118))

## [0.0.71](https://github.com/wessberg/polyfiller/compare/v0.0.70...v0.0.71) (2019-03-12)

### Bug Fixes

- **intl:** fixes intl polyfills ([3e3a553](https://github.com/wessberg/polyfiller/commit/3e3a553))

## [0.0.70](https://github.com/wessberg/polyfiller/compare/v0.0.69...v0.0.70) (2019-03-12)

### Bug Fixes

- **safari:** fixes Intl issue ([adede93](https://github.com/wessberg/polyfiller/commit/adede93))

## [0.0.69](https://github.com/wessberg/polyfiller/compare/v0.0.68...v0.0.69) (2019-03-12)

### Bug Fixes

- **safari:** fixes Intl issue ([030ea4b](https://github.com/wessberg/polyfiller/commit/030ea4b))

## [0.0.68](https://github.com/wessberg/polyfiller/compare/v0.0.67...v0.0.68) (2019-03-12)

### Bug Fixes

- **safari:** fixes Intl issue ([590bcfc](https://github.com/wessberg/polyfiller/commit/590bcfc))

## [0.0.67](https://github.com/wessberg/polyfiller/compare/v0.0.66...v0.0.67) (2019-03-11)

### Bug Fixes

- **safari:** fixes Intl issue in Safari with PluralRules ([e278c75](https://github.com/wessberg/polyfiller/commit/e278c75))

## [0.0.66](https://github.com/wessberg/polyfiller/compare/v0.0.65...v0.0.66) (2019-03-07)

### Bug Fixes

- **hosting:** fixes a bug with resolving file paths in Docker environments ([e13be77](https://github.com/wessberg/polyfiller/commit/e13be77))

## [0.0.65](https://github.com/wessberg/polyfiller/compare/v0.0.64...v0.0.65) (2019-03-07)

### Bug Fixes

- **hosting:** fixes a bug in Docker environments ([bcf6028](https://github.com/wessberg/polyfiller/commit/bcf6028))

## [0.0.64](https://github.com/wessberg/polyfiller/compare/v0.0.63...v0.0.64) (2019-03-05)

### Bug Fixes

- **hosting:** fixes some issues with self-hosting when dependencies are hoisted ([d4958fd](https://github.com/wessberg/polyfiller/commit/d4958fd))

## [0.0.63](https://github.com/wessberg/polyfiller/compare/v0.0.62...v0.0.63) (2019-03-01)

### Bug Fixes

- **custom-elements:** adds MutationObserver as dependency of the custom-elements polyfill ([3716111](https://github.com/wessberg/polyfiller/commit/3716111))

## [0.0.62](https://github.com/wessberg/polyfiller/compare/v0.0.61...v0.0.62) (2019-02-16)

### Features

- **polyfill:** Adds polyfill for Constructable StyleSheets ([b9f9989](https://github.com/wessberg/polyfiller/commit/b9f9989))

## [0.0.61](https://github.com/wessberg/polyfiller/compare/v0.0.60...v0.0.61) (2019-02-07)

### Bug Fixes

- **polyfill:** fixes a caching issue ([964449f](https://github.com/wessberg/polyfiller/commit/964449f))
- **polyfill:** updated supported contexts for requestIdleCallback ([5261d13](https://github.com/wessberg/polyfiller/commit/5261d13))

## [0.0.60](https://github.com/wessberg/polyfiller/compare/v0.0.59...v0.0.60) (2019-02-07)

### Features

- **contexts:** adds support for passing a context of either 'window', 'worker', or 'node' as a query parameter ([5266c25](https://github.com/wessberg/polyfiller/commit/5266c25)), closes [#2](https://github.com/wessberg/polyfiller/issues/2)
- **polyfill:** adds missing ESNext map methods: 'Map.#every, 'Map.#find', 'Map.#find-key', 'Map.#includes', 'Map.#key-of', 'Map.#reduce', Map.'#some', and 'Map.#update' ([1307877](https://github.com/wessberg/polyfiller/commit/1307877))
- **polyfill:** adds support for 'globalThis' ([ffb3e0d](https://github.com/wessberg/polyfiller/commit/ffb3e0d))

## [0.0.59](https://github.com/wessberg/polyfiller/compare/v0.0.58...v0.0.59) (2019-02-04)

## [0.0.58](https://github.com/wessberg/polyfiller/compare/v0.0.57...v0.0.58) (2019-02-04)

### Bug Fixes

- **intl:** fixes an issue where Intl.PluralRules would not be polyfilled. ([72db7d3](https://github.com/wessberg/polyfiller/commit/72db7d3))

## [0.0.57](https://github.com/wessberg/polyfiller/compare/v0.0.56...v0.0.57) (2019-01-28)

### Bug Fixes

- **edge:** Bumps dependencies to fix an issue where Edge 16 could report as Edge 18 under some circumstances ([417a3b9](https://github.com/wessberg/polyfiller/commit/417a3b9))

## [0.0.56](https://github.com/wessberg/polyfiller/compare/v0.0.55...v0.0.56) (2019-01-28)

### Bug Fixes

- **edge:** Bumps dependencies to fix an issue where Edge 16 could report as Edge 18 under some circumstances ([aaa2ca6](https://github.com/wessberg/polyfiller/commit/aaa2ca6))

## [0.0.55](https://github.com/wessberg/polyfiller/compare/v0.0.54...v0.0.55) (2019-01-24)

### Bug Fixes

- **safari:** fixes an issue where intersection-observer and web-animations would not apply to Safari v12 (not TP) ([3cd66d0](https://github.com/wessberg/polyfiller/commit/3cd66d0))

## [0.0.54](https://github.com/wessberg/polyfiller/compare/v0.0.53...v0.0.54) (2019-01-24)

### Features

- **polyfill:** made 'animation' an alias for the polyfill 'web-animations' ([7fa03e9](https://github.com/wessberg/polyfiller/commit/7fa03e9))

## [0.0.53](https://github.com/wessberg/polyfiller/compare/v0.0.52...v0.0.53) (2019-01-24)

### Bug Fixes

- **dependencies:** updated Zone.js version to 0.8.29 ([28a1228](https://github.com/wessberg/polyfiller/commit/28a1228))
- **project:** adds Prettier, better release pipeline ([17a6ce2](https://github.com/wessberg/polyfiller/commit/17a6ce2))
- **project:** updated deploy scripts ([a6c6cf4](https://github.com/wessberg/polyfiller/commit/a6c6cf4))
- **project:** updated test scripts ([7bd9e17](https://github.com/wessberg/polyfiller/commit/7bd9e17))

### Features

- **contributing:** adds Prettier formatting to the project ([edc62e6](https://github.com/wessberg/polyfiller/commit/edc62e6))
- **polyfill:** es.set.is-disjoint-with has been renamed to es.set.is-disjoint-from to align with the current spec proposal ([0dfb26e](https://github.com/wessberg/polyfiller/commit/0dfb26e))

## [0.0.52](https://github.com/wessberg/polyfiller/compare/v0.0.51...v0.0.52) (2019-01-18)

## [0.0.51](https://github.com/wessberg/polyfiller/compare/v0.0.50...v0.0.51) (2019-01-18)

### Bug Fixes

- **server:** fixes issue where OPTIONS requests would return METHOD_NOT_ALLOWED ([3d6f950](https://github.com/wessberg/polyfiller/commit/3d6f950))

## [0.0.50](https://github.com/wessberg/polyfiller/compare/v0.0.49...v0.0.50) (2019-01-18)

### Bug Fixes

- **server:** fixes issue where OPTIONS requests would return METHOD_NOT_ALLOWED ([0ebc4ef](https://github.com/wessberg/polyfiller/commit/0ebc4ef))

### Features

- **polyfill:** adds support for the proposed new Set methods: Set.prototype.isDisjointWith, Set.prototype.isSubsetOf, and Set.prototype.isSupersetOf ([90e98d2](https://github.com/wessberg/polyfiller/commit/90e98d2))

## [0.0.49](https://github.com/wessberg/polyfiller/compare/v0.0.48...v0.0.49) (2019-01-15)

### Features

- **polyfill:** adds polyfill for Intl.ListFormat ([1dce148](https://github.com/wessberg/polyfiller/commit/1dce148))

## [0.0.48](https://github.com/wessberg/polyfiller/compare/v0.0.47...v0.0.48) (2019-01-14)

### Features

- **core:** adds support for Intl.RelativeTimeFormat ([749bef9](https://github.com/wessberg/polyfiller/commit/749bef9))
- **polyfill:** Adds support for the scroll-behavior CSS property and extensions to the Element interface via the polyfill name: 'scroll-behavior' ([f5a8957](https://github.com/wessberg/polyfiller/commit/f5a8957))

## [0.0.47](https://github.com/wessberg/polyfiller/compare/v0.0.46...v0.0.47) (2019-01-02)

### Bug Fixes

- **chore:** adds feature detections for Object.fromEntries and Symbol.description, both of which have shipped in some browsers now ([04205ab](https://github.com/wessberg/polyfiller/commit/04205ab))

## [0.0.46](https://github.com/wessberg/polyfiller/compare/v0.0.45...v0.0.46) (2018-12-19)

## [0.0.45](https://github.com/wessberg/polyfiller/compare/v0.0.44...v0.0.45) (2018-12-06)

## [0.0.44](https://github.com/wessberg/polyfiller/compare/v0.0.43...v0.0.44) (2018-12-06)

## [0.0.43](https://github.com/wessberg/polyfiller/compare/v0.0.42...v0.0.43) (2018-11-14)

## [0.0.42](https://github.com/wessberg/polyfiller/compare/v0.0.41...v0.0.42) (2018-11-14)

## [0.0.41](https://github.com/wessberg/polyfiller/compare/v0.0.40...v0.0.41) (2018-11-14)

## [0.0.40](https://github.com/wessberg/polyfiller/compare/v0.0.39...v0.0.40) (2018-10-31)

## [0.0.39](https://github.com/wessberg/polyfiller/compare/v0.0.38...v0.0.39) (2018-10-31)

## [0.0.38](https://github.com/wessberg/polyfiller/compare/v0.0.37...v0.0.38) (2018-10-30)

### Features

- **chore:** Bumped dependencies ([dec27c9](https://github.com/wessberg/polyfiller/commit/dec27c9))

## [0.0.37](https://github.com/wessberg/polyfiller/compare/v0.0.36...v0.0.37) (2018-10-28)

## [0.0.36](https://github.com/wessberg/polyfiller/compare/v0.0.35...v0.0.36) (2018-10-24)

## [0.0.35](https://github.com/wessberg/polyfiller/compare/v0.0.34...v0.0.35) (2018-10-18)

### Features

- a new header, 'x-applied-polyfills' ([50b8010](https://github.com/wessberg/polyfiller/commit/50b8010))

## [0.0.34](https://github.com/wessberg/polyfiller/compare/v0.0.33...v0.0.34) (2018-10-18)

## [0.0.33](https://github.com/wessberg/polyfiller/compare/v0.0.32...v0.0.33) (2018-10-18)

### Bug Fixes

- **chore:** SystemJS depends on Promise and fetch (for package maps) ([9ff236c](https://github.com/wessberg/polyfiller/commit/9ff236c))

## [0.0.32](https://github.com/wessberg/polyfiller/compare/v0.0.31...v0.0.32) (2018-10-18)

### Features

- **SystemJS:** adds support for SystemJS 2.0 ([50ce832](https://github.com/wessberg/polyfiller/commit/50ce832))

## [0.0.31](https://github.com/wessberg/polyfiller/compare/v0.0.30...v0.0.31) (2018-10-08)

### Features

- Added polyfill support for ResizeObserver ([2a6b549](https://github.com/wessberg/polyfiller/commit/2a6b549))
- Added polyfill support for setImmediate ([92ab7eb](https://github.com/wessberg/polyfiller/commit/92ab7eb))

## [0.0.30](https://github.com/wessberg/polyfiller/compare/v0.0.29...v0.0.30) (2018-09-24)

## [0.0.29](https://github.com/wessberg/polyfiller/compare/v0.0.28...v0.0.29) (2018-09-24)

## [0.0.28](https://github.com/wessberg/polyfiller/compare/v0.0.27...v0.0.28) (2018-09-20)

### Features

- Added support for 'requestidlecallback' ([f8df4bb](https://github.com/wessberg/polyfiller/commit/f8df4bb))

## [0.0.27](https://github.com/wessberg/polyfiller/compare/v0.0.26...v0.0.27) (2018-09-09)

## [0.0.26](https://github.com/wessberg/polyfiller/compare/v0.0.25...v0.0.26) (2018-09-09)

## [0.0.25](https://github.com/wessberg/polyfiller/compare/v0.0.24...v0.0.25) (2018-08-30)

## [0.0.24](https://github.com/wessberg/polyfiller/compare/v0.0.23...v0.0.24) (2018-08-30)

## [0.0.23](https://github.com/wessberg/polyfiller/compare/v0.0.22...v0.0.23) (2018-06-21)

## [0.0.22](https://github.com/wessberg/polyfiller/compare/v0.0.21...v0.0.22) (2018-06-15)

## [0.0.21](https://github.com/wessberg/polyfiller/compare/v0.0.20...v0.0.21) (2018-06-15)

## [0.0.20](https://github.com/wessberg/polyfiller/compare/v0.0.19...v0.0.20) (2018-06-13)

## [0.0.19](https://github.com/wessberg/polyfiller/compare/v0.0.18...v0.0.19) (2018-06-13)

## [0.0.18](https://github.com/wessberg/polyfiller/compare/v0.0.17...v0.0.18) (2018-06-12)

## [0.0.17](https://github.com/wessberg/polyfiller/compare/v0.0.16...v0.0.17) (2018-06-12)

## [0.0.16](https://github.com/wessberg/polyfiller/compare/v0.0.15...v0.0.16) (2018-06-12)

## [0.0.15](https://github.com/wessberg/polyfiller/compare/v0.0.14...v0.0.15) (2018-06-12)

## [0.0.14](https://github.com/wessberg/polyfiller/compare/v0.0.13...v0.0.14) (2018-06-12)

## [0.0.13](https://github.com/wessberg/polyfiller/compare/v0.0.12...v0.0.13) (2018-06-12)

## [0.0.12](https://github.com/wessberg/polyfiller/compare/v0.0.11...v0.0.12) (2018-06-12)

## [0.0.11](https://github.com/wessberg/polyfiller/compare/v0.0.10...v0.0.11) (2018-06-12)

## [0.0.10](https://github.com/wessberg/polyfiller/compare/v0.0.9...v0.0.10) (2018-06-07)

## [0.0.9](https://github.com/wessberg/polyfiller/compare/v0.0.8...v0.0.9) (2018-05-28)

## [0.0.8](https://github.com/wessberg/polyfiller/compare/v0.0.7...v0.0.8) (2018-05-24)

## [0.0.7](https://github.com/wessberg/polyfiller/compare/v0.0.6...v0.0.7) (2018-05-19)

## [0.0.6](https://github.com/wessberg/polyfiller/compare/v0.0.5...v0.0.6) (2018-05-19)

## [0.0.5](https://github.com/wessberg/polyfiller/compare/v0.0.4...v0.0.5) (2018-05-19)

## [0.0.4](https://github.com/wessberg/polyfiller/compare/v0.0.3...v0.0.4) (2018-05-19)

## [0.0.3](https://github.com/wessberg/polyfiller/compare/v0.0.2...v0.0.3) (2018-05-18)

## [0.0.2](https://github.com/wessberg/polyfiller/compare/v0.0.1...v0.0.2) (2018-05-18)

## 0.0.1 (2018-05-18)
