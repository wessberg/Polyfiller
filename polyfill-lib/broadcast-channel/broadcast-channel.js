/**
  @class BroadcastChannel
  A simple BroadcastChannel polyfill that works with all major browsers.
  Please refer to the official MDN documentation of the Broadcast Channel API.
  @see <a href="https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API">Broadcast Channel API on MDN</a>
  @author Alessandro Piana
  @version 1.0.0
 */

/*
  MIT License

  Copyright (c) 2019 Alessandro Piana

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

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

	/**
	 * Build a "similar" response as done in the real BroadcastChannel API
	 */
	function buildResponse(data) {
		return {
			timestamp: getTimestamp(),
			isTrusted: true,
			target: null, // Since we are using JSON stringify, we cannot pass references.
			currentTarget: null,
			data: data,
			bubbles: false,
			cancelable: false,
			defaultPrevented: false,
			lastEventId: "",
			origin: context.location.origin
		};
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
		var msgObj = buildResponse(data);

		// SAME-TAB communication.
		var subscribers = _channels[this.channelId] || [];
		for (var j in subscribers) {
			// We don't send the message to ourselves.
			if (subscribers[j].closed || subscribers[j].name === this.name) continue;

			if (subscribers[j].onmessage) {
				subscribers[j].onmessage(msgObj);
			}
		}

		// CROSS-TAB communication.
		// Adds some properties to communicate among the tabs.
		var editedObj = {
			channelId: this.channelId,
			bcId: this.name,
			tabId: _tabId,
			message: msgObj
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
				for (var j in subscribers) {
					if (!subscribers[j].closed && subscribers[j].onmessage) {
						subscribers[j].onmessage(obj.message);
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
