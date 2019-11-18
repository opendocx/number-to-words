'use strict';

var makeOrdinal = require('./makeOrdinal');
var toWords = require('./toWords');

/**
 * Converts a number into ordinal words.
 * @example toWordsOrdinal(12) => 'twelfth'
 * @param {number|string} number
 * @param {object} options
 * @returns {string}
 */
function toWordsOrdinal(number, options) {
    var words = toWords(number, options);
    return makeOrdinal(words);
}

module.exports = toWordsOrdinal;
