(function (context) {
	// Internal variables
	var _channels = null, // List of channels
		_tabId = null, // Current window browser tab identifier (see IE problem, later)
		_prefix = "polyBC_"; // prefix to identify localStorage keys.

	/**
	 * Internal function, generates pseudo-random strings.
	 * @see http://stackoverflow.com/a/1349426/2187738
	 * @private
	 */
	function getRandomString(length) {
		var text = "",
			possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < (length || 5); i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	function flattenEventListenerOptions(options) {
		return {
			capture: typeof options === "boolean" ? options : options == null || options.capture == null ? false : options.capture
		};
	}

	function flattenAddEventListenerOptions(options) {
		return {
			capture: typeof options === "boolean" ? options : options == null || options.capture == null ? false : options.capture,
			passive: options == null || typeof options === "boolean" || options.passive == null ? false : options.passive,
			once: options == null || typeof options === "boolean" || options.once == null ? false : options.once
		};
	}

	/**
	 * Check if an object is empty.
	 * @see http://stackoverflow.com/a/679937/2187738
	 * @private
	 */
	function isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) return false;
		}
		return true;
		// Also this is good.
		// returns 0 if empty or an integer > 0 if non-empty
		//return Object.keys(obj).length;
	}

	/**
	 * Gets the current timestamp
	 * @private
	 */
	function getTimestamp() {
		return new Date().getTime();
	}

	function getVirtualMessageEvent(type, eventInitDict) {
		return {
			type: type,
			isTrusted: true,
			bubbles: eventInitDict != null && eventInitDict.bubbles != null ? eventInitDict.bubbles : true,
			cancelable: eventInitDict != null && eventInitDict.cancelable != null ? eventInitDict.cancelable : true,
			data: eventInitDict != null && eventInitDict.data !== undefined ? eventInitDict.data : undefined,
			origin: eventInitDict != null && eventInitDict.origin != null ? eventInitDict.origin : window.location.protocol + "//" + window.location.host,
			lastEventId: eventInitDict != null && eventInitDict.lastEventId != null ? eventInitDict.lastEventId : 12,
			source: eventInitDict != null && eventInitDict.source != null ? eventInitDict.source : undefined,
			ports: eventInitDict != null && eventInitDict.ports != null ? eventInitDict.ports : [],
			timestamp: getTimestamp(),
			target: null,
			currentTarget: null,
			defaultPrevented: false
		};
	}

	function constructMessageEvent(type, eventInitDict) {
		try {
			return new MessageEvent(type, eventInitDict);
		} catch (ex) {
			var msgEvent = document.createEvent("MessageEvent");

			if ("initMessageEvent" in msgEvent) {
				msgEvent.initMessageEvent(
					type,
					eventInitDict != null && eventInitDict.bubbles != null ? eventInitDict.bubbles : true,
					eventInitDict != null && eventInitDict.cancelable != null ? eventInitDict.cancelable : true,
					eventInitDict != null && eventInitDict.data !== undefined ? eventInitDict.data : undefined,
					eventInitDict != null && eventInitDict.origin != null ? eventInitDict.origin : window.location.protocol + "//" + window.location.host,
					eventInitDict != null && eventInitDict.lastEventId != null ? eventInitDict.lastEventId : 12,
					eventInitDict != null && eventInitDict.source != null ? eventInitDict.source : window,
					eventInitDict != null && eventInitDict.ports != null ? eventInitDict.ports : null
				);
			}

			return msgEvent;
		}
	}

	/**
	 * Creates a new BroadcastChannel
	 * @param {String} channelName - the channel name.
	 * return {BroadcastChannel}
	 */
	function BroadcastChannel(channelName) {
		// Check if localStorage is available.
		if (!context.localStorage) {
			throw new Error("localStorage not available");
		}

		// Add custom prefix to Channel Name.
		var _channelId = _prefix + channelName,
			isFirstChannel = _channels === null;

		this.channelId = _channelId;

		_tabId = _tabId || getRandomString(); // Creates a new tab identifier, if necessary.
		_channels = _channels || {}; // Initializes channels, if necessary.
		_channels[_channelId] = _channels[_channelId] || [];

		// Adds the current Broadcast Channel.
		_channels[_channelId].push(this);

		// Creates a sufficiently random name for the current instance of BC.
		this.name = _channelId + "::::" + getRandomString() + getTimestamp();

		// If it is the first instance of Channel created, also creates the storage listener.
		if (isFirstChannel) {
			// addEventListener.
			context.addEventListener("storage", _onmsg.bind(this), false);
		}

		return this;
	}

	/**
	 * Empty function to prevent errors when calling onmessage.
	 */
	BroadcastChannel.prototype.onmessage = function (ev) {};

	// BroadcastChannel inherits from EventTarget
	if (typeof EventTarget !== "undefined") {
		Object.setPrototypeOf(BroadcastChannel.prototype, EventTarget.prototype);
	}

	BroadcastChannel.prototype.dispatchEvent = function dispatchEvent(event) {
		if (arguments.length < 1) {
			throw new TypeError(
				"Failed to execute " +
					this.dispatchEvent.name +
					" on " +
					this.constructor.name +
					": 1 argument required, but only " +
					arguments.length +
					" present."
			);
		}

		// Ensure that the first argument is a proper Event
		if (!(event instanceof Event)) {
			throw new TypeError("Failed to execute " + this.dispatchEvent.name + " on " + this.constructor.name + ": parameter 1 is not of type 'Event'.");
		}

		if (this._listeners == null) {
			return !event.cancelable;
		}

		if (this._listeners[event.type] == null) {
			return !event.cancelable;
		}

		var entries = this._listeners[event.type];

		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			entry[1](event);
		}

		return !(event.cancelable && event.defaultPrevented);
	};

	BroadcastChannel.prototype.addEventListener = function addEventListener(type, eventListener, options) {
		// Ensure that 'addEventListener' is invoked with an appropriate amount of arguments
		if (arguments.length < 2) {
			throw new TypeError(
				"Failed to execute " +
					this.addEventListener.name +
					" on " +
					this.constructor.name +
					": 2 arguments required, but only " +
					arguments.length +
					" present."
			);
		}

		// Ensure that the eventListener argument is valid
		if (eventListener != null && typeof eventListener !== "function" && typeof eventListener !== "object") {
			throw new TypeError(
				"Failed to execute " +
					this.addEventListener.name +
					" on " +
					this.constructor.name +
					": The callback provided as parameter 2 is not an object."
			);
		}

		// If listener’s callback is null, then return.
		if (eventListener == null || (typeof eventListener !== "function" && typeof eventListener.handleEvent == null)) return;

		if (this._listeners == null) {
			this._listeners = {};
		}

		if (this._listeners[type] == null) {
			this._listeners[type] = [];
		}

		var flattenedOptions = flattenAddEventListenerOptions(options);

		var allListeners = this._listeners[type];
		for (var i = 0; i < allListeners.length; i++) {
			var currentListener = allListeners[i];
			if (
				currentListener[0] !== eventListener ||
				currentListener[1].capture !== flattenedOptions.capture ||
				currentListener[1].passive !== flattenedOptions.passive ||
				currentListener[1].once !== flattenedOptions.once
			)
				continue;

			// If we got this far, there already exists an event listener for this specific combination
			// of type, listener, and options
			return;
		}

		// Wrap the event listener
		var wrappedListener = function (e) {
			if (flattenedOptions.passive) {
				// Overwrite preventDefault to ensure that it throws when invoked
				e.preventDefault = function preventDefault() {
					throw new TypeError("Unable to preventDefault inside passive event listener invocation.");
				};
			}

			// Call the event listener. Preserve any implicit this-binding it may have
			typeof eventListener === "function" ? eventListener(e) : eventListener.handleEvent(e);

			// Immediately remove the event listener if 'once' is true
			if (flattenedOptions.once) {
				this.removeEventListener(type, wrappedListener, flattenedOptions);
			}
		};

		this._listeners[type].push([eventListener, wrappedListener, flattenedOptions]);
	};

	BroadcastChannel.prototype.removeEventListener = function removeEventListener(type, eventListener, options) {
		// Ensure that 'removeEventListener' is invoked with an appropriate amount of arguments
		if (arguments.length < 2) {
			throw new TypeError(
				"Failed to execute " +
					this.removeEventListener.name +
					" on " +
					this.constructor.name +
					": 2 arguments required, but only " +
					arguments.length +
					" present."
			);
		}

		// Ensure that the eventListener argument is valid
		if (eventListener != null && typeof eventListener !== "function" && typeof eventListener !== "object") {
			throw new TypeError(
				"Failed to execute " +
					this.removeEventListener.name +
					" on " +
					this.constructor.name +
					": The callback provided as parameter 2 is not an object."
			);
		}

		var flattenedOptions = flattenEventListenerOptions(options);
		if (eventListener == null || (typeof eventListener !== "function" && typeof eventListener.handleEvent == null)) return;

		if (this._listeners == null) {
			return;
		}

		if (this._listeners[type] == null) {
			return;
		}

		var allListeners = this._listeners[type];
		for (var i = 0; i < allListeners.length; i++) {
			var currentListener = allListeners[i];
			if (
				currentListener[0] !== eventListener ||
				currentListener[1].capture !== flattenedOptions.capture ||
				currentListener[1].passive !== flattenedOptions.passive ||
				currentListener[1].once !== flattenedOptions.once
			)
				continue;

			this._listeners[type].splice(i, 1);
			break;
		}
	};

	/**
	 * Sends the message to different channels.
	 * @param {Object} data - the data to be sent ( actually, it can be any JS type ).
	 */
	BroadcastChannel.prototype.postMessage = function (data) {
		// Gets all the 'Same tab' channels available.
		if (!_channels) return;

		if (this.closed) {
			throw new Error("This BroadcastChannel is closed.");
		}

		// Build the event-like response.
		var virtualMsgEvent = getVirtualMessageEvent("message", {
			data: data,
			bubbles: false,
			cancelable: false,
			composed: false
		});

		var msgEvent = constructMessageEvent("message", virtualMsgEvent);

		// SAME-TAB communication.
		var subscribers = _channels[this.channelId] || [];
		for (var j in subscribers) {
			// We don't send the message to ourselves.
			if (subscribers[j].closed || subscribers[j].name === this.name) continue;

			if (subscribers[j].onmessage) {
				subscribers[j].onmessage(msgEvent);
			}
			subscribers[j].dispatchEvent(msgEvent);
		}

		// CROSS-TAB communication.
		// Adds some properties to communicate among the tabs.
		var editedObj = {
			channelId: this.channelId,
			bcId: this.name,
			tabId: _tabId,
			message: virtualMsgEvent
		};

		try {
			var editedJSON = JSON.stringify(editedObj),
				lsKey = "eomBCmessage_" + getRandomString() + "_" + this.channelId;
			// Set localStorage item (and, after that, removes it).
			context.localStorage.setItem(lsKey, editedJSON);
		} catch (ex) {
			throw new Error("Message conversion has resulted in an error.");
		}

		setTimeout(function () {
			context.localStorage.removeItem(lsKey);
		}, 1000);
	};

	/**
	 * Handler of the 'storage' function.
	 * Called when another window has sent a message.
	 * @param {Object} ev - the message.
	 * @private
	 */
	function _onmsg(ev) {
		var key = ev.key,
			newValue = ev.newValue,
			isRemoved = !newValue,
			obj = null;

		// Actually checks if the messages if from us.
		if (key.indexOf("eomBCmessage_") > -1 && !isRemoved) {
			try {
				obj = JSON.parse(newValue);
			} catch (ex) {
				throw new Error("Message conversion has resulted in an error.");
			}

			// NOTE: Check on tab is done to prevent IE error
			// (localStorage event is called even in the same tab :( )

			if (obj.tabId !== _tabId && obj.channelId && _channels && _channels[obj.channelId]) {
				var subscribers = _channels[obj.channelId];
				var msgEvent = constructMessageEvent("message", obj.message);
				for (var j in subscribers) {
					if (!subscribers[j].closed) {
						if (subscribers[j].onmessage) {
							subscribers[j].onmessage(msgEvent);
						}

						subscribers[j].dispatchEvent(msgEvent);
					}
				}
				// Remove the item for safety.
				context.localStorage.removeItem(key);
			}
		}
	}

	/**
	 * Closes a Broadcast channel.
	 */
	BroadcastChannel.prototype.close = function () {
		this.closed = true;

		var index = _channels[this.channelId].indexOf(this);
		if (index > -1) _channels[this.channelId].splice(index, 1);

		// If we have no channels, remove the listener.
		if (!_channels[this.channelId].length) {
			delete _channels[this.channelId];
		}
		if (isEmpty(_channels)) {
			context.removeEventListener("storage", _onmsg.bind(this));
		}
	};

	// Sets BroadcastChannel, if not available.
	context.BroadcastChannel = context.BroadcastChannel || BroadcastChannel;
})(window.top);
