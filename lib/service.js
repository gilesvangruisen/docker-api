'use strict';

/**
 * Class representing a service
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function () {
  /**
   * Create a service
   * @param  {Modem}      modem     Modem to connect to the remote service
   * @param  {string}     id        Id of the service (optional)
   */
  function Service(modem, id) {
    _classCallCheck(this, Service);

    this.modem = modem;
    this.id = id;
  }

  /**
   * Get the list of services
   * https://docs.docker.com/engine/reference/api/docker_remote_api_v1.24/#/list-services
   * @param  {Object}   opts  Query params in the request (optional)
   * @return {Promise}        Promise returning the result as a list of services
   */


  _createClass(Service, [{
    key: 'list',
    value: function list(opts) {
      var _this = this;

      var call = {
        path: '/services?',
        method: 'GET',
        options: opts,
        statusCodes: {
          200: true,
          500: 'server error'
        }
      };

      return new Promise(function (resolve, reject) {
        _this.modem.dial(call, function (err, result) {
          if (err) return reject(err);
          if (!result.Services || !result.Services.length) return resolve([]);
          resolve(result.Services.map(function (conf) {
            var service = new Service(_this.modem, conf.ID);
            return Object.assign(service, conf);
          }));
        });
      });
    }

    /**
     * Create a service
     * https://docs.docker.com/engine/reference/api/docker_remote_api_v1.24/#/create-a-service
     * @param  {Object}   opts  Query params in the request (optional)
     * @return {Promise}        Promise return the new service
     */

  }, {
    key: 'create',
    value: function create(opts) {
      var _this2 = this;

      var call = {
        path: '/services/create?',
        method: 'POST',
        options: opts,
        statusCodes: {
          201: true,
          406: 'node is not part of a swarm',
          409: 'name conflicts'
        }
      };

      return new Promise(function (resolve, reject) {
        _this2.modem.dial(call, function (err, conf) {
          if (err) return reject(err);
          var service = new Service(_this2.modem, conf.ID);
          resolve(Object.assign(service, conf));
        });
      });
    }

    /**
     * Update a service
     * https://docs.docker.com/engine/reference/api/docker_remote_api_v1.24/#/update-a-service
     * @param  {Object}   opts  Query params in the request (optional)
     * @param  {String}   id    ID of the service to inspect, if it's not set, use the id of the object (optional)
     * @return {Promise}        Promise return the new service
     */

  }, {
    key: 'update',
    value: function update(opts, id) {
      var _this3 = this;

      var _processArguments = this.__processArguments(opts, id);

      var _processArguments2 = _slicedToArray(_processArguments, 2);

      opts = _processArguments2[0];
      id = _processArguments2[1];


      var call = {
        path: '/services/' + id + '/update?',
        method: 'POST',
        options: opts,
        statusCodes: {
          200: true,
          404: 'no such service',
          500: 'server error'
        }
      };

      return new Promise(function (resolve, reject) {
        _this3.modem.dial(call, function (err, conf) {
          if (err) return reject(err);
          var service = new Service(_this3.modem, id);
          resolve(Object.assign(service, conf));
        });
      });
    }

    /**
     * Get low-level information on a service
     * https://docs.docker.com/engine/reference/api/docker_remote_api_v1.24/#/inspect-one-or-more-services
     * The reason why this module isn't called inspect is because that interferes with the inspect utility of service.
     * @param  {Object}   opts  Query params in the request (optional)
     * @param  {String}   id    ID of the service to inspect, if it's not set, use the id of the object (optional)
     * @return {Promise}        Promise return the service
     */

  }, {
    key: 'status',
    value: function status(opts, id) {
      var _this4 = this;

      var _processArguments3 = this.__processArguments(opts, id);

      var _processArguments4 = _slicedToArray(_processArguments3, 2);

      opts = _processArguments4[0];
      id = _processArguments4[1];


      var call = {
        path: '/services/' + id + '?',
        method: 'GET',
        options: opts,
        statusCodes: {
          200: true,
          404: 'no such service',
          500: 'server error'
        }
      };

      return new Promise(function (resolve, reject) {
        _this4.modem.dial(call, function (err, conf) {
          if (err) return reject(err);
          var service = new Service(_this4.modem, id);
          resolve(Object.assign(service, conf));
        });
      });
    }

    /**
     * Remove a service
     * https://docs.docker.com/engine/reference/api/docker_remote_api_v1.24/#/remove-a-service
     * @param  {Object}   opts  Query params in the request (optional)
     * @param  {String}   id    ID of the service to inspect, if it's not set, use the id of the object (optional)
     * @return {Promise}        Promise return the result
     */

  }, {
    key: 'remove',
    value: function remove(opts, id) {
      var _this5 = this;

      var _processArguments5 = this.__processArguments(opts, id);

      var _processArguments6 = _slicedToArray(_processArguments5, 2);

      opts = _processArguments6[0];
      id = _processArguments6[1];

      var call = {
        path: '/services/' + id + '?',
        method: 'DELETE',
        options: opts,
        statusCodes: {
          200: true,
          404: 'no such service',
          500: 'server error'
        }
      };

      return new Promise(function (resolve, reject) {
        _this5.modem.dial(call, function (err, res) {
          if (err) return reject(err);
          resolve(res);
        });
      });
    }
  }, {
    key: '__processArguments',
    value: function __processArguments(opts, id) {
      if (typeof opts === "string" && !id) {
        id = opts;
      }
      if (!id && this.id) {
        id = this.id;
      }
      if (!opts) opts = {};
      return [opts, id];
    }
  }]);

  return Service;
}();

exports.default = Service;