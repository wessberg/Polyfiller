<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/Polyfiller/master/documentation/asset/logo-color-text.png" height="80"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> Never worry about polyfills again.

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/%40wessberg%2Fpolyfiller?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fpolyfiller.svg"    /></a>
<a href="https://www.npmjs.com/package/%40wessberg%2Fpolyfiller"><img alt="NPM version" src="https://badge.fury.io/js/%40wessberg%2Fpolyfiller.svg"    /></a>
<a href="https://david-dm.org/wessberg/polyfiller"><img alt="Dependencies" src="https://img.shields.io/david/wessberg%2Fpolyfiller.svg"    /></a>
<a href="https://github.com/wessberg/polyfiller/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fpolyfiller.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

This is a web service that returns a minified and encoded bundle of _only_ the polyfills your users need.
It's like [polyfill.io](https://github.com/Financial-Times/polyfill-service), but it has additional polyfills such as [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), and much more.
It is also potentially faster since all unique polyfill combinations are cached in memory and returned immediately as requested.
And, it supports different kinds of encodings for the smallest possible network bandwidth overhead, including [Brotli](https://github.com/google/brotli) and [Gzip](https://en.wikipedia.org/wiki/Gzip).
The web service is hosted and live at `https://polyfill.app/api`. It is **free** to use, and there are no quota limits. See the [Hosting](#hosting) section for details on how to host it yourself, if you want to.

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

- Sends only the polyfills your users actually need
- Wide range of polyfills for modern technologies such as [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), [Intl (including `RelativeTimeFormat` and `ListFormat`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl), and much more.
- Automatic deduplication and insertion of missing dependencies of requested polyfills
- Supports multiple environments, including Browsers, Workers, and even Node.
- Brotli and Gzip compression
- Intelligent disk- and memory caching for maximum speed and availability
- Completely free

<!-- SHADOW_SECTION_FEATURE_IMAGE_START -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_END -->

## Supporters

Polyfiller is kindly supported by and relies heavily on [BrowserStack](https://www.browserstack.com) for cross-browser testing to ensure maximum cross-browser compatibility.

<a href="https://www.browserstack.com"><img alt="BrowserStack" src="https://raw.githubusercontent.com/wessberg/Polyfiller/master/documentation/asset/browserstack.png" height="60" /></a>

Polyfiller is kindly supported by [JetBrains](https://www.jetbrains.com/?from=Polyfiller) for software development tools:

<a href="https://www.jetbrains.com/?from=Polyfiller"><img alt="Supported by JetBrains" src="https://raw.githubusercontent.com/wessberg/Polyfiller/master/documentation/asset/jetbrains.png" height="150" /></a>

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

[Become a sponsor/backer](https://github.com/wessberg/polyfiller?sponsor=1) and get your logo listed here.

| <a href="https://usebubbles.com"><img alt="Bubbles" src="https://uploads-ssl.webflow.com/5d682047c28b217055606673/5e5360be16879c1d0dca6514_icon-thin-128x128%402x.png" height="70"   /></a> | <a href="https://github.com/cblanc"><img alt="Christopher Blanchard" src="https://avatars0.githubusercontent.com/u/2160685?s=400&v=4" height="70"   /></a> | <a href="https://github.com/ideal-postcodes"><img alt="Ideal Postcodes" src="https://avatars.githubusercontent.com/u/4996310?s=200&v=4" height="70"   /></a> | <a href="https://www.xerox.com"><img alt="Xerox" src="https://avatars.githubusercontent.com/u/9158512?s=200&v=4" height="70"   /></a> |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [Bubbles](https://usebubbles.com)<br><strong>Twitter</strong>: [@usebubbles](https://twitter.com/usebubbles)                                                                                | [Christopher Blanchard](https://github.com/cblanc)                                                                                                         | [Ideal Postcodes](https://github.com/ideal-postcodes)                                                                                                        | [Xerox](https://www.xerox.com)                                                                                                        |

### Patreon

<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Patrons on Patreon" src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dwessberg%26type%3Dpatrons"  width="200"  /></a>

<!-- SHADOW_SECTION_BACKERS_END -->

<!-- SHADOW_SECTION_TOC_START -->

## Table of Contents

- [Description](#description)
  - [Features](#features)
- [Supporters](#supporters)
- [Backers](#backers)
  - [Patreon](#patreon)
- [Table of Contents](#table-of-contents)
- [Install](#install)
  - [npm](#npm)
  - [Yarn](#yarn)
  - [pnpm](#pnpm)
- [Usage](#usage)
  - [Usage in a Browser](#usage-in-a-browser)
- [Examples](#examples)
  - [Example 1:](#example-1)
  - [Example 2:](#example-2)
  - [Example 3:](#example-3)
- [Web Service API Reference](#web-service-api-reference)
  - [`GET /api/polyfill?features=[...features]`](#get-apipolyfillfeaturesfeatures)
    - [Parameter overview](#parameter-overview)
    - [`feature`](#feature)
    - [`Option`](#option)
    - [The `force` option](#the-force-option)
    - [The `locale` option for `Intl`](#the-locale-option-for-intl)
    - [The `variant` option for `SystemJS`](#the-variant-option-for-systemjs)
    - [Extra options for `Zone`](#extra-options-for-zone)
    - [Extra options for `shadow-dom`](#extra-options-for-shadow-dom)
  - [Usage in a Web Worker/Service Worker](#usage-in-a-web-workerservice-worker)
  - [Usage in Node](#usage-in-node)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [FAQ](#faq)
  - [What's the difference from polyfill.io](#whats-the-difference-from-polyfillio)
  - [Hosting](#hosting)
- [Logo](#logo)
- [License](#license)
  - [Feature names](#feature-names)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### npm

```
$ npm install @wessberg/polyfiller
```

### Yarn

```
$ yarn add @wessberg/polyfiller
```

### pnpm

```
$ pnpm add @wessberg/polyfiller
```

<!-- SHADOW_SECTION_INSTALL_END -->

`Polyfiller` is already hosted at `https://polyfill.app/api` as a **free** web service, but you can install it, for example if
you want to host it yourself. See the [Hosting](#hosting) section for more details on that.

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

`Polyfiller` can be used both in a _Browser_, _Worker_, and _Node_ environment. By default, the assumed environment is _Browser_.

### Usage in a Browser

Place a `<script>` tag inside your `index.html` file with a `src` pointing at `https://polyfill.app/api/polyfill`.
In the following example, polyfills for `ES2015` and `Shadow DOM` are requested:

```html
<!-- An example of requesting polyfills for an ES2015 environment as well as Web Component support
-->
<script crossorigin src="https://polyfill.app/api/polyfill?features=es,web-components"></script>
```

A targeted bundle will be returned that **only contains the specific polyfills the browser needs**!
When a browser (or robot) visits your site, `Polyfiller` evaluates the user agent against [Caniuse](http://caniuse.com/) and decides what is supported and what isn't.
It is up to you to decide which polyfills you need, but the web service will automatically make sure to include every dependency of those polyfills, but only if the browser doesn't already support them.
See [this](#usage-in-a-web-workerservice-worker) or [this](#usage-in-node) section for details on how to use `Polyfiller` from Web Workers/ServiceWorkers and Node.

You can provide options to Polyfiller via query parameters such as `minify` and `sourcemap` to adjust the received payload to your liking.

## Examples

### Example 1:

In this example:

- `es` polyfills those EcmaScript features that the browser doesn't support.
- `intersection-observer` is polyfilled, _even if the browser supports it_, because it has the `force` option.
- `intl` is polyfilled, with the inclusion of `Intl.ListFormat` and `Intl.RelativeTimeFormat`, if the browser doesn't support it, and the `en` locale data is included.
- Sourcemaps are generated, and the bundle is minified

```html
<script crossorigin src="https://polyfill.app/api/polyfill?minify&sourcemap&features=es,intersection-observer|force,intl|locale=en"></script>
```

### Example 2:

This example shows how you can add support for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components):

- `template` polyfills the `HTMLTemplateElement` if the browser doesn't support it.
- `shadow-dom` polyfills the `Shadow DOM` v1 specification if the browser doesn't support it.
- `custom-elements` polyfills the `Custom Elements` v1 specification if the browser doesn't support it.

```html
<script crossorigin src="https://polyfill.app/api/polyfill?features=template,shadow-dom,custom-elements"></script>
```

For your convenience, the `web-components` alias requests those three features.

```html
<script crossorigin src="https://polyfill.app/api/polyfill?features=web-components"></script>
```

### Example 3:

For your convenience, a few libraries are included that isn't strictly polyfills but are closely related to compatibility:
In this example:

- `systemjs` Adds the [`SystemJS`](https://github.com/systemjs/systemjs) ES module loader. Useful if you target a browser that doesn't support ES-modules and want to use something like dynamic imports and code-splitting.
- `regenerator-runtime` is added, which is what [babel](https://github.com/babel/) transpiles async functions and generator functions into if you don't target browsers that supports it.

```html
<script crossorigin src="https://polyfill.app/api/polyfill?features=systemjs,regenerator-runtime"></script>
```

## Web Service API Reference

### `GET /api/polyfill?features=[...features]`

Retrieves a bundle of polyfills.
`Polyfiller` will use the incoming `Accept-Encoding` headers of the request to decide if the response should be `Brotli` encoded, `Gzip` encoded or not encoded at all.

#### Parameter overview

| Parameter   | Description                                                                                                                                                                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features`  | A comma-separated string of all the `feature`s you want to include in your bundle (if required by the browser). Each `feature` may receive zero or more `option`s. Some `option`s are supported for all `feature`s while others only support specific `feature`s. |
| `context`   | Can be either `window`, `worker`, or `node`. Use this to instruct `Polyfiller` to optimize polyfills for the given environment, as well as to exclude polyfills that doesn't support the given context.                                                           |
| `sourcemap` | If given, or if it has a value of `true`, `Polyfiller` will be instructed to generate SourceMaps. Use this in development for better stack traces.                                                                                                                |
| `minify`    | If given, `Polyfiller` will send back a minified Polyfill bundle.                                                                                                                                                                                                 |

#### `feature`

A `feature` has a _name_ and may receive zero or more `option`s.
For example, `intl` is a feature name, and so is `custom-elements`.
See the [Feature name](#feature-names) section for the full list of possible `feature` names.

#### `Option`

An `option` is some data associated with a `feature`.
It is associated with a feature using the `|` (pipe) operator.
For example, here's how to associate the `force` option with a `feature`:
`animation|force`.

Some `option`s apply to all `feature`s while others only apply to specific `feature`s. For example:
`intl|locale=en`

#### The `force` option

By default, `feature`s that are already supported by the browser sending the request to the web service _won't_ be polyfilled. That would be a waste of network bandwidth and parsing cost for your users.
_However_, sometimes you may want to _force_ a polyfill, even for browsers that support a `feature`.
In order to do so, associate the `force` option with a `feature`. For example:
`animation|force`
This will force-apply a polyfill for `Web Animations`.

#### The `locale` option for `Intl`

**This option only works with `intl`, `intl.core`, `intl.list-format`, or `intl.relative-time-format`**.
The `Intl` family of polyfills rely on locale data for them to work. There are over 600 different locale files shipped. Sending all of them back over the network would take way too much bandwidth.
Instead, if you just ask for the `intl`, `intl.core`, `intl.list-format`, or `intl.relative-time-format` features, they will be returned without any locale data.

To add one or more locales, use the `locale` option. For example:
`intl|locale=en`

This will return a bundle of `Intl`-related polyfills along with locale data for the `en` (English) language code.
You can ask for as many you want by separating the locales with the `~` operator. For example:
`intl|locale=en~da~fr`
This will return a bundle of `Intl`-related polyfills along with locale data for `en` (English), `da` (Danish), and `fr` (French).

#### The `variant` option for `SystemJS`

SystemJS comes in two base versions, a [minimal version called _s_](https://github.com/systemjs/systemjs#1-sjs-minimal-loader), and a [more feature-complete version called _system_](https://github.com/systemjs/systemjs#2-systemjs-loader).
By default, the _system_ variant will be used. You can decide which one to use with the `variant` option.

For example: `systemjs|variant=s` selects the _s_ variant, while `systemjs|variant=system` selects the _system_ variant.

#### Extra options for `Zone`

[Zone.js](https://github.com/angular/zone.js/), which is supported by Polyfiller, can be configured with some extra options to enhance its operation or support interoperability with more APIs:

| Option           | Description                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `error`          | Generates more readable Stack traces when using Zone                                               |
| `shadydom`       | Makes Zone compatible with the ShadyDOM polyfill.                                                  |
| `mediaquery`     | Patches the [Media Query API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)  |
| `fetch`          | Patches the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).               |
| `resizeobserver` | Patches the [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). |

#### Extra options for `shadow-dom`

You can pass the `experimental` option to `shadow-dom` (or any of its aliases such as `web-components`) to base it on some experimental features that may reduce bugs in older browsers such as IE and Edge <= 15.

### Usage in a Web Worker/Service Worker

You can also request polyfills from a Worker. It is highly recommended that you pass in the [`context`](#the-context-option) query parameter with a value of `worker` to instruct `Polyfiller` to optimize polyfills for a Worker environment, as well as to
not include any polyfills that won't work in a Worker environment.

```typescript
// Provide a context query parameter with a value of 'worker' to avoid polyfills that doesn't support that environment
importScripts("https://polyfill.app/api/polyfill?features=es,intl,web-animations&context=worker");
```

### Usage in Node

You can also request polyfills from Node, if that's a thing you want to do. It is highly recommended that you pass in the [`context`](#parameter-overview) query parameter with a value of `node` to instruct `Polyfiller` to optimize polyfills for a Node environment, as well as to
not include any polyfills that won't work in a Node environment.

```typescript
// Could be anything, but let's use fetch for this example
const fetch = require("node-fetch");

(async () => {
	// Remember to provide a user agent header if you want anything meaningful back
	const response = await fetch("https://polyfill.app/api/polyfill?features=intl&context=node");
	const text = await response.text();
	// Apply the polyfills
	new Function(text)();
})();
```

<!-- SHADOW_SECTION_CONTRIBUTING_START -->

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

<!-- SHADOW_SECTION_CONTRIBUTING_END -->

<!-- SHADOW_SECTION_MAINTAINERS_START -->

## Maintainers

| <a href="mailto:frederikwessberg@hotmail.com"><img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="70"   /></a>                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Frederik Wessberg](mailto:frederikwessberg@hotmail.com)<br><strong>Twitter</strong>: [@FredWessberg](https://twitter.com/FredWessberg)<br><strong>Github</strong>: [@wessberg](https://github.com/wessberg)<br>_Lead Developer_ |

<!-- SHADOW_SECTION_MAINTAINERS_END -->

<!-- SHADOW_SECTION_FAQ_START -->

## FAQ

<!-- SHADOW_SECTION_FAQ_END -->

### What's the difference from polyfill.io

These two services are very much alike. In fact, `Polyfiller` depends on the library behind [polyfill.io](https://github.com/Financial-Times/polyfill-service) for some of the polyfills!
`Polyfiller` exists for two reasons:

- A wider range of available polyfills such as Web Components, PointerEvents and Proxies
- Deep integration with `Caniuse`. If you use something like `babel-preset-env` with a `browserslist` and you generate this automatically based on the features you want to support with a tool such as [browserslist-generator](https://www.npmjs.com/package/@wessberg/browserslist-generator), both syntax detection for transpiling, and feature detection for polyfilling will be seamlessly based on your `browserslist`.

### Hosting

`Polyfiller` is already hosted at `https://polyfill.app/api` as a **free** web service, but feel free to host it yourself.
The server is built with support for both HTTP2 and HTTP. The environment variable `HTTP2=[true|false]` decides whether a HTTP2 server will be hosted or not.
If you use a load balancer and something like `nginx` in a reverse proxy setup, please know that `nginx` doesn't support HTTP2 via its proxy module, so you have to use HTTP1.1 there. Thankfully, it is as easy as setting `HTTP2=false` before launching the server and setting `HTTPS=false`.

## Logo

All credits go to [Andreas Mehlsen (@andreasbm)](https://github.com/andreasbm/) for the awesome logo design.

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT © [Frederik Wessberg](mailto:frederikwessberg@hotmail.com) ([@FredWessberg](https://twitter.com/FredWessberg)) ([Website](https://github.com/wessberg))

<!-- SHADOW_SECTION_LICENSE_END -->

### Feature names

Here's a full list of all possible `feature` _names_.
Note that these will be deduplicated. For example, if you request `es.object`, but also request `es`, `es.object` will only be included once as part of `es`.
And, if you request `performance.now`, `date.now` will also be included since the polyfill depends on it. You don't have to worry about dependencies.

**Bold**-formatted polyfills are _aliases_ for one or several other related `feature`s.

- **`formdata`**
  - `form-data`
- **`requestidlecallback`**
  - `request-idle-callback`
- **`requestanimationframe`**
  - `request-animation-frame`
- **`es`**
  - `es.promise`
  - `es.object`
  - `es.function`
  - `es.array`
  - `es.array-buffer`
  - `es.string`
  - `es.data-view`
  - `es.regexp`
  - `es.number`
  - `es.math`
  - `es.date`
  - `es.symbol`
  - `es.collections`
  - `es.typed-array`
  - `es.reflect`
- **`es2015`**
  - `es`
- **`es.promise`**
  - `es.promise.constructor`
  - `es.promise.any`
  - `es.promise.all-settled`
  - `es.promise.finally`
- **`es.object`**
  - `es.object.assign`
  - `es.object.create`
  - `es.object.define-getter`
  - `es.object.define-setter`
  - `es.object.entries`
  - `es.object.from-entries`
  - `es.object.get-own-property-descriptors`
  - `es.object.lookup-getter`
  - `es.object.lookup-setter`
  - `es.object.values`
  - `es.object.define-properties`
  - `es.object.define-property`
  - `es.object.freeze`
  - `es.object.get-own-property-descriptor`
  - `es.object.get-own-property-names`
  - `es.object.get-prototype-of`
  - `es.object.is-extensible`
  - `es.object.is-frozen`
  - `es.object.is-sealed`
  - `es.object.is`
  - `es.object.keys`
  - `es.object.prevent-extensions`
  - `es.object.seal`
  - `es.object.set-prototype-of`
  - `es.object.to-string`
- **`es.function`**
  - `es.function.bind`
  - `es.function.name`
- **`es.array`**
  - `es.array.concat`
  - `es.array.copy-within`
  - `es.array.every`
  - `es.array.flat`
  - `es.array.flat-map`
  - `es.array.fill`
  - `es.array.filter`
  - `es.array.find`
  - `es.array.find-index`
  - `es.array.for-each`
  - `es.array.from`
  - `es.array.includes`
  - `es.array.index-of`
  - `es.array.is-array`
  - `es.array.iterator`
  - `es.array.join`
  - `es.array.last-index-of`
  - `es.array.map`
  - `es.array.of`
  - `es.array.reduce`
  - `es.array.reduce-right`
  - `es.array.slice`
  - `es.array.some`
  - `es.array.sort`
  - `es.array.species`
  - `es.array.splice`
- **`es.array-buffer`**
  - `es.array-buffer.constructor`
  - `es.array-buffer.is-view`
  - `es.array-buffer.slice`
- **`es.string`**
  - `es.string.anchor`
  - `es.string.big`
  - `es.string.blink`
  - `es.string.bold`
  - `es.string.code-point-at`
  - `es.string.ends-with`
  - `es.string.fixed`
  - `es.string.fontcolor`
  - `es.string.fontsize`
  - `es.string.from-code-point`
  - `es.string.includes`
  - `es.string.italics`
  - `es.string.iterator`
  - `es.string.link`
  - `es.string.match`
  - `es.string.pad-end`
  - `es.string.pad-start`
  - `es.string.raw`
  - `es.string.repeat`
  - `es.string.search`
  - `es.string.small`
  - `es.string.split`
  - `es.string.starts-with`
  - `es.string.strike`
  - `es.string.sub`
  - `es.string.sup`
  - `es.string.trim`
  - `es.string.trim-start`
  - `es.string.trim-end`
  - `es.string.replace-all`
- **`es.regexp`**
  - `es.regexp.constructor`
  - `es.regexp.flags`
  - `es.regexp.to-string`
- **`es.number`**
  - `es.number.constructor`
  - `es.number.epsilon`
  - `es.number.is-finite`
  - `es.number.is-integer`
  - `es.number.is-nan`
  - `es.number.is-safe-integer`
  - `es.number.max-safe-integer`
  - `es.number.min-safe-integer`
  - `es.number.parse-float`
  - `es.number.parse-int`
  - `es.number.to-fixed`
  - `es.number.to-precision`
- **`es.math`**
  - `es.math.acosh`
  - `es.math.asinh`
  - `es.math.atanh`
  - `es.math.cbrt`
  - `es.math.clz32`
  - `es.math.cosh`
  - `es.math.expm1`
  - `es.math.fround`
  - `es.math.hypot`
  - `es.math.imul`
  - `es.math.log1p`
  - `es.math.log2`
  - `es.math.log10`
  - `es.math.sign`
  - `es.math.sinh`
  - `es.math.tanh`
  - `es.math.trunc`
- **`es.date`**
  - `es.date.now`
  - `es.date.to-iso-string`
  - `es.date.to-json`
  - `es.date.to-primitive`
  - `es.date.to-string`
- **`es.symbol`**
  - `es.symbol.async-iterator`
  - `es.symbol.has-instance`
  - `es.symbol.is-concat-spreadable`
  - `es.symbol.iterator`
  - `es.symbol.constructor`
  - `es.symbol.match`
  - `es.symbol.match-all`
  - `es.symbol.replace`
  - `es.symbol.search`
  - `es.symbol.species`
  - `es.symbol.split`
  - `es.symbol.to-primitive`
  - `es.symbol.to-string-tag`
  - `es.symbol.unscopables`
  - `es.symbol.description`
- **`es.collections`**
  - `es.map`
  - `es.weak-map`
  - `es.set`
  - `es.weak-set`
- **`es.typed-array`**
  - `es.typed-array.copy-within`
  - `es.typed-array.every`
  - `es.typed-array.fill`
  - `es.typed-array.filter`
  - `es.typed-array.find`
  - `es.typed-array.find-index`
  - `es.typed-array.float32-array`
  - `es.typed-array.float64-array`
  - `es.typed-array.for-each`
  - `es.typed-array.from`
  - `es.typed-array.includes`
  - `es.typed-array.index-of`
  - `es.typed-array.int8-array`
  - `es.typed-array.int16-array`
  - `es.typed-array.int32-array`
  - `es.typed-array.iterator`
  - `es.typed-array.join`
  - `es.typed-array.last-index-of`
  - `es.typed-array.map`
  - `es.typed-array.of`
  - `es.typed-array.reduce`
  - `es.typed-array.reduce-right`
  - `es.typed-array.reverse`
  - `es.typed-array.set`
  - `es.typed-array.slice`
  - `es.typed-array.some`
  - `es.typed-array.sort`
  - `es.typed-array.subarray`
  - `es.typed-array.to-locale-string`
  - `es.typed-array.to-string`
  - `es.typed-array.uint8-array`
  - `es.typed-array.uint8-clamped-array`
  - `es.typed-array.uint16-array`
  - `es.typed-array.uint32-array`
- **`es.reflect`**
  - `es.reflect.apply`
  - `es.reflect.construct`
  - `es.reflect.define-property`
  - `es.reflect.delete-property`
  - `es.reflect.get`
  - `es.reflect.get-own-property-descriptor`
  - `es.reflect.get-prototype-of`
  - `es.reflect.has`
  - `es.reflect.is-extensible`
  - `es.reflect.own-keys`
  - `es.reflect.prevent-extensions`
  - `es.reflect.set`
  - `es.reflect.set-prototype-of`
- **`esnext`**
  - `esnext.array`
  - `esnext.collections`
  - `esnext.math`
  - `esnext.number`
  - `esnext.object`
  - `esnext.promise`
  - `esnext.reflect`
  - `esnext.string`
  - `esnext.symbol`
- **`es2016+`**
  - `esnext`
- **`esnext.array`**
  - `es.array.last-index`
  - `es.array.last-item`
- **`esnext.object`**
- **`esnext.collections`**
  - `esnext.map`
  - `esnext.weak-map`
  - `esnext.set`
  - `esnext.weak-set`
- **`esnext.map`**
  - `es.map.every`
  - `es.map.filter`
  - `es.map.find`
  - `es.map.find-key`
  - `es.map.from`
  - `es.map.group-by`
  - `es.map.includes`
  - `es.map.key-by`
  - `es.map.key-of`
  - `es.map.map-keys`
  - `es.map.map-values`
  - `es.map.merge`
  - `es.map.of`
  - `es.map.reduce`
  - `es.map.some`
  - `es.map.update`
  - `es.map.emplace`
- **`esnext.weak-map`**
  - `es.weak-map.from`
  - `es.weak-map.of`
- **`esnext.set`**
  - `es.set.add-all`
  - `es.set.delete-all`
  - `es.set.difference`
  - `es.set.every`
  - `es.set.filter`
  - `es.set.find`
  - `es.set.from`
  - `es.set.intersection`
  - `es.set.join`
  - `es.set.map`
  - `es.set.of`
  - `es.set.reduce`
  - `es.set.some`
  - `es.set.symmetric-difference`
  - `es.set.union`
  - `es.set.is-disjoint-from`
  - `es.set.is-subset-of`
  - `es.set.is-superset-of`
- **`esnext.weak-set`**
  - `es.weak-set.from`
  - `es.weak-set.of`
- **`esnext.math`**
  - `es.math.clamp`
  - `es.math.deg-per-rad`
  - `es.math.degrees`
  - `es.math.fscale`
  - `es.math.iaddh`
  - `es.math.imulh`
  - `es.math.isubh`
  - `es.math.rad-per-deg`
  - `es.math.radians`
  - `es.math.scale`
  - `es.math.signbit`
  - `es.math.umulh`
- **`esnext.number`**
  - `es.number.from-string`
- **`esnext.promise`**
  - `es.promise.try`
- **`esnext.reflect`**
  - `es.reflect.define-metadata`
  - `es.reflect.delete-metadata`
  - `es.reflect.get-metadata`
  - `es.reflect.get-metadata-keys`
  - `es.reflect.get-own-metadata`
  - `es.reflect.get-own-metadata-keys`
  - `es.reflect.has-metadata`
  - `es.reflect.has-own-metadata`
  - `es.reflect.metadata`
- **`esnext.string`**
  - `es.string.at`
  - `es.string.code-points`
  - `es.string.match-all`
- **`esnext.symbol`**
  - `es.symbol.pattern-match`
- **`dom.collections.iterable`**
  - `dom.collections.iterator`
  - `dom.collections.for-each`
- **`intl`**
  - `intl.date-time-format`
  - `intl.display-names`
  - `intl.get-canonical-locales`
  - `intl.list-format`
  - `intl.locale`
  - `intl.number-format`
  - `intl.plural-rules`
  - `intl.relative-time-format`
- **`animation`**
  - `web-animations`
- **`web-components`**
  - `custom-elements`
  - `shadow-dom`
  - `template`
- **`event`**
  - `event.constructor`
  - `event.focusin`
  - `event.hashchange`
- **`setimmediate`**
  - `set-immediate`
- **`globalthis`**
  - `global-this`
- **`adopted-style-sheets`**
  - `constructable-style-sheets`
- `systemjs`
- `zone`
- `performance.now`
- `url`
- `object-fit`
- `console`
- `base64`
- `blob`
- `proxy`
- `es.string.replace`
- `pointer-event`
- `xhr`
- `fetch`
- `regenerator-runtime`
- `queryselector`
- `document-fragment`
- `node.parentelement`
- `scroll-behavior`
- `focus-visible`
- `node.contains`
- `window`
- `document`
- `class-list`
- `dom-token-list`
- `element`
- `custom-event`
- `event-source`
- `get-computed-style`
- `intersection-observer`
- `mutation-observer`
- `resize-observer`
- `broadcast-channel`
- `proto`
