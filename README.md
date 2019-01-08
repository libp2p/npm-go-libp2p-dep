Install go-libp2p from npm as a dependency of your project
========================================================

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![](https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)

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

Note: [gox](https://github.com/mitchellh/gox) can be used to generate binaries for all platforms.
