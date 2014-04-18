
var http = require('http');
var JSON5 = require('json5');
var async = require('async');


var getDolarBlue = function (cb) {
    var URL='www.eldolarblue.net';

    var options = {
        host: URL,
        path: '/getDolarBlue.php?as=json'
    };

    http.request(options, function(res) {
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            
            var ret;
            try {
//                console.log(str);
                ret = JSON5.parse(str);    
            }
            catch (err) {
               throw new Error( 'Bad JSON from ' + URL + ":" + err + "\n" + str );
            }

            if ( ret.exchangerate ) {
                cb({
                    buy: ret.exchangerate.buy,
                    sell: ret.exchangerate.sell,
                    datetime: new Date(ret.datetime)
                });
            }
            else {
                console.log('Unexpected response from ' + options.host + options.path );
                cb(null)
            }
        });
 
    }).end();
};


var getLaNacion  = function(cb) {

    var options = {
        host: 'contenidos.lanacion.com.ar',
        path: '/json/dolar',
    };

    http.request(options, function(res) {
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            var ret;
            try {
//                console.log(str);
                //JSONP to JSON
                str = str.substr(19,str.length-19-2);
                ret = JSON5.parse(str);    
            }
            catch (err) {
               throw new Error( 'Bad JSON from ' + options.host + 
                               options.path + ":" + err + "\n" + str );
            }

            if ( ret.InformalVentaValue ) {
                cb({
                    buy: ret.InformalVentaValue.replace(/,/,'.'),
                    sell: ret.InformalCompraValue.replace(/,/,'.'),
                    datetime: new Date(ret.Date),
                });
            }
            else {
                console.log('Unexpected response from ' + options.host + options.path );
                cb(null)
            }
        });
    }).end();
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

    http.request(options, function(res) {
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
               throw new Error( 'Bad JSON from ' + options.host + 
                               options.path + ":" + err + "\n" + str );
            }
            var ret_sum = avg_blue(ret);

            if ( ret_sum ) {
                cb(ret_sum);
            }
            else {
                console.log('Unexpected response from ' + options.host + options.path );
                cb(null)
            }
        });
    }).end();
};


var getData = function (opts, cb) {

  if (typeof (opts) == 'function') {
    cb = opts;

    getLaNacion(function(v){
        if(v) return cb(v);

        getBluelytics(function(v) {
          if (v) return cb(v);

          return getDolarBlue(cb);
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
        throw new Error('Unknown source provided:' + opts.src);
    }
  }
};

exports.getData = getData;
