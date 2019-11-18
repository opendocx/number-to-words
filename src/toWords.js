'use strict';

var makeOrdinal = require('./makeOrdinal');
var isFinite = require('./isFinite');
var isSafeNumber = require('./isSafeNumber');

var TEN = 10;
var ONE_HUNDRED = 100;
var ONE_THOUSAND = 1000;
var ONE_MILLION = 1000000;
var ONE_BILLION = 1000000000;           //         1.000.000.000 (9)
var ONE_TRILLION = 1000000000000;       //     1.000.000.000.000 (12)
var ONE_QUADRILLION = 1000000000000000; // 1.000.000.000.000.000 (15)
var MAX = 9007199254740992;             // 9.007.199.254.740.992 (15)

var LESS_THAN_TWENTY = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

var TENTHS_LESS_THAN_HUNDRED = [
    'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {object} [options]
 * @returns {string}
 */
function toWords(number, options) {
    var asOrdinal = false;
    if (typeof options !== 'object' || !options) {
        asOrdinal = options // support deprecated 2nd param for backward compatibility
        options = { useCommas: true, negativePrefix: 'minus' } // default options for backward compatibility
    } else {
        if (typeof options.negativePrefix !== 'string') options.negativePrefix = 'minus'
        options.useCommas = Boolean(options.useCommas)
    }
    var words;
    var num = parseInt(number, 10);

    if (!isFinite(num)) {
        throw new TypeError(
            'Not a finite number: ' + number + ' (' + typeof number + ')'
        );
    }
    if (!isSafeNumber(num)) {
        throw new RangeError(
            'Input is not a safe number; it’s either too large or too small.'
        );
    }
    words = generateWords(num, options);
    return asOrdinal ? makeOrdinal(words) : words;
}

function generateWords(number, options) {
    var remainder, word, temp,
        words = arguments[2],
        comma = options.useCommas ? ',' : '';

    // We’re done
    if (number === 0) {
        if (!words) return 'zero';
        temp = words.join(' ');
        if (options.useCommas) temp = temp.replace(/,$/, '');
        return temp;
    }
    // First run
    if (!words) {
        words = [];
    }
    // If negative, prepend negativePrefix (“minus” is default)
    if (number < 0) {
        words.push(options.negativePrefix);
        number = Math.abs(number);
    }

    if (number < 20) {
        remainder = 0;
        word = LESS_THAN_TWENTY[number];

    } else if (number < ONE_HUNDRED) {
        remainder = number % TEN;
        word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)];
        // In case of remainder, we need to handle it here to be able to add the “-”
        if (remainder) {
            word += '-' + LESS_THAN_TWENTY[remainder];
            remainder = 0;
        }

    } else if (number < ONE_THOUSAND) {
        remainder = number % ONE_HUNDRED;
        word = generateWords(Math.floor(number / ONE_HUNDRED), options) + ' hundred';

    } else if (number < ONE_MILLION) {
        remainder = number % ONE_THOUSAND;
        word = generateWords(Math.floor(number / ONE_THOUSAND), options) + ' thousand' + comma;

    } else if (number < ONE_BILLION) {
        remainder = number % ONE_MILLION;
        word = generateWords(Math.floor(number / ONE_MILLION), options) + ' million' + comma;

    } else if (number < ONE_TRILLION) {
        remainder = number % ONE_BILLION;
        word = generateWords(Math.floor(number / ONE_BILLION), options) + ' billion' + comma;

    } else if (number < ONE_QUADRILLION) {
        remainder = number % ONE_TRILLION;
        word = generateWords(Math.floor(number / ONE_TRILLION), options) + ' trillion' + comma;

    } else if (number <= MAX) {
        remainder = number % ONE_QUADRILLION;
        word = generateWords(Math.floor(number / ONE_QUADRILLION), options) +
        ' quadrillion' + comma;
    }

    words.push(word);
    return generateWords(remainder, options, words);
}

module.exports = toWords;
