// 
// Common nocks (https://github.com/pgte/nock) for use in testing API
//
var nock = require('nock');

exports.nocks = {
  LaNacion: {
    normal: function () {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'dolarjsonpCallback({"Date":"2014-08-22T00:00:00",' + 
        '"CasaCambioVentaValue":"8,44",' + 
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"13,7",' +
        '"CasaCambioCompraValue":"8,37",' +
        '"InformalCompraValue":"13,6"});'
      );
    },
    newer: function () {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'dolarjsonpCallback({"Date":"2014-10-01T00:00:00",' + 
        '"CasaCambioVentaValue":"8,44",' + 
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"13,7",' +
        '"CasaCambioCompraValue":"8,37",' +
        '"InformalCompraValue":"13,6"});'
      );
    },
    incomplete: function () {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'dolarjsonpCallback({"Date":"2014-08-22T00:00:00",' + 
        '"CasaCambioVentaValue":"8,44",' + 
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"",' +
        '"CasaCambioCompraValue":"8,37",' +
        '"InformalCompraValue":""});'
      );
    },
    notfound: function () {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(404);
    },
    bad: function () {
      nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'blah_blah_blah_abcd1234'
      );
    }
  },

  Bluelytics: {
    normal: function () {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(200, 
        [{"date": "2014-09-02T15:00:00",
        "source": "dolarblue.net",
        "value_avg": 14.00,
        "value_sell": 14.5,
        "value_buy": 13.5},
        {"date": "2014-09-02T15:00:00",
        "source": "ambito_financiero",
        "value_avg": 15.00,
        "value_sell": 15.5,
        "value_buy": 14.5},
        {"date": "2014-09-02T15:00:00",
        "source": "la_nacion",
        "value_avg": 16.00,
        "value_sell": 16.5,
        "value_buy": 15.5},
        {"date": "2014-09-02T15:00:00",
        "source": "oficial",
        "value_avg": 8.395,
        "value_sell": 8.42,
        "value_buy": 8.37}]
      );
    },
    newer: function () {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(200, 
        [{"date": "2014-11-01T15:00:00",
        "source": "dolarblue.net",
        "value_avg": 14.00,
        "value_sell": 14.5,
        "value_buy": 13.5},
        {"date": "2014-11-01T15:00:00",
        "source": "ambito_financiero",
        "value_avg": 15.00,
        "value_sell": 15.5,
        "value_buy": 14.5},
        {"date": "2014-11-01T15:00:00",
        "source": "la_nacion",
        "value_avg": 16.00,
        "value_sell": 16.5,
        "value_buy": 15.5},
        {"date": "2014-11-01T15:00:00",
        "source": "oficial",
        "value_avg": 8.395,
        "value_sell": 8.42,
        "value_buy": 8.37}]
      );
    },
    incomplete: function () {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(200, 
        [{"date": "2014-09-02T15:00:00",
        "source": "dolarblue.net",
        "value_avg": '',
        "value_sell": '',
        "value_buy": ''},
        {"date": "2014-09-02T15:00:00",
        "source": "ambito_financiero",
        "value_avg": 15.00,
        "value_sell": 15.5,
        "value_buy": 14.5},
        {"date": "2014-09-02T15:00:00",
        "source": "la_nacion",
        "value_avg": '',
        "value_sell": '',
        "value_buy": ''},
        {"date": "2014-09-02T15:00:00",
        "source": "oficial",
        "value_avg": 8.395,
        "value_sell": 8.42,
        "value_buy": 8.37}]
      );
    },
    notfound: function () {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(404);
    },
    bad: function () {
      nock('http://api.bluelytics.com.ar').get('/json/last_price').reply(200, 
        'blah_blah_blah_abcd1234'
      );
    }
  } 
}
