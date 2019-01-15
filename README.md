<img alt="Logo for @wessberg/polyfiller" src="https://raw.githubusercontent.com/wessberg/Polyfiller/master/documentation/asset/logo-color-text.png" height="80"></img><br>
<a href="https://npmcharts.com/compare/@wessberg/polyfiller?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fpolyfiller.svg" height="20"></img></a>
<a href="https://david-dm.org/wessberg/polyfiller"><img alt="Dependencies" src="https://img.shields.io/david/wessberg/polyfiller.svg" height="20"></img></a>
<a href="https://www.npmjs.com/package/@wessberg/polyfiller"><img alt="NPM Version" src="https://badge.fury.io/js/%40wessberg%2Fpolyfiller.svg" height="20"></img></a>
<a href="https://github.com/wessberg/polyfiller/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fpolyfiller.svg" height="20"></img></a>
<a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" height="20"></img></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="20"></img></a>

> Never worry about polyfills again.

## Description

This is a web service that returns a minified and encoded bundle of _only_ the polyfills your users need.
It's like [polyfill.io](https://github.com/Financial-Times/polyfill-service), but it has additional polyfills such as [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), and much more.
It is also potentially faster since all unique polyfill combinations are cached in memory and returned immediately as requested.
And, it supports different kinds of encodings for the smallest possible network bandwidth overhead, including [Brotli](https://github.com/google/brotli) and [Gzip](https://en.wikipedia.org/wiki/Gzip).
The web service is hosted and live at `https://polyfill.app/api`. It is **free** to use, and there are no quota limits. See the [Hosting](#hosting) section for details on how to host it yourself, if you want to.

## Usage

Place a `<script>` tag inside your `index.html` file with a `src` pointing at `https://polyfill.app/api/polyfill`.
In the following example, polyfills for `ES2015` and `Shadow DOM` are requested:

```html
<!-- An example of requesting polyfills for an ES2015 environment as well as Shadow DOM support
-->
<script src="https://polyfill.app/api/polyfill?features=es,shadow-dom"></script>
```

A targeted bundle will be returned that **only contains the specific polyfills the browser needs**!
When a browser (or robot) visits your site, `Polyfiller` evaluates the user agent against [Caniuse](http://caniuse.com/) and decides what is supported and what isn't.
It is up to you to decide which polyfills you need, but the web service will automatically make sure to include every dependency of those polyfills, but only if the browser doesn't already support them.

## Examples

### Example 1:

In this example:

- `es` polyfills those EcmaScript features that the browser doesn't support.
- `intersection-observer` is polyfilled, _even if the browser supports it_, because it has the `force` option.
- `intl` is polyfilled, with the inclusion of `Intl.RelativeTimeFormat`, if the browser doesn't support it, and the `en` locale data is included.

```html
<script src="https://polyfill.app/api/polyfill?features=es,intersection-observer|force,intl|locales=en"></script>
```

### Example 2:

This example shows how you can add support for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components):

- `template` polyfills the `HTMLTemplateElement` if the browser doesn't support it.
- `shadow-dom` polyfills the `Shadow DOM` v1 specification if the browser doesn't support it.
- `custom-elements` polyfills the `Custom Elements` v1 specification if the browser doesn't support it.

```html
<script src="https://polyfill.app/api/polyfill?features=template,shadow-dom,custom-elements"></script>
```

For your convenience, the `web-components` alias requests those three features.

```html
<script src="https://polyfill.app/api/polyfill?features=web-components"></script>
```

### Example 3:

For your convenience, a few libraries are included that isn't strictly polyfills but are closely related to compatibility:
In this example:

- `systemjs` Adds the [`SystemJS`](https://github.com/systemjs/systemjs) ES module loader. Useful if you target a browser that doesn't support ES-modules and want to use something like dynamic imports and code-splitting.
- `regenerator-runtime` is added, which is what [babel](https://github.com/babel/) transpiles async functions and generator functions into if you don't target browsers that supports it.

```html
<script src="https://polyfill.app/api/polyfill?features=systemjs,regenerator-runtime"></script>
```

## Web Service API Reference

### `GET /api/polyfill?features=[...features]`

Retrieves a bundle of polyfills.
`Polyfiller` will use the incoming `Accept-Encoding` headers of the request to decide if the response should be `Brotli` encoded, `Gzip` encoded or not encoded at all.

#### Parameter overview

| Parameter  | Description                                                                                                                                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features` | A comma-separated string of all the `feature`s you want to include in your bundle (if required by the browser). Each `feature` may receive zero or more `option`s. Some `option`s are supported for all `feature`s while others only support specific `feature`s. |

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
`intl|locales=en`

#### The `force` option

By default, `feature`s that are already supported by the browser sending the request to the web service _won't_ be polyfilled. That would be a waste of network bandwidth and parsing cost for your users.
_However_, sometimes you may want to _force_ a polyfill, even for browsers that support a `feature`.
In order to do so, associate the `force` option with a `feature`. For example:
`animation|force`
This will force-apply a polyfill for `Web Animations`.

#### The `locales` option for `Intl`

**This option only works with `intl`, `intl.core`, `intl.list-format`, or `intl.relative-time-format`**.
The `Intl` family of polyfills rely on locale data for them to work. There are over 600 different locale files shipped. Sending all of them back over the network would take way too much bandwidth.
Instead, if you just ask for the `intl`, `intl.core`, `intl.list-format`, or `intl.relative-time-format` features, they will be returned without any locale data.

To add one or more locales, use the `locales` option. For example:
`intl|locales=en`

This will return a bundle of `Intl`-related polyfills along with locale data for the `en` (English) language code.
You can ask for as many you want by separating the locales with the `~` operator. For example:
`intl|locales=en~da~fr`
This will return a bundle of `Intl`-related polyfills along with locale data for `en` (English), `da` (Danish), and `fr` (French).

#### The `variant` option for `SystemJS`

SystemJS comes in two base versions, a [minimal version called _s_](https://github.com/systemjs/systemjs#1-sjs-minimal-loader), and a [more feature-complete version called _system_](https://github.com/systemjs/systemjs#2-systemjs-loader).
By default, the _system_ variant will be used. You can decide which one to use with the `variant` option.

For example: `systemjs|variant=s` selects the _s_ variant, while `systemjs|variant=system` selects the _system_ variant.

#### The `error` option for `Zone`

[Zone.js](https://github.com/angular/zone.js/) can be configured to produce more readable Stack traces. If you want this, you can give the `error` option: `zone|error`.

## Install

`Polyfiller` is already hosted at `https://polyfill.app/api` as a **free** web service, but you can install it, for example if
you want to host it yourself. See the [Hosting](#hosting) section for more details on that.

### NPM

```
$ npm install @wessberg/polyfiller
```

### Yarn

```
$ yarn add @wessberg/polyfiller
```

### Run once with NPX

```
$ npx @wessberg/polyfiller
```

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

## Maintainers

- <a href="https://github.com/wessberg"><img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="11"></img></a> [Frederik Wessberg](https://github.com/wessberg): _Maintainer_

## FAQ

### What's the difference from [polyfill.io](https://github.com/Financial-Times/polyfill-service)

These two services are very much alike. In fact, `Polyfiller` depends on the library behind [polyfill.io](https://github.com/Financial-Times/polyfill-service) for some of the polyfills!
`Polyfiller` exists for two reasons:

- A wider range of available polyfills such as Web Components, PointerEvents and Proxies
- Deep integration with `Caniuse`. If you use something like `babel-preset-env` with a `browserslist` and you generate this automatically based on the features you want to support with a tool such as [browserslist-generator](https://www.npmjs.com/package/@wessberg/browserslist-generator), both syntax detection for transpiling, and feature detection for polyfilling will be seamlessly based on your `browserslist`.

### Hosting

`Polyfiller` is already hosted at `https://polyfill.app/api` as a **free** web service, but feel free to host it yourself.
The server is built with support for both HTTP2 and HTTP. The environment variable `HTTP2=[true|false]` decides whether a HTTP2 server will be hosted or not.
If you use a load balancer and something like `nginx` in a reverse proxy setup, please know that `nginx` doesn't support HTTP2 via its proxy module, so you have to use HTTP1.1 there. Thankfully, it is as easy as setting `HTTP2=false` before launching the server

## Logo

All credits go to [Andreas Mehlsen (@andreasbm)](https://github.com/andreasbm/) for the awesome logo design.

## Backers 🏅

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, logo, and link to your site listed here.

## License 📄

MIT © [Frederik Wessberg](https://github.com/wessberg)

### Feature names

Here's a full list of all possible `feature` _names_.
Note that these will be deduplicated. For example, if you request `es.object`, but also request `es`, `es.object` will only be included once as part of `es`.
And, if you request `performance.now`, `date.now` will also be included since the polyfill depends on it. You don't have to worry about dependencies.

- es
- es2015
- es.object
- es.object.assign
- es.object.create
- es.object.define-properties
- es.object.define-property
- es.object.freeze
- es.object.get-own-property-descriptor
- es.object.get-own-property-names
- es.object.get-prototype-of
- es.object.is-extensible
- es.object.is-frozen
- es.object.is-sealed
- es.object.is
- es.object.keys
- es.object.prevent-extensions
- es.object.seal
- es.object.set-prototype-of
- es.object.from-entries
- es.object.to-string
- es.object.define-getter
- es.object.define-setter
- es.object.entries
- es.object.get-own-property-descriptors
- es.object.lookup-getter
- es.object.lookup-setter
- es.object.values
- es.function
- es.function.bind
- es.function.name
- es.array
- es.array.concat
- es.array.flat
- es.array.flat-map
- es.array.last-index
- es.array.last-item
- es.array.copy-within
- es.array.every
- es.array.fill
- es.array.filter
- es.array.find-index
- es.array.find
- es.array.for-each
- es.array.from
- es.array.index-of
- es.array.is-array
- es.array.iterator
- es.array.join
- es.array.last-index-of
- es.array.map
- es.array.of
- es.array.reduce-right
- es.array.reduce
- es.array.slice
- es.array.some
- es.array.sort
- es.array.splice
- es.array.species
- es.array.includes
- es.array-buffer
- es.array-buffer.constructor
- es.array-buffer.is-view
- es.array-buffer.slice
- es.string
- es.string.at
- es.string.code-points
- es.string.match-all
- es.string.replace-all
- es.string.trim-start
- es.string.trim-end
- es.string.anchor
- es.string.big
- es.string.blink
- es.string.bold
- es.string.code-point-at
- es.string.ends-with
- es.string.fixed
- es.string.fontcolor
- es.string.fontsize
- es.string.from-code-point
- es.string.includes
- es.string.italics
- es.string.iterator
- es.string.link
- es.string.match
- es.string.pad-end
- es.string.pad-start
- es.string.raw
- es.string.repeat
- es.string.replace
- es.string.search
- es.string.small
- es.string.split
- es.string.starts-with
- es.string.strike
- es.string.sub
- es.string.sup
- es.string.trim
- es.regexp
- es.regexp.constructor
- es.regexp.flags
- es.regexp.to-string
- es.number
- es.number.constructor
- es.number.epsilon
- es.number.is-finite
- es.number.is-integer
- es.number.is-nan
- es.number.is-safe-integer
- es.number.max-safe-integer
- es.number.min-safe-integer
- es.number.parse-float
- es.number.parse-int
- es.number.to-fixed
- es.number.to-precision
- es.number.from-string
- es.math
- es.map
- es.map.filter
- es.map.from
- es.map.group-by
- es.map.key-by
- es.map.map-keys
- es.map.map-values
- es.map.merge
- es.map.of
- es.weak-map
- es.weak-map.from
- es.weak-map.of
- es.set
- es.set.add-all
- es.set.delete-all
- es.set.difference
- es.set.every
- es.set.filter
- es.set.find
- es.set.from
- es.set.intersection
- es.set.join
- es.set.map
- es.set.of
- es.set.reduce
- es.set.some
- es.set.symmetric-difference
- es.set.union
- es.weak-set
- es.weak-set.from
- es.weak-set.of
- es.math.acosh
- es.math.asinh
- es.math.atanh
- es.math.cbrt
- es.math.clz32
- es.math.cosh
- es.math.expm1
- es.math.fround
- es.math.hypot
- es.math.imul
- es.math.log1p
- es.math.log2
- es.math.log10
- es.math.sign
- es.math.sinh
- es.math.tanh
- es.math.trunc
- es.math.clamp
- es.math.deg-per-rad
- es.math.degrees
- es.math.fscale
- es.math.iaddh
- es.math.imulh
- es.math.isubh
- es.math.rad-per-deg
- es.math.radians
- es.math.scale
- es.math.signbit
- es.math.umulh
- es.data-view
- es.date
- es.date.now
- es.date.to-iso-string
- es.date.to-json
- es.date.to-primitive
- es.date.to-string
- es.promise
- es.promise.finally
- es.promise.constructor
- es.promise.all-settled
- es.promise.try
- es.symbol
- es.symbol.constructor
- es.symbol.async-iterator
- es.symbol.has-instance
- es.symbol.is-concat-spreadable
- es.symbol.iterator
- es.symbol.match
- es.symbol.replace
- es.symbol.search
- es.symbol.species
- es.symbol.split
- es.symbol.to-primitive
- es.symbol.to-string-tag
- es.symbol.unscopables
- es.symbol.description
- es.symbol.pattern-match
- es.collections
- es.typed-array
- es.typed-array.copy-within
- es.typed-array.every
- es.typed-array.fill
- es.typed-array.filter
- es.typed-array.find
- es.typed-array.find-index
- es.typed-array.float32-array
- es.typed-array.float64-array
- es.typed-array.for-each
- es.typed-array.from
- es.typed-array.includes
- es.typed-array.index-of
- es.typed-array.int8-array
- es.typed-array.int16-array
- es.typed-array.int32-array
- es.typed-array.iterator
- es.typed-array.join
- es.typed-array.last-index-of
- es.typed-array.map
- es.typed-array.of
- es.typed-array.reduce
- es.typed-array.reduce-right
- es.typed-array.reverse
- es.typed-array.set
- es.typed-array.slice
- es.typed-array.some
- es.typed-array.sort
- es.typed-array.subarray
- es.typed-array.to-locale-string
- es.typed-array.to-string
- es.typed-array.uint8-array
- es.typed-array.uint8-clamped-array
- es.typed-array.uint16-array
- es.typed-array.uint32-array
- es.reflect
- es.reflect.apply
- es.reflect.construct
- es.reflect.define-property
- es.reflect.delete-property
- es.reflect.get
- es.reflect.get-own-property-descriptor
- es.reflect.get-prototype-of
- es.reflect.has
- es.reflect.is-extensible
- es.reflect.own-keys
- es.reflect.prevent-extensions
- es.reflect.set
- es.reflect.set-prototype-of
- es.reflect.define-metadata
- es.reflect.delete-metadata
- es.reflect.get-metadata
- es.reflect.get-metadata-keys
- es.reflect.get-own-metadata
- es.reflect.get-own-metadata-keys
- es.reflect.has-metadata
- es.reflect.has-own-metadata
- es.reflect.metadata
- esnext
- es2016+
- esnext.array
- esnext.collections
- esnext.math
- esnext.number
- esnext.promise
- esnext.object
- esnext.reflect
- esnext.string
- esnext.symbol
- esnext.map
- esnext.weak-map
- esnext.set
- esnext.weak-set
- regenerator-runtime
- systemjs
- performance.now
- blob
- requestanimationframe
- requestidlecallback
- url
- base64
- xhr
- dom.collections.iterable
- dom.collections.iterator
- dom.collections.for-each
- fetch
- intl
- intl.core
- intl.list-format
- intl.relative-time-format
- animation
- proxy
- event
- pointer-event
- window
- document
- element
- get-computed-style
- node.contains
- node.parentelement
- queryselector
- document-fragment
- intersection-observer
- mutation-observer
- resize-observer
- custom-elements
- shadow-dom
- template
- zone
- class-list
- dom-token-list
- object-fit
- console
- scroll-behavior
