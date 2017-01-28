#! /usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var promisify = _bluebird2.default.promisify;
var outputDir = 'converted/';

var GTASnapmaticConverter = function () {
  function GTASnapmaticConverter() {
    var _this = this;

    (0, _classCallCheck3.default)(this, GTASnapmaticConverter);

    this.convert = function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(filesDir) {
        var files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, convertedFile;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.createDirectory(filesDir + outputDir);

              case 2:
                _context.next = 4;
                return _this.getFilesToConvert(filesDir);

              case 4:
                files = _context.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 8;
                _iterator = (0, _getIterator3.default)(files);

              case 10:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 19;
                  break;
                }

                file = _step.value;
                _context.next = 14;
                return _this.convertToJpg(filesDir + file, filesDir + outputDir + file.split('.').pop() + '.jpg');

              case 14:
                convertedFile = _context.sent;

                console.log('converted file: ' + convertedFile);

              case 16:
                _iteratorNormalCompletion = true;
                _context.next = 10;
                break;

              case 19:
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context['catch'](8);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 25:
                _context.prev = 25;
                _context.prev = 26;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 28:
                _context.prev = 28;

                if (!_didIteratorError) {
                  _context.next = 31;
                  break;
                }

                throw _iteratorError;

              case 31:
                return _context.finish(28);

              case 32:
                return _context.finish(25);

              case 33:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[8, 21, 25, 33], [26,, 28, 32]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    if (process.argv.length <= 2) {
      console.log('Usage:  ' + __filename + ' <directory>');
      process.exit(-1);
    }
    this.convert(process.argv[2] + '/');
  }

  (0, _createClass3.default)(GTASnapmaticConverter, [{
    key: 'getFilesToConvert',
    value: function getFilesToConvert(dir) {
      return promisify(_fs2.default.readdir)(dir).then(function (files) {
        var foundFiles = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (0, _getIterator3.default)(files), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var file = _step2.value;

            if (file.startsWith('PGTA')) foundFiles.push(file);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return foundFiles;
      });
    }
  }, {
    key: 'convertToJpg',
    value: function convertToJpg(inputFile, outputFile) {
      var _this2 = this;

      return promisify(_fs2.default.readFile)(inputFile, 'hex').then(function (data) {
        return _this2.saveJpg(outputFile, data);
      });
    }
  }, {
    key: 'saveJpg',
    value: function saveJpg(outputFile, data) {
      return promisify(_fs2.default.writeFile)(outputFile, data.replace(data.split('ffd8')[0], ''), 'hex').then(function () {
        return outputFile;
      });
    }
  }, {
    key: 'createDirectory',
    value: function createDirectory(dir) {
      return promisify(_fs2.default.stat)(dir).then(null).catch(function (err) {
        if (err.code == 'ENOENT') return promisify(_fs2.default.mkdir)(dir);
      });
    }
  }]);
  return GTASnapmaticConverter;
}();

new GTASnapmaticConverter();