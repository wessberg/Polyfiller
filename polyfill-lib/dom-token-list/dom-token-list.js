/*
Copyright (c) 2016, John Gardner

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
const _DOMTokenList = (function () {
	// eslint-disable-line no-unused-vars
	let dpSupport = true;
	const defineGetter = function (object, name, fn, configurable) {
		if (Object.defineProperty)
			Object.defineProperty(object, name, {
				configurable: false === dpSupport ? true : !!configurable,
				get: fn
			});
		else object.__defineGetter__(name, fn);
	};

	/** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
	try {
		defineGetter({}, "support");
	} catch (e) {
		dpSupport = false;
	}

	return function (el, prop) {
		const that = this;
		let tokens = [];
		let tokenMap = {};
		let length = 0;
		let maxLength = 0;
		const addIndexGetter = function (i) {
			defineGetter(
				that,
				i,
				function () {
					preop();
					return tokens[i];
				},
				false
			);
		};
		const reindex = function () {
			/** Define getter functions for array-like access to the tokenList's contents. */
			if (length >= maxLength)
				for (; maxLength < length; ++maxLength) {
					addIndexGetter(maxLength);
				}
		};

		/** Helper function called at the start of each class method. Internal use only. */
		var preop = function () {
			let error;
			let i;
			const args = arguments;
			const rSpace = /\s+/;

			/** Validate the token/s passed to an instance method, if any. */
			if (args.length)
				for (i = 0; i < args.length; ++i)
					if (rSpace.test(args[i])) {
						error = new SyntaxError('String "' + args[i] + '" ' + "contains" + " an invalid character");
						error.code = 5;
						error.name = "InvalidCharacterError";
						throw error;
					}

			/** Split the new value apart by whitespace*/
			if (typeof el[prop] === "object") {
				tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
			} else {
				tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
			}

			/** Avoid treating blank strings as single-item token lists */
			if ("" === tokens[0]) tokens = [];

			/** Repopulate the internal token lists */
			tokenMap = {};
			for (i = 0; i < tokens.length; ++i) tokenMap[tokens[i]] = true;
			length = tokens.length;
			reindex();
		};

		/** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
		preop();

		/** Return the number of tokens in the underlying string. Read-only. */
		defineGetter(that, "length", function () {
			preop();
			return length;
		});

		/** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
		that.toLocaleString = that.toString = function () {
			preop();
			return tokens.join(" ");
		};

		that.item = function (idx) {
			preop();
			return tokens[idx];
		};

		that.contains = function (token) {
			preop();
			return !!tokenMap[token];
		};

		that.replace = function (token, newToken) {
			let i;
			const tokenString = "" + token,
				newTokenString = "" + newToken;

			try {
				new DOMException();
			} catch (e) {
				window.DOMException = function (message, name) {
					if (!(this instanceof DOMException)) return new DOMException(message, name);
					this.message = message;
					this.name = name;
				};
			}

			let error;
			if (!(tokenString && newTokenString)) error = "SyntaxError";
			if (!error && (/\s/.test(tokenString) || /\s/.test(newTokenString))) error = "InvalidCharacterError";
			if (error) throw new DOMException("DOMTokenList.replace was provided tokens '" + tokenString + "' and '" + newTokenString + "'", error);

			if (!this.contains(tokenString)) return false;

			// tokensTobeMoved are "tokenString" and all tokens found after it
			const tokensTobeMoved = [];
			let newTokenFound = false;
			for (i = 0; i < this.length; ++i)
				if (newTokenString === that.item(i)) newTokenFound = true;
				else if (tokenString === that.item(i)) break;
			for (; i < this.length; ++i) tokensTobeMoved.push(that.item(i));
			for (i = 0; i < tokensTobeMoved.length; ++i) {
				const currentToken = tokensTobeMoved[i];
				currentToken !== newTokenString && that.remove(currentToken);
				currentToken !== tokenString && that.add(currentToken);
				currentToken === tokenString && !newTokenFound && (that.remove(newTokenString), that.add(newTokenString));
			}
			return true;
		};

		that.add = function () {
			preop.apply(that, (args = arguments));

			for (var args, token, i = 0, l = args.length; i < l; ++i) {
				token = args[i];
				if (!tokenMap[token]) {
					tokens.push(token);
					tokenMap[token] = true;
				}
			}

			/** Update the targeted attribute of the attached element if the token list's changed. */
			if (length !== tokens.length) {
				length = tokens.length >>> 0;
				if (typeof el[prop] === "object") {
					el[prop].baseVal = tokens.join(" ");
				} else {
					el[prop] = tokens.join(" ");
				}
				reindex();
			}
		};

		that.remove = function () {
			preop.apply(that, (args = arguments));

			/** Build a hash of token names to compare against when recollecting our token list. */
			for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
				ignore[args[i]] = true;
				delete tokenMap[args[i]];
			}

			/** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
			for (i = 0; i < tokens.length; ++i) if (!ignore[tokens[i]]) t.push(tokens[i]);

			tokens = t;
			length = t.length >>> 0;

			/** Update the targeted attribute of the attached element. */
			if (typeof el[prop] === "object") {
				el[prop].baseVal = tokens.join(" ");
			} else {
				el[prop] = tokens.join(" ");
			}
			reindex();
		};

		that.toggle = function (token, force) {
			preop.apply(that, [token]);

			/** Token state's being forced. */
			if (undefined !== force) {
				if (force) {
					that.add(token);
					return true;
				} else {
					that.remove(token);
					return false;
				}
			}

			/** Token already exists in tokenList. Remove it, and return FALSE. */
			if (tokenMap[token]) {
				that.remove(token);
				return false;
			}

			/** Otherwise, add the token and return TRUE. */
			that.add(token);
			return true;
		};

		return that;
	};
})();

const nativeImpl = "DOMTokenList" in window && window.DOMTokenList != null;

if (
	!nativeImpl ||
	(!!document.createElementNS &&
		!!document.createElementNS("http://www.w3.org/2000/svg", "svg") &&
		!(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList))
) {
	window.DOMTokenList = _DOMTokenList;
}

// Add second argument to native DOMTokenList.toggle() if necessary
(function () {
	const e = document.createElement("span");
	if (!("classList" in e)) return;
	e.classList.toggle("x", false);
	if (!e.classList.contains("x")) return;
	e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
		let force = arguments[1];
		if (force === undefined) {
			const add = !this.contains(token);
			this[add ? "add" : "remove"](token);
			return add;
		}
		force = !!force;
		this[force ? "add" : "remove"](token);
		return force;
	};
})();

// Add multiple arguments to native DOMTokenList.add() if necessary
(function () {
	const e = document.createElement("span");
	if (!("classList" in e)) return;
	e.classList.add("a", "b");
	if (e.classList.contains("b")) return;
	const native = e.classList.constructor.prototype.add;
	e.classList.constructor.prototype.add = function () {
		const args = arguments;
		const l = arguments.length;
		for (let i = 0; i < l; i++) {
			native.call(this, args[i]);
		}
	};
})();

// Add multiple arguments to native DOMTokenList.remove() if necessary
(function () {
	const e = document.createElement("span");
	if (!("classList" in e)) return;
	e.classList.add("a");
	e.classList.add("b");
	e.classList.remove("a", "b");
	if (!e.classList.contains("b")) return;
	const native = e.classList.constructor.prototype.remove;
	e.classList.constructor.prototype.remove = function () {
		const args = arguments;
		const l = arguments.length;
		for (let i = 0; i < l; i++) {
			native.call(this, args[i]);
		}
	};
})();

// Add replace() to DOMTokenList if necessary
(function () {
	const e = document.createElement("span");
	if (!("classList" in e) || "replace" in e.classList.constructor.prototype) return;

	e.classList.constructor.prototype.replace = function (token, newToken) {
		const tokenString = "" + token,
			newTokenString = "" + newToken;

		try {
			new DOMException();
		} catch (e) {
			window.DOMException = function (message, name) {
				if (!(this instanceof DOMException)) return new DOMException(message, name);
				this.message = message;
				this.name = name;
			};
		}

		let error;
		if (!(tokenString && newTokenString)) error = "SyntaxError";
		if (!error && (/\s/.test(tokenString) || /\s/.test(newTokenString))) error = "InvalidCharacterError";
		if (error) throw new DOMException("DOMTokenList.replace was provided tokens '" + tokenString + "' and '" + newTokenString + "'", error);

		if (!this.contains(tokenString)) return false;

		// tokensTobeMoved are "tokenString" and all tokens found after it
		const tokensTobeMoved = [];
		let newTokenFound = false;
		for (var i = 0; i < this.length; ++i)
			if (newTokenString === this.item(i)) newTokenFound = true;
			else if (tokenString === this.item(i)) break;
		for (; i < this.length; ++i) tokensTobeMoved.push(this.item(i));
		for (i = 0; i < tokensTobeMoved.length; ++i) {
			const currentToken = tokensTobeMoved[i];
			currentToken !== newTokenString && this.remove(currentToken);
			currentToken !== tokenString && this.add(currentToken);
			currentToken === tokenString && !newTokenFound && (this.remove(newTokenString), this.add(newTokenString));
		}
		return true;
	};
})();
