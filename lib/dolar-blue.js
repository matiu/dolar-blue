
var http = require('http');
var JSON5 = require('json5');
var async = require('async');


var getDolarBlue = function (cb) {
    var URL='www.eldolarblue.net';

    var options = {
        host: URL,
        path: '/getDolarBlue.php?as=json'
    };

    var req = http.request(options, function(res) {
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            
            var ret;
            try {
                ret = JSON5.parse(str);    
            }
            catch (err) {
               return cb( 'Bad JSON from ' + URL + ":" + err + "\n" + str );
            }

            if ( ret.exchangerate ) {
                var buyDecimal = parseFloat(ret.exchangerate.buy);
                var sellDecimal = parseFloat(ret.exchangerate.sell);
                if (isNaN(buyDecimal) || isNaN(sellDecimal)) {
                    cb('rate is NaN');
                } else {
                    cb(null, {
                        buy: buyDecimal,
                        sell: sellDecimal,
                        datetime: new Date(ret.datetime)
                    }); 
                }
            }
            else {
                cb('Unexpected response from ' + options.host + options.path)
            }
        });
    });
    req.end();
    req.on('error', function(e) {
        cb(e);
    });
};


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
            var ret;
            try {
                //JSONP to JSON
                str = str.substr(19,str.length-19-2);
                ret = JSON5.parse(str);
            }
            catch (err) {
               return cb( 'Bad JSON from ' + options.host + 
                               options.path + ":" + err + "\n" + str );
            }

            if ( ret.InformalVentaValue && ret.InformalCompraValue ) {
                var ventaDecimal = parseFloat(ret.InformalVentaValue.replace(/,/,'.'));
                var compraDecimal = parseFloat(ret.InformalCompraValue.replace(/,/,'.'));

                if (isNaN(ventaDecimal) || isNaN(compraDecimal)) {
                    cb('rate is NaN');
                } else {
                    cb(null, {
                        buy: ventaDecimal,
                        sell: compraDecimal,
                        datetime: new Date(ret.Date)
                    });
                }
            }
            else {
                cb('Unexpected response from ' + options.host + options.path)
            }
        });
    });
    req.end();
    req.on('error', function(e) {
        cb(e);
    });
};

var sumVar = function (varName){
  var passVar = varName;
  return function(a,b){
     return  a + b[passVar];
  };
}
var lastDate = function(a,b){
    ndate = new Date(b['date']);
    return new Date(Math.max(a,ndate));
};

var avg_blue = function (data){
    only_blue = data.filter(function(s){return s.source != 'oficial';});
    
    return {
      'sell': parseFloat((only_blue.reduce(sumVar('value_sell'), 0)/only_blue.length).toFixed(4)),
      'buy': parseFloat((only_blue.reduce(sumVar('value_buy'), 0)/only_blue.length).toFixed(4)),
      'datetime': only_blue.reduce(lastDate, 0),
    };
}

var getBluelytics  = function(cb) {

    var options = {
        host: 'bluelytics.com.ar',
        path: '/json/last_price',
    };

    var req = http.request(options, function(res) {
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            var ret;
            try {
                ret = JSON5.parse(str);    
            }
            catch (err) {
               return cb( 'Bad JSON from ' + options.host + 
                               options.path + ":" + err + "\n" + str );
            }
            var ret_sum = avg_blue(ret);

            if ( ret_sum && !isNaN(ret_sum.sell) && !isNaN(ret_sum.buy) ) {
                cb(null, ret_sum);
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

  if (typeof (opts) == 'function') {
    cb = opts;

    getLaNacion(function(err, v){
        if(v) return cb(null, v);

        getBluelytics(function(err, v) {
          if (v) return cb(null, v);

          getDolarBlue(function(err, v) {
            if (err) {
                cb(err);
            } else if (v) {
                cb(null, v);
            } else {
                cb('no data');
            }
          });
        });
    });
    
  }

  else {
    switch(opts.src) {
      case 'Bluelytics':
        getBluelytics(cb);
        break;
      case 'LaNacion':
        getLaNacion(cb);
        break;
      case 'DolarBlue':
        getDolarBlue(cb);
        break;
      default:
        cb('Unknown source provided:' + opts.src);
    }
  }
};

exports.getData = getData;
