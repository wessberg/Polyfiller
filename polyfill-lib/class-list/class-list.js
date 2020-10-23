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
/** Polyfills a property with a DOMTokenList */
const addProp = function (o, name, attr) {
	defineGetter(
		o.prototype,
		name,
		function () {
			let tokenList;

			const THIS = this,
				/** Prevent this from firing twice for some reason. What the hell, IE. */
				gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
			if (THIS[gibberishProperty]) return tokenList;
			THIS[gibberishProperty] = true;

			/**
			 * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
			 *
			 * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
			 * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
			 * element instead, this would conflict with element types which use indexed properties (such as forms and
			 * select lists).
			 */
			if (false === dpSupport) {
				let visage;
				const mirror = addProp.mirror || document.createElement("div");
				const reflections = mirror.childNodes;
				const l = reflections.length;

				for (let i = 0; i < l; ++i)
					if (reflections[i]._R === THIS) {
						visage = reflections[i];
						break;
					}

				/** Couldn't find an element's reflection inside the mirror. Materialise one. */
				visage || (visage = mirror.appendChild(document.createElement("div")));

				tokenList = DOMTokenList.call(visage, THIS, attr);
			} else tokenList = new DOMTokenList(THIS, attr);

			defineGetter(THIS, name, function () {
				return tokenList;
			});
			delete THIS[gibberishProperty];

			return tokenList;
		},
		true
	);
};

addProp(window.Element, "classList", "className");
addProp(window.HTMLElement, "classList", "className");
addProp(window.HTMLLinkElement, "relList", "rel");
addProp(window.HTMLAnchorElement, "relList", "rel");
addProp(window.HTMLAreaElement, "relList", "rel");
