sockman
=======

A friendly WebSocket client for Node.js.

Sockman keeps your WebSocket connected, forever.


Install
-------

```
npm install --save sockman
```

Usage
-----

```js
var socket = require('sockman').connect( url );
socket.on('connect', function (connection) {
   
   connection.send(JSON.stringify({
       some: 'data'
   });
   
   connection.on('message', function (msg) {
      console.log(msg);
   });

});
```
