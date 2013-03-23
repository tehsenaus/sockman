var WebSocket = require('websocket').client,
	events = require('events');

module.exports = {
	connect: function (url, options) {
		options = options || {};

		var sockman = new events.EventEmitter(),
			name = options.name || url;

		(function connect() {
			var socket = sockman.socket = new WebSocket();
			socket.connect(url);
			socket.on('connect', function(connection) {
				if ( name && options.logging ) console.log(name + "-CONNECTED");

				sockman.connection = connection;
				sockman.emit('connect', connection);

				connection.on('message', function (data) {
					if ( data.type != 'utf8' ) {
						console.error(name + ": Raw data received", data);
						return;
					}
					
					data = JSON.parse(data.utf8Data);

					sockman.emit('message', data);
				});
				connection.on('error', function (data) {
					connection.drop();
					// 'close' event invoked here

					if ( name && options.logging ) console.error(name + '-ERROR:', data);
				});
				connection.on('close', function() {
					sockman.connection = null;
			        process.nextTick(connect);

			        if ( name && options.logging ) console.error(name + '-CLOSED: reconnecting');
			    });

			    // Force periodic reconnect
			    if (options.periodicReconnect) {
				    setTimeout(function () {
				    	if ( connection.connected ) {
				    		if ( name && options.logging ) console.log(name + "-CONNECTION-REFRESH");
				    		connection.drop();
				    		// 'close' event invoked here
				    	}
				    }, options.periodicReconnect);
				}
			});
			socket.on('connectFailed', function(error) {
			    if ( name && options.logging ) console.log(name + '-CONNECT-ERROR:', error);
			    setTimeout(connect, 2500);
			});
		})();

		return sockman;
	}
}