Install go-libp2p from npm as a dependency of your project
========================================================

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://protocol.ai)
[![](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![](https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![Discourse posts](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg)](https://discuss.libp2p.io)
[![Dependency Status](https://david-dm.org/libp2p/npm-go-libp2p-dep.svg?style=flat-square)](https://david-dm.org/libp2p/npm-go-libp2p-dep)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Install the latest [go-libp2p](https://github.com/libp2p/go-libp2p/) binary from IPFS public gateway.

## Lead Maintainer

[Vasco Santos](https://github.com/vasco-santos)

# Installation

```
npm install go-libp2p-dep --save
```

## Development

**Warning**: The binary gets put in the `go-libp2p` folder inside the module folder.

### Which go-libp2p version this package downloads?

Can be specified in `package.json` with a field `go-libp2p.version`, eg:

```json
"go-libp2p": {
  "version": "v6.0.30"
},
```

## Version Update

When a new `go-libp2p` version is released, it is necessary to create binaries for linux, windows and mac os. After this, those binaries should be added to ipfs and the `versions.js` file updated accordingly.

For generating binaries for all the platforms we have been using [gox](https://github.com/mitchellh/gox).

An example flow for version 0.1.0:

- Install and build `go-libp2p-daemon`

```sh
$ # in your GOPATH (for example inside go/src/github.com/libp2p)
$ git clone https://github.com/libp2p/go-libp2p-daemon
$ cd go-libp2p-daemon
$ git checkout <release tag, e.g. v0.0.1>
$ go get ./...
$ go install ./...
```

- Generate the necessary binaries

```sh
$ gox -osarch="linux/amd64 darwin/amd64 windows/amd64" github.com/libp2p/go-libp2p-daemon/p2pd
```

- Archive resulting binaries

```sh
$ tar -cvzf go-libp2p-0.1.0-linux.tar.gz p2pd_linux_amd64
$ tar -cvzf go-libp2p-0.1.0-mac.tar.gz p2pd_darwin_amd64
$ zip go-libp2p-0.1.0-windows.zip p2pd_windows_amd64.exe
```

- Add to IPFS (a daemon should be running)

```sh
$ ipfs add go-libp2p-0.1.0-linux.tar.gz
$ ipfs add go-libp2p-0.1.0-mac.tar.gz
$ ipfs add go-libp2p-0.1.0-windows.zip
```

- Pin on IPFS bot