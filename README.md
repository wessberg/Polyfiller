# Polyfiller
[![NPM version][npm-version-image]][npm-version-url]
[![License-mit][license-mit-image]][license-mit-url]

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg

[npm-version-url]: https://www.npmjs.com/package/@wessberg/polyfiller

[npm-version-image]: https://badge.fury.io/js/%40wessberg%2Fpolyfiller.svg
> Never worry about polyfills again.

## Description

This is a web service that returns a minified and encoded bundle of *only* the polyfills your users need.

It's like [polyfill.io](https://github.com/Financial-Times/polyfill-service), but it has additional polyfills such as [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), and much more.
It is also potentially faster since all unique polyfill combinations are cached in memory and returned immediately as requested.
And, it supports different kinds of encodings for the smallest possible network bandwidth overhead, including [Brotli](https://github.com/google/brotli) and [Gzip](https://en.wikipedia.org/wiki/Gzip).

The web service is hosted and live at `https://polyfill.app/api`. It is **free** to use, and there are no quota limits. See the [Hosting](#hosting) section for details on how to host it yourself, if you want to.

## Usage

Place a `<script>` tag inside your `index.html` file with a `src` pointing at `https://polyfill.app/api/polyfill`.
In the following example, polyfills for `ES2015` and `Shadow DOM` are requested:

```html
<!-- An example of requesting polyfills for an ES2015 environment as well as Shadow DOM support -->
<script src="https://polyfill.app/api/polyfill?features=es2015,shadow-dom"></script>
```

A targeted bundle will be returned that **only contains the specific polyfills the browser needs**!
When a browser (or robot) visits your site, `Polyfiller` evaluates the user agent against [Caniuse](http://caniuse.com/) and decides what is supported and what isn't.

It is up to you to decide which polyfills you need, but the web service will automatically make sure to include every dependency of those polyfills, but only if the browser doesn't already support them.

## Examples

### Example 1:

In this example:

- `es2015` is polyfilled if the browser doesn't support it.
- `intersection-observer` is polyfilled, *even if the browser supports it*, because it has the `force` option.
- `intl` is polyfilled if the browser doesn't support it, and the `en` locale data is included.

```html
<script src="https://polyfill.app/api/polyfill?features=es2015,intersection-observer|force,intl|locales=en"></script>
```

### Example 2:

This example shows how you can add support for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components):

- `template` polyfills the `HTMLTemplateElement` if the browser doesn't support it.
- `shadow-dom` polyfills the `Shadow DOM` v1 specification if the browser doesn't support it.
- `custom-elements` polyfills the `Custom Elements` v1 specification if the browser doesn't support it.

```html
<script src="https://polyfill.app/api/polyfill?features=template,shadow-dom,custom-elements"></script>
```

### Example 3:

For your convenience, a few libraries are included that isn't strictly polyfills but are closely related to compatibility:

In this example:

- `systemjs` Adds the [`SystemJS`](https://github.com/systemjs/systemjs) ES module loader. Useful if you target a browser that doesn't support ES-modules and want to use something like dynamic imports and code-splitting.
- `regenerator-runtime` is added, which is what [babel](https://github.com/babel/) transpiles async functions and generator functions into if you don't target browsers that supports it.

```html
<script src="https://polyfill.app/api/polyfill?features=systemjs|regenerator-runtime"></script>
```

## Web Service API Reference

### `GET /api/polyfill?features=[...features]`

Retrieves a bundle of polyfills.
`Polyfiller` will use the incoming `Accept-Encoding` headers of the request to decide if the response should be `Brotli` encoded, `Gzip` encoded or not encoded at all.

<table>
<tr>
	<td><strong>Parameter</strong></td>
	<td><strong>Description</strong></td>
</tr>
<tr>
	<td><code>features</code></td>
	<td>
		A comma-separated string of all the <code>feature</code>s you want to include in your bundle (if required by the browser).
		Each <code>feature</code> may receive zero or more <code>option</code>s. Some <code>option</code>s are supported for all <code>feature</code>s while others only support specific <code>feature</code>s.
		<h4>Example</h4>
		<code>es2015,shadow-dom|force,animation,intl|locales=en</code>
	</td>
</tr>
</table>

#### `feature`

A `feature` has a *name* and may receive zero or more `option`s.

For example, `intl` is a feature name, and so is `custom-elements`.

See the [Feature name](#feature-names) section for the full list of possible `feature` names.

#### `Option`

An `option` is some data associated with a `feature`.
It is associated with a feature using the `|` (pipe) operator.
For example, here's how to associate the `force` option with a `feature`:

`animation|force`.

Some `options` apply to all `feature`s while others only apply to specific polyfills. For example:

`intl|locales=en`

#### The `force` option

By default, `feature`s that are already supported by the browser sending the request to the web service *won't* be polyfilled. That would be a waste of network bandwidth and parsing cost for your users.
*However*, sometimes you may want to *force* a polyfill, even for browsers that support a `feature`.

In order to do so, associate the `force` option with a `feature`. For example:

`animation|force`

This will force-apply a polyfill for `Web Animations`.

#### The `locales` option

**This option only works with `Intl`**.

The `Intl` polyfill relies on locale data for it to work. There are over 600 different locale files shipped with Intl. Sending all of them back over the network would take way too much bandwidth.
Instead, if you just ask for the `intl` feature, the `intl` polyfill will be returned without any locale data.

To add one or more locales, use the `locales` option. For example:

`intl|locales=en`

This will return a bundle of `Intl` along with locale data for the `en` (English) language code.
You can ask for as many you want by separating the locales with the `~` operator. For example:

`intl|locales=en~da~fr`

This will return a bundle of `Intl` along with locale data for `en` (English), `da` (Danish), and `fr` (French).

### Feature names

Here's a full list of all possible `feature` *names*.
Note that if these will be deduplicated. For example, if you request `es2015.object`, but also request `es2015`, `es2015.object` will only be included once as part of `es2015`.

- es2015
- es2015.object
- es2015.object.assign
- es2015.object.create
- es2015.object.define-properties
- es2015.object.define-property
- es2015.object.freeze
- es2015.object.get-own-property-descriptor
- es2015.object.get-own-property-names
- es2015.object.get-prototype-of
- es2015.object.is-extensible
- es2015.object.is-frozen
- es2015.object.is-sealed
- es2015.object.is
- es2015.object.keys
- es2015.object.prevent-extensions
- es2015.object.seal
- es2015.object.set-prototype-of
- es2015.object.to-string
- es2015.function
- es2015.array
- es2015.array.copy-within
- es2015.array.every
- es2015.array.fill
- es2015.array.filter
- es2015.array.find-index
- es2015.array.find
- es2015.array.for-each
- es2015.array.from
- es2015.array.index-of
- es2015.array.is-array
- es2015.array.iterator
- es2015.array.join
- es2015.array.last-index-of
- es2015.array.map
- es2015.array.of
- es2015.array.reduce-right
- es2015.array.reduce
- es2015.array.slice
- es2015.array.some
- es2015.array.sort
- es2015.array.species
- es2015.string
- es2015.regexp
- es2015.number
- es2015.math
- es2015.date
- es2015.date.now
- es2015.date.to-iso-string
- es2015.date.to-json
- es2015.date.to-primitive
- es2015.date.to-string
- es2015.promise
- es2015.symbol
- es2015.collections
- es2015.typedarrays
- es2015.reflect
- es2016+
- es2016+.array
- es2016+.array.includes
- es2016+.collections
- es2016+.math
- es2016+.object
- es2016+.object.define-getter
- es2016+.object.define-setter
- es2016+.object.entries
- es2016+.object.get-own-property-descriptors
- es2016+.object.lookup-getter
- es2016+.object.lookup-setter
- es2016+.object.values
- es2016+.promise
- es2016+.reflect
- es2016+.string
- es2016+.symbol
- regenerator-runtime
- systemjs
- performance.now
- blob
- requestanimationframe
- url
- base64
- xhr
- dom.iterable
- fetch
- intl
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
- custom-elements
- shadow-dom
- template

## Difference from [polyfill.io](https://github.com/Financial-Times/polyfill-service)

These two services are very much alike. In fact, `Polyfiller` depends on the library behind [polyfill.io](https://github.com/Financial-Times/polyfill-service) for some of the polyfills!

`Polyfiller` exists for two reasons:

- A wider range of available polyfills such as Web Components, PointerEvents and Proxies
- Deep integration with `Caniuse`. If you use something like `babel-preset-env` with a `browserslist` and you generate this automatically based on the features you want to support with a tool such as [browserslist-generator](https://www.npmjs.com/package/@wessberg/browserslist-generator), both syntax detection for transpiling, and feature detection for polyfilling will be seamlessly based on your `browserslist`.

## Hosting

`Polyfiller` is already hosted at `https://polyfill.app/api` as a **free** web service, but feel free to host it yourself.
The server is built with support for both HTTP2 and HTTP. The environment variable `HTTP2=[true|false]` decides whether a HTTP2 server will be hosted or not.

If you use a load balancer and something like `nginx` in a reverse proxy setup, please know that `nginx` doesn't support HTTP2 via its proxy module, so you have to use HTTP1.1 there. Thankfully, it is as easy as setting `HTTP2=false` before launching the server