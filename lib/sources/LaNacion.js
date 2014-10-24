var http = require('http');

exports.getData =  function(cb) {

  var options = {
    name: 'LaNacion',
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
      ret.source = {name: options.name, uri: 'http://'+options.host + options.path}

      try {
        // LaNacion uses JSONP, strip the function wrapper to get JSON
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
            source: options.name,
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
