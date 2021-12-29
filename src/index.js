'use strict'
/*
  Download go-libp2p distribution package for desired version.
  API:
    download([<version>])
*/

const gunzip = require('gunzip-maybe')
const path = require('path')
const request = require('request')
const tarFS = require('tar-fs')
const unzip = require('unzip-stream')
const pkg = require('./../package.json')
const retry = require('p-retry')

const libp2pVersions = require('./versions')

// Check package.json for default config
const goLibp2pInfo = pkg['go-libp2p']

const goLibp2pVersion = (goLibp2pInfo && goLibp2pInfo.version)
  ? pkg['go-libp2p'].version
  : 'v' + pkg.version.replace(/-[0-9]+/, '')

let distUrl = (goLibp2pInfo && goLibp2pInfo.distUrl)
  ? pkg['go-libp2p'].distUrl
  : 'https://ipfs.io' // public gateway

const installPath = path.join(path.resolve(process.cwd()), 'go-libp2p')

// Main function
function download (version, platform) {
  return new Promise((resolve, reject) => {
    version = process.env.TARGET_VERSION || version || goLibp2pVersion
    platform = process.env.TARGET_OS || platform || process.platform

    const isWindows = platform === 'win32'

    let libp2pVersion = libp2pVersions[version]

    if (!libp2pVersion) {
      version = libp2pVersions.latest
    }

    libp2pVersion = libp2pVersions[libp2pVersions.latest]

    // Create the download url
    const fileExtension = isWindows ? '.zip' : '.tar.gz'
    const fileName = 'libp2p_' + version + fileExtension
    const url = `${distUrl}/ipfs/${libp2pVersion[platform]}`

    // Success callback wrapper
    // go-libp2p contents are in 'go-libp2p/', so append that to the path
    const done = () => resolve({
      fileName: fileName,
      installPath
    })

    const unpack = (stream) => {
      stream.on('error', (err) => {
        reject(err)
      })

      if (isWindows) {
        return stream.pipe(
          unzip
            .Extract({ path: installPath })
            .on('error', (err) => reject(err))
            .on('close', done)
        )
      }

      return stream
        .pipe(gunzip())
        .pipe(
          tarFS
            .extract(installPath)
            .on('error', (err) => reject(err))
            .on('finish', done)
        )
    }

    // Start
    process.stdout.write(`Platform: ${platform}\n`)
    process.stdout.write(`Version: ${version}\n`)
    process.stdout.write(`Downloading: ${url}\n`)
    process.stdout.write(`Destination: ${installPath}\n`)

    const req = request.get(url, (err, res, body) => {
      if (err) {
        return reject(err)
      }
      // Handle errors
      if (res.statusCode !== 200) {
        reject(new Error(`${res.statusCode} - ${res.body}`))
      }
    })

    req.on('response', (res) => {
      // Unpack only if the request was successful
      if (res.statusCode !== 200) {
        return
      }

      unpack(res)
    })
  })
}

module.exports = (version, platform) => {
  return retry((attempt) => {
    if (attempt > 1) {
      console.info('Retry:', attempt)
    }

    return download(version, platform)
  }, {
    retries: process.env.GO_LIBP2P_DEP_DOWNLOAD_RETRIES || 10,
    onFailedAttempt: (err) => {
      console.info('Failed:', err.message)
    }
  })
}
