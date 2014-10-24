var  _ = require('lodash'),
  http = require('http');

var getData = function (opts, cb) {

  // List of known sources. Will query each of these sources in order
  // if no source specified in opts
  var sources = [
    'Bluelytics',
    'LaNacion'
  ];

  // Container for response data
  var data = {};

  // Counter to keep track of source responsees
  var responseCount = 0;

  // Determine which source(s) to use
  if (typeof (opts) == 'function') {
    cb = opts;
  } else {
    sources = [opts.src];
  }

  // Function to handle response from sources
  var handleResponse = function (err, sourceData) {
    if (sourceData && sourceData.source) {
      data[sourceData.source.name] = sourceData;
    }
    responseCount++;
    // If we've heard back from everyone, invoke the callback
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
