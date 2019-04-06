(function(O, F) {
	"use strict";

	if (!"defineProperty" in O) {
		throw new Error("proto-polyfill requires Object.defineProperty");
	}

	try {
		O.defineProperty({}, "", {get: function() {}});
	} catch (ex) {
		// If accessors aren't supported. There's nothing we can do here.
		return;
	}

	var O_PROTO = "__proto__";
	var P_PROTO = "___proto_polyfill_proto___";
	var P_FUNCT = "___proto_polyfill_funct___";
	var P_VALUE = "___proto_polyfill_value___";
	var SYMBOL = "Symbol(";

	var getPrototypeOf = O["getPrototypeOf"];
	var getOwnPropertyNames = O["getOwnPropertyNames"];
	var defineProperty = O["defineProperty"];
	var getOwnPropertyDescriptor = O["getOwnPropertyDescriptor"];
	var create = O["create"];

	function getFunction(source, name, what) {
		var info = getOwnPropertyDescriptor(source, name);
		var func = info[what];
		return func[P_FUNCT] || func;
	}

	function prepareFunction(dest, source, name, what) {
		function newFunction() {
			return getFunction(source, name, what).apply(dest, arguments);
		}
		defineProperty(newFunction, P_FUNCT, {
			get: function pFunctionGet() {
				return getFunction(source, name, what);
			},
			enumerable: false,
			configurable: false
		});
		return newFunction;
	}

	function setProperty(dest, source, name) {
		var info = getOwnPropertyDescriptor(source, name);
		var hasSetter = info.set instanceof F;
		var hasGetter = info.get instanceof F;
		if (hasSetter && hasGetter) {
			defineProperty(dest, name, {
				set: prepareFunction(dest, source, name, "set"),
				get: prepareFunction(dest, source, name, "get"),
				enumerable: info.enumerable || false,
				configurable: true
			});
		} else if (hasSetter) {
			defineProperty(dest, name, {
				set: prepareFunction(dest, source, name, "set"),
				enumerable: info.enumerable || false,
				configurable: true
			});
		} else if (hasGetter) {
			defineProperty(dest, name, {
				get: prepareFunction(dest, source, name, "get"),
				enumerable: info.enumerable || false,
				configurable: true
			});
		} else {
			defineProperty(dest, name, {
				set: function(v) {
					this[P_VALUE][name] = v;
				},
				get: function() {
					return name in this[P_VALUE] ? this[P_VALUE][name] : this === dest ? source[name] : dest[name];
				},
				enumerable: info.enumerable || false,
				configurable: true
			});
		}
	}

	function setProperties(dest, source) {
		var names = getOwnPropertyNames(source),
			name,
			n = 0;
		for (; n < names.length; n++) {
			name = names[n];
			if (name && name !== O_PROTO && name !== P_PROTO && name !== P_FUNCT && name !== P_VALUE && name.indexOf(SYMBOL) !== 0 && !dest.hasOwnProperty(name)) {
				setProperty(dest, source, name);
			}
		}
	}

	function setProto(dest, source) {
		var sourceProto = typeof source === "function" ? source.prototype : source;
		var sourceConstructor = typeof source === "function" ? source : sourceProto && sourceProto.constructor;
		defineProperty(dest, P_PROTO, {
			value: sourceProto || source,
			enumerable: false,
			configurable: false,
			writable: false
		});
		defineProperty(dest, P_VALUE, {
			value: {},
			enumerable: false,
			configurable: false,
			writable: false
		});
		if (!sourceConstructor) {
			return;
		}
		setProperties(dest, sourceConstructor);
	}

	if (!(O_PROTO in O) && !(O_PROTO in F) && getPrototypeOf instanceof F && getOwnPropertyNames instanceof F && defineProperty instanceof F && getOwnPropertyDescriptor instanceof F) {
		O["setPrototypeOf"] = function oSetPrototypeOf(obj, proto) {
			if (obj instanceof O && obj !== null) {
				obj.__proto__ = proto;
			}
			return obj;
		};
		O["getPrototypeOf"] = function oGetPrototypeOf(obj) {
			return obj instanceof O && obj !== null ? obj.__proto__ : getPrototypeOf(obj);
		};
		defineProperty(O, "create", {
			value: function oCreate(source, props) {
				var C = create(source, props);
				defineProperty(C, O_PROTO, {
					get: function cGetProto() {
						if (this === C) {
							return source;
						} else {
							return C;
						}
					},
					enumerable: false,
					configurable: false
				});
				return C;
			},
			enumerable: false,
			configurable: true,
			writable: true
		});
		defineProperty(O.prototype, O_PROTO, {
			get: function oGetProto() {
				switch (typeof this) {
					case "string":
						return String.prototype;
					case "number":
						return Number.prototype;
					case "boolean":
						return Boolean.prototype;
				}
				if (P_PROTO in this) {
					return this[P_PROTO];
				}
				var constr = this.constructor;
				if (!constr) {
					return null;
				} else if (typeof constr.prototype === "function") {
					return constr;
				} else if (this instanceof constr) {
					return constr.prototype || null;
				} else {
					var proto = constr.__proto__;
					return this !== O.prototype && proto.prototype === undefined ? O.prototype : proto.prototype || null;
				}
			},
			set: function oSetProto(proto) {
				if (proto && this instanceof O) {
					defineProperty(this, P_PROTO, {
						value: proto,
						enumerable: false,
						configurable: false,
						writable: false
					});
					defineProperty(this, P_VALUE, {
						value: {},
						enumerable: false,
						configurable: false,
						writable: false
					});
					setProperties(this, proto);
				}
			},
			enumerable: false,
			configurable: false
		});
		defineProperty(F.prototype, O_PROTO, {
			get: function fGetProto() {
				if (typeof this.prototype === "function") {
					return getPrototypeOf(this.constructor);
				}
				if (!(P_PROTO in this)) {
					if (this.prototype) {
						setProto(this, getPrototypeOf(this));
					} else {
						return O.prototype;
					}
				}
				if (this[P_PROTO]) {
					return typeof this[P_PROTO] === "function" ? this[P_PROTO] : this[P_PROTO].constructor;
				} else {
					return null;
				}
			},
			set: function fSetProto(source) {
				setProto(this, source);
			},
			enumerable: false,
			configurable: false
		});
	}
})(Object, Function);
