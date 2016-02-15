/**
 * User: Alexander Behrens <alexander.behrens.84@gmail.com>.
 */

'use strict';


module.exports = function keyGuard(options) {

  options = options || {};

  var namespace = options.namespace;
  var minLength = options.minLength || 1;
  var maxLength = options.maxLength || 100;
  
  options.fragments = options.fragments || {};
  options.fragments.count = options.fragments.count || {}
  var minFragmentsCount = options.fragments.count.min || 2;
  var maxFragmentsCount = options.fragments.count.max || 5;
  options.fragments.len = options.fragments.len || {}
  var minFragmentsLength = options.fragments.len.min || 2;
  var maxFragmentsLength = options.fragments.len.max || 20;
  var delimiter = options.fragments.delimiter || ':';
  var regexpFragments = options.fragments.regexp || /^[a-zA-Z0-9]+$/;

  function handleSeed(seed) {

    if (!seed) {
      seed = [namespace].map(validateFragment);
    } else if (typeof seed === 'string') {
      seed = seed.split(delimiter).map(validateFragment);
    }

    function update(fragment) {
      return handleSeed(seed.concat(validateFragment(fragment)));
    }

    function get() {
      return validateKey(seed);
    }

    return {
      update: update,
      get: get
    };

  }

  function validateFragment(fragment) {

    if (!fragment) {
      throw new Error('Fragment cannot be empty or undefined.');
    }
    var _typeof = typeof fragment;
    // If fragment is number, always validate true.
    if (_typeof === 'number') {
      return fragment;
    }
    if (_typeof !== 'string') {
      throw new Error('Fragment "' + fragment + '" must be either a number or a string.');
    }
    // At this point fragment is a string,
    // so calling match() is safe.
    if (fragment.match(new RegExp(delimiter))) {
      throw new Error('Fragment "' + fragment + '" cannot contain global delimiter "' + delimiter + '".');
    }
    if (!fragment.match(regexpFragments)) {
      throw new Error('Fragment "' + fragment + '" does not match ' + regexpFragments + ' RegExp.');
    }
    if (fragment.length < minFragmentsLength) {
      throw new Error('Fragment "' + fragment + '" contains less than ' + minFragmentsLength + ' characters.');
    }
    if (fragment.length > maxFragmentsLength) {
      throw new Error('Fragment "' + fragment + '" contains more than ' + minFragmentsLength + ' characters.');
    }

    return fragment;

  }

  function validateKey(key) {
    if (key.length < minFragmentsCount) {
      throw new Error('Key "' + key.join(delimiter) + '" contains less than ' + minFragmentsCount + ' fragments.');
    }
    if (key.length > maxFragmentsCount) {
      throw new Error('Key "' + key.join(delimiter) + '" contains more than ' + maxFragmentsCount + ' fragments.');
    }
    if (namespace && key[0] !== namespace) {
      throw new Error('Key "' + key.join(delimiter) + '" must start with global name space "' + namespace + '".');
    }
    var _key = key.join(delimiter);
    if (_key.length < minLength) {
      throw new Error('Key "' + _key + '" contains less than ' + minLength + ' characters.');
    }
    if (_key.length > maxLength) {
      throw new Error('Key "' + _key + '" contains more than ' + maxLength + ' characters.');
    }
    return _key;
  }

  return handleSeed;

};