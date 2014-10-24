var http = require('http')

// Bluelytics displays values from a number of sources. This will
// determine the average blue dolar rate from among these (excluding official rate)
var avg_blue = function (data) {

  only_blue = data.filter(function(s) {
    return (s.source != 'oficial' && !isNaN(s.value_sell) && !isNaN(s.value_buy) && s.value_sell > 0 && s.value_buy > 0);
  });
  
  return {
    'sell': parseFloat((only_blue.reduce(sumVar('value_sell'), 0)/only_blue.length).toFixed(4)),
    'buy': parseFloat((only_blue.reduce(sumVar('value_buy'), 0)/only_blue.length).toFixed(4)),
    'date': only_blue.reduce(lastDate, 0),
  };
}

// Calculate the sum of a specific variable common to all data sources
var sumVar = function (varName) {
  var passVar = varName;
  return function(a,b) {
    return  a + b[passVar];
  };
}

// Determine the most recent date of the two readings being compared
var lastDate = function(a,b) {
  ndate = new Date(b['date']);
  return new Date(Math.max(a,ndate));
};



exports.getData = function(cb) {
  var options = {
    name: 'Bluelytics',
    host: 'api.bluelytics.com.ar',
    path: '/json/last_price',
  };

  var req = http.request(options, function(res) {
    var str = '';

    res.on('data', function (chunk) {
      str += chunk;
    });

    res.on('end', function () {
      var ret = {};
      ret.source = {name: options.name, uri: 'http://'+options.host + options.path}
      try {
          ret['data'] = JSON.parse(str);    
      }
      catch (err) {
        return cb( 'Bad JSON from ' + options.host + 
                        options.path + ":" + err + "\n" + str );
      }
      ret['rates'] = avg_blue(ret.data);

      if (!isNaN(ret.rates.sell) && !isNaN(ret.rates.buy) ) {
        cb(null, ret);
      } else {
        cb('Unexpected response from ' + options.host + options.path);
      }
    });
  });
  req.end();
  req.on('error', function(e) {
    cb(e);
  });
};
