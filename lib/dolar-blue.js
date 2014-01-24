
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
                    datetime:ret.datetime
                });
            }
            else {
                throw new Error( 'Unexpected response from ' + URL );
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
                console.log(str);
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
                    datetime: ret.Date,
                });
            }
            else {
                throw new Error( 'Unexpected response from ' + URL );
            }
        });
    }).end();
};


var getData = function (opts, cb) {

  if (typeof (opts) == 'function') {
    cb = opts;

    getLaNacion(function(v) {
      if (v) return cb(v);

      return getDolarBlue(cb);
    });
  }

  else {
    switch(opts.src) {
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
