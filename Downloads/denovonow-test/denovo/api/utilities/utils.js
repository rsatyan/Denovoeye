/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
var _ = require('underscore')

exports.uid = function(len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.toObject = function(obj) {

	// Clone Self
      var self = _.clone(obj);

      Object.keys(self).forEach(function(key) {

        // Remove any functions
        if(typeof self[key] === 'function') {
          delete self[key];
        }
      });
      return self;
}

exports.toJson = function(obj,key) {
	var obj1 = this.toObject(obj)
	delete obj1[key]
	return obj1;
}