'use strict'

let debug = require('debug')('modbus tcp response handler')
let ModbusTCPResponse = require('./tcp-response.js')
let ReadCoilsResponseBody = require('./response/read-coils.js')

class TCPResponseHandler {

  constructor (server) {
    this._server = server
    this._server.setMaxListeners(1)
  }

  _handleReadCoilsRequest (request, cb) {
    cb(new ModbusTCPResponse())
  }

  handle (request, cb) {
    /* read coils request */
    if (request.body.fc === 0x01) {
      if (!this._server.coils) {
        debug('no coils buffer on server, trying readCoils handler')
        this._server.emit('readCoils', request, cb)
        return
      }

      let responseBody = ReadCoilsResponseBody.fromRequest(request.body, this._server.coils)
      let response = ModbusTCPResponse.fromRequest(request, responseBody)

      return response
    }
  }

}

module.exports = TCPResponseHandler
