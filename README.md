# nlobby

## A Game lobby project written in node.js


nLobby is a node.js game lobby server built for html5 games

  - FOSS
  - Built for minimal frustration integration

### Version
v0.3.0

### Required Software

nLobby requires the following applications before running:

* Node.js - JavaScript runtime built on Chrome's V8 JavaScript engine
* Redis - In-memory data structure store

### Installation

First, you will need [redis-server](http://redis.io/download) installed.

Then, you will need npm installed. This is best done using the [Node Version Manager](https://github.com/creationix/nvm) .

Then, you will need to download the nLobby project and install all required modules:

```sh
$ git clone https://github.com/krkc/nlobby.git nLobby
$ cd nLobby
$ npm install
```

To start the server:
```sh
$ npm start
```
and CTRL+C to stop.

> Note: The nLobby start script will launch redis-server automatically, as well as stop the server when the
> nLobby server is terminated. However, occasionally if the nLobby server comes down unexpectedly, the user
> will be required to manually terminate the redis-server process.

### Future TODOs

- [x] Move user object to redis-store
- [ ] Move game object to redis-store or sqlite
- [x] Implement message toasting in jade file
- [ ] Finish game 'reset' functionality

Snake Game:

- [x] Address network latency lag in snake movement
- [ ] Move snake game into separate repo

Dngn Game:
- [ ] Begin to build dngn game
- [ ] Move dngn game into separate repo

License
----

nlobby licensed under MIT license.
Included snake game files licensed separately under GPLv3.
