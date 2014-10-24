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
  var data = [];

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
    if (sourceData && sourceData.rates && moment(sourceData.date).isAfter(bestDate)) {
      data = sourceData;
      bestDate = sourceData.date;
    }

    // Mark this request responded.
    responseCount++;
    
    // If we've heard back from all requests, invoke the callback
    if (responseCount == sources.length) {
      cb(null, data);
    }
  };

  // Process each requested source
  _(sources).forEach( function (source) { 
    var sourceModule = require('lib/sources/' + source);
    sourceModule.getData(handleResponse);
  });

};

// Public API for this object
exports.getData = getData;
