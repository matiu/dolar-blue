var http = require('http');

var getLaNacion  = function(cb) {
  var options = {
    host: 'contenidos.lanacion.com.ar',
    path: '/json/dolar',
  };

  var req = http.request(options, function(res) {
    var str = '';

    res.on('data', function (chunk) {
        str += chunk;
    });

    res.on('end', function () {
      var ret = {};
      try {
        //JSONP to JSON
        str = str.substr(19,str.length-19-2);
        ret['data'] = JSON.parse(str);
      }
      catch (err) {
        return cb( 'Bad JSON from ' + options.host + 
                        options.path + ":" + err + "\n" + str );
      }
      if ( ret.data.InformalVentaValue && ret.data.InformalCompraValue ) {
        var ventaDecimal = parseFloat(ret.data.InformalVentaValue.replace(/,/,'.'));
        var compraDecimal = parseFloat(ret.data.InformalCompraValue.replace(/,/,'.'));
        if (isNaN(ventaDecimal) || isNaN(compraDecimal)) {
          cb('rate is NaN');
        } else {
          ret['rates'] = {
            buy: compraDecimal,
            sell: ventaDecimal,
            source: 'LaNacion',
            date: new Date(ret.data.Date)
          };
          cb(null, ret);
        }
      }
      else {
        cb('Unexpected response from ' + options.host + options.path);
      }
    });
  });
  req.end();
  req.on('error', function(e) {
    cb(e);
  });
};

var sumVar = function (varName) {
  var passVar = varName;
  return function(a,b) {
    return  a + b[passVar];
  };
}
var lastDate = function(a,b) {
  ndate = new Date(b['date']);
  return new Date(Math.max(a,ndate));
};

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

var getBluelytics  = function(cb) {

  var options = {
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
      try {
          ret['data'] = JSON.parse(str);    
      }
      catch (err) {
        return cb( 'Bad JSON from ' + options.host + 
                        options.path + ":" + err + "\n" + str );
      }
      ret['rates'] = avg_blue(ret.data);
      ret.rates['source'] = 'Bluelytics';

      if (!isNaN(ret.rates.sell) && !isNaN(ret.rates.buy) ) {
        cb(null, ret);
      }
      else {
        cb('Unexpected response from ' + options.host + options.path);
      }
    });
  });
  req.end();
  req.on('error', function(e) {
    cb(e);
  });
};


var getData = function (opts, cb) {
  var data = {};
  data['date'] = new Date();

  if (typeof (opts) == 'function') {
    cb = opts;

    getLaNacion(function(err, v) {
      if (v && !err) {
        data['LaNacion'] = v.data;
        data.rates = v.rates;
        return cb(null, data);
      } else {
        getBluelytics(function(err, v) {
          if (v && !err) {
            data['Bluelytics'] = v.data;
            data.rates = v.rates;
            return cb(null, data);
          } else {
            cb('no data');
          }
        });
      }
    });
    
  }

  else {
    switch(opts.src) {
      case 'Bluelytics':
        getBluelytics(function(err, v) {
          var data = {};
          data['date'] = new Date();
          if (v && !err) {
            data['Bluelytics'] = v.data;
            data.rates = v.rates;
            return cb(null, data);
          } else {
            return cb('no data');
          }
        });
        break;
      case 'LaNacion':
        getLaNacion(function(err, v) {
          var data = {};
          data['date'] = new Date();
          if (v && !err) {
            data['LaNacion'] = v.data;
            data.rates = v.rates;
            return cb(null, data);
          } else {
            return cb('no data');
          }
        });
        break;
      default:
        cb('Unknown source provided: ' + opts.src);
    }
  }
};

exports.getData = getData;
