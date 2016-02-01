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

### Installing a game module

Required directory layout:

    [game_files]
            |____ [My Game]
                        |____ [clientside]
                        |           |____ CGame.js
                        |____ [serverside]
                        |           |____ Game.js
                        |____ [tests]


Enclose your entire game into a folder with the above layout and name it as you wish it to be displayed on the lobby screen, then place it under the 'game_files' directory.

In this case, nLobby will seek a serverside file:

```
"./game_files/My\ Game/serverside/Game.js"
```

and a clientside file:

```
"./game_files/My\ Game/clientside/CGame.js"
```

as well as run any test files in the tests folder.

### Future TODOs

- [x] Move user object to redis-store
- [ ] Move game object to redis-store or similar
- [x] Implement message toasting in jade file
- [ ] Finish game 'reset' functionality
- [ ] Add lobby chat functionality
- [ ] Add 'Available Games' and live game-joining functionality


License
----

nlobby licensed under MIT license.
Included snake game files licensed separately under GPLv3.
