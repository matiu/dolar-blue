// 
// Common nocks (https://github.com/pgte/nock) for use in testing API
//
var nock = require('nock');

exports.nocks = {
  LaNacion: {
    normal: function() {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200,
        'dolarjsonpCallback({"Date":"2016-01-04T00:00:00",' +
        '"CasaCambioVentaValue":"14,06",' +
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"",' +
        '"CasaCambioCompraValue":"13,69",' +
        '"InformalCompraValue":""});'
      );
    },
    newer: function() {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200,
        'dolarjsonpCallback({"Date":"2016-01-25T00:00:00",' +
        '"CasaCambioVentaValue":"14,06",' +
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"",' +
        '"CasaCambioCompraValue":"13,69",' +
        '"InformalCompraValue":""});'
      );
    },
    incomplete: function() {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200,
        'dolarjsonpCallback({"Date":"2016-01-04T00:00:00",' +
        '"CasaCambioVentaValue":"",' +
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"",' +
        '"CasaCambioCompraValue":"",' +
        '"InformalCompraValue":""});'
      );
    },
    notfound: function() {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(404);
    },
    bad: function() {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200,
        'blah_blah_blah_abcd1234'
      );
    }
  },

  Bluelytics: {
    normal: function() {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(200, [{
        "date": "2016-01-04T09:50:10.971586-03:00",
        "source": "elcronista",
        "value_avg": 14.255,
        "value_sell": 14.28,
        "value_buy": 14.23
      }, {
        "date": "2016-01-04T09:50:04.293272-03:00",
        "source": "ambito_financiero",
        "value_avg": 14.19,
        "value_sell": 14.39,
        "value_buy": 13.99
      }, {
        "date": "2015-12-17T10:00:07.974569-03:00",
        "source": "la_nacion",
        "value_avg": 1,
        "value_sell": 1,
        "value_buy": 1
      }, {
        "date": "2016-01-04T09:50:09.274220-03:00",
        "source": "oficial",
        "value_avg": 14.18,
        "value_sell": 14.38,
        "value_buy": 13.98
      }]);
    },
    newer: function() {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(200, [{
        "date": "2016-01-25T00:00:00",
        "source": "elcronista",
        "value_avg": 14.255,
        "value_sell": 14.28,
        "value_buy": 14.23
      }, {
        "date": "2016-01-25T00:00:00",
        "source": "ambito_financiero",
        "value_avg": 14.19,
        "value_sell": 14.39,
        "value_buy": 13.99
      }, {
        "date": "2016-01-25T00:00:00",
        "source": "la_nacion",
        "value_avg": 1,
        "value_sell": 1,
        "value_buy": 1
      }, {
        "date": "2016-01-25T00:00:00",
        "source": "oficial",
        "value_avg": 14.18,
        "value_sell": 14.38,
        "value_buy": 13.98
      }]);
    },
    incomplete: function() {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(200, [{
        "date": "2016-01-04T09:50:10.971586-03:00",
        "source": "elcronista",
        "value_avg": '',
        "value_sell": '',
        "value_buy": ''
      }, {
        "date": "2016-01-04T09:50:04.293272-03:00",
        "source": "ambito_financiero",
        "value_avg": 14.19,
        "value_sell": 14.39,
        "value_buy": 13.99
      }, {
        "date": "2015-12-17T10:00:07.974569-03:00",
        "source": "la_nacion",
        "value_avg": 1,
        "value_sell": 1,
        "value_buy": 1
      }, {
        "date": "2016-01-04T09:50:09.274220-03:00",
        "source": "oficial",
        "value_avg": '',
        "value_sell": '',
        "value_buy": ''
      }]);
    },
    notfound: function() {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(404);
    },
    bad: function() {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(200,
        'blah_blah_blah_abcd1234'
      );
    }
  }
}
