var  _ = require('lodash'),
  http = require('http'),
  moment = require('moment');

// Public API for this package
var getData = function (opts, cb) {

  // List of supported sources. Will query each of these sources in order
  // if no source specified in opts
  var sources = [
    'LaNacion',
    'Bluelytics'
  ];

  // Container for response data
  var data = null;

  // Counter to keep track of most recent response
  var responseCount = 0;

  // Keep track of best (most recent) date seen
  var bestDate = 0;

  // Determine which source(s) to use, based on arguments
  if (typeof (opts) == 'function') {
    cb = opts;
  } else {
    sources = [opts.src];
  }

  // Function to handle response from sources
  var handleResponse = function (err, sourceData) {
    // Store/replace data if sourceData exists and is the most recent data available so far
    if (sourceData && sourceData.rates && moment(sourceData.rates.date).isAfter(bestDate)) {
      data = sourceData;
      data[sourceData.source.name] = sourceData.data; // Backwards compatibility with old API
      bestDate = sourceData.rates.date;
    }

    // Mark this request responded.
    responseCount++;
    
    // If we've heard back from all requests, invoke the callback
    if (responseCount == sources.length) {
      (data == null) 
        ? cb('no data') 
        : cb(null, data);
    }
  };

  // Process each requested source
  _(sources).forEach( function (source) { 
    try {
      var sourceModule = require('lib/sources/' + source);
      sourceModule.getData(handleResponse);
    } catch (err) {
      cb("Unknown source provided: " + source);
    }
  });

};

// Public API for this object
exports.getData = getData;

exports.getDataSimple = function (cb) {
  var sourceModule = require('lib/sources/LaNacion.js');
  sourceModule.getData(function (err, data) {
    if (err) cb(err)
    else cb(null,data);
  });
};
