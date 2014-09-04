var assert = require('assert');
var dolarblue = require('../lib/dolar-blue');
var nock = require('nock');
var should = require('chai').should();
var sinon = require('sinon');

describe('exchange rates', function(){  
  
  describe('getData', function(){

    
    it('should return current dolar blue BUY and SELL rate, and a datetime', function(done) {
      var before = new Date;
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'dolarjsonpCallback({"Date":"2014-08-22T00:00:00",' + 
        '"CasaCambioVentaValue":"8,44",' + 
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"13,7",' +
        '"CasaCambioCompraValue":"8,37",' +
        '"InformalCompraValue":"13,6"});'
      );

      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.LaNacion);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        data.LaNacion.should.deep.equal({
          Date: '2014-08-22T00:00:00',
          CasaCambioVentaValue: '8,44',
          BolsaCompraValue: '',
          BolsaVentaValue: '',
          InformalVentaValue: '13,7',
          CasaCambioCompraValue: '8,37',
          InformalCompraValue: '13,6'
        });
        data.rates.should.deep.equal({
          buy: 13.6,
          sell: 13.7,
          source: 'LaNacion',
          date: new Date('2014-08-22T00:00:00')
        });
        done();
      });
    });

    it('should handle incomplete response from lanacion', function(done) {
      var before = new Date();
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'dolarjsonpCallback({"Date":"2014-08-22T00:00:00",' + 
        '"CasaCambioVentaValue":"8,44",' + 
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"",' +
        '"CasaCambioCompraValue":"8,37",' +
        '"InformalCompraValue":""});'
      );

      var bluelytics = nock('http://bluelytics.com.ar').get('/json/last_price').reply(200, 
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

      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.Bluelytics);
        should.not.exist(data.LaNacion);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        data.Bluelytics.should.deep.equal([
          {"date": "2014-09-02T15:00:00",
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
          "value_buy": 8.37}
        ]);
        data.rates.should.deep.equal({
          buy: 14.5,
          sell: 15.5,
          source: 'Bluelytics',
          date: new Date('2014-09-02T15:00:00')
        });
        done();
      });
    });

    it('should handle bad response from lanacion', function(done) {
      var before = new Date();
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'blah_blah_blah_abcd1234'
      );

      var bluelytics = nock('http://bluelytics.com.ar').get('/json/last_price').reply(200, 
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

      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.Bluelytics);
        should.not.exist(data.LaNacion);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        data.Bluelytics.should.deep.equal([
          {"date": "2014-09-02T15:00:00",
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
          "value_buy": 8.37}
        ]);
        data.rates.should.deep.equal({
          buy: 14.5,
          sell: 15.5,
          source: 'Bluelytics',
          date: new Date('2014-09-02T15:00:00')
        });
        done();
      });
    });

    it('should handle bad response from both', function(done) {
      var before = new Date();
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'blah_blah_blah_abcd1234'
      );

      var bluelytics = nock('http://bluelytics.com.ar').get('/json/last_price').reply(200, 
        'blah_blah_blah_abcd1234'
      );

      dolarblue.getData(function(err, data) {
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data');
        done();
      });
    });

    it('should try bluelytics after 404 from lanacion', function(done) {
      var before = new Date();
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(404);
      var bluelytics = nock('http://bluelytics.com.ar').get('/json/last_price').reply(200, 
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

      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.Bluelytics);
        should.not.exist(data.LaNacion);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        data.Bluelytics.should.deep.equal([
          {"date": "2014-09-02T15:00:00",
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
          "value_buy": 8.37}
        ]);
        data.rates.should.deep.equal({
          buy: 14.5,
          sell: 15.5,
          source: 'Bluelytics',
          date: new Date('2014-09-02T15:00:00')
        });
        done();
      });
    });

    it('should exclude la_nacion', function(done) {
      var before = new Date();
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(404);
      var bluelytics = nock('http://bluelytics.com.ar').get('/json/last_price').reply(200, 
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
        "value_avg": 0,
        "value_sell": 0,
        "value_buy": 0},
        {"date": "2014-09-02T15:00:00",
        "source": "oficial",
        "value_avg": 8.395,
        "value_sell": 8.42,
        "value_buy": 8.37}]
      );

      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.Bluelytics);
        should.not.exist(data.LaNacion);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        data.Bluelytics.should.deep.equal([
          {"date": "2014-09-02T15:00:00",
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
          "value_avg": 0,
          "value_sell": 0,
          "value_buy": 0},
          {"date": "2014-09-02T15:00:00",
          "source": "oficial",
          "value_avg": 8.395,
          "value_sell": 8.42,
          "value_buy": 8.37}
        ]);
        data.rates.should.deep.equal({
          buy: 14.0,
          sell: 15.0,
          source: 'Bluelytics',
          date: new Date('2014-09-02T15:00:00')
        });
        done();
      });
    });

    it('should exclude handle 404 to both sources', function(done) {
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(404);
      var bluelytics = nock('http://bluelytics.com.ar').get('/json/last_price').reply(404);
      dolarblue.getData(function(err, data) {
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data');
        done();
      });
    });
  });

  describe('getData({src:LaNacion})', function() {
    it('should return current dolar blue BUY and SELL rate, and a datetime', function(done) {
      var before = new Date();
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'dolarjsonpCallback({"Date":"2014-08-22T00:00:00",' + 
        '"CasaCambioVentaValue":"8,44",' + 
        '"BolsaCompraValue":"",' +
        '"BolsaVentaValue":"",' +
        '"InformalVentaValue":"13,7",' +
        '"CasaCambioCompraValue":"8,37",' +
        '"InformalCompraValue":"13,6"});'
      );
      dolarblue.getData({src:'LaNacion'}, function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.LaNacion);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        data.LaNacion.should.deep.equal({
          Date: '2014-08-22T00:00:00',
          CasaCambioVentaValue: '8,44',
          BolsaCompraValue: '',
          BolsaVentaValue: '',
          InformalVentaValue: '13,7',
          CasaCambioCompraValue: '8,37',
          InformalCompraValue: '13,6'
        });
        data.rates.should.deep.equal({
          buy: 13.6,
          sell: 13.7,
          source: 'LaNacion',
          date: new Date('2014-08-22T00:00:00')
        });
        done();
      });
    });

    it('should handle bad response from LaNacion', function(done) {
      var before = new Date();
      var contenidos = nock('http://contenidos.lanacion.com.ar').get('/json/dolar').reply(200, 
        'blah_blah_blah_abcd1234'
      );

      dolarblue.getData({src:'LaNacion'}, function(err, data) {
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data');
        done();
      });
    });
  });

  describe('getData({src:Bluelytics})', function() {
    it('should return current dolar blue BUY and SELL rate, and a datetime', function(done) {
      var before = new Date();
      var bluelytics = nock('http://bluelytics.com.ar').get('/json/last_price').reply(200, 
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
      dolarblue.getData({src:'Bluelytics'}, function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.Bluelytics);
        should.not.exist(data.LaNacion);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        data.Bluelytics.should.deep.equal([
          {"date": "2014-09-02T15:00:00",
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
          "value_buy": 8.37}
        ]);
        data.rates.should.deep.equal({
          buy: 14.5,
          sell: 15.5,
          source: 'Bluelytics',
          date: new Date('2014-09-02T15:00:00')
        });
        done();
      });
    });

    it('should handle bad response from bluelytics', function(done) {
      var before = new Date();

      var bluelytics = nock('http://bluelytics.com.ar').get('/json/last_price').reply(200, 
        'blah_blah_blah_abcd1234'
      );

      dolarblue.getData({src:'Bluelytics'}, function(err, data) {
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data')
        done();
      });
    });
  });


  describe('getData({src:ERROR})', function() {
    it('should throw error', function(done) {
      dolarblue.getData({src:'ERROR'}, function(err, data) {
        assert.ok(err === 'Unknown source provided: ERROR');
        assert.ok(!data);
        done();
      });
    });
  });


});
