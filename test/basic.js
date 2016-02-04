var assert = require('assert');
var dolarblue = require('../lib/dolar-blue');
var nock = require('nock');
var nocks = require('./util/nocks').nocks;
var should = require('chai').should();
var sinon = require('sinon');


describe('Exchange rates', function() {

  describe('::getData', function() {

    it('should prefer data from LaNacion if LaNacion\'s data is more recent', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.newer();
      nocks.Bluelytics.normal();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data.LaNacion);
        data.LaNacion.should.deep.equal({
          Date: '2016-01-25T00:00:00',
          CasaCambioVentaValue: '14,06',
          BolsaCompraValue: '',
          BolsaVentaValue: '',
          InformalVentaValue: '',
          CasaCambioCompraValue: '13,69',
          InformalCompraValue: ''
        });
        data.rates.should.deep.equal({
          buy: 13.69,
          sell: 14.06,
          source: 'LaNacion',
          date: new Date('2016-01-25T00:00:00')
        });
        done();
      });
    });

    it('should prefer data from Bluelytics if Bluelytics\'s data is more recent', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.normal();
      nocks.Bluelytics.newer();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data.Bluelytics);
        data.Bluelytics.should.deep.equal([{
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
        data.rates.should.deep.equal({
          buy: 14.0667,
          sell: 14.35,
          source: 'Bluelytics',
          date: new Date('2016-01-25T00:00:00')
        });
        done();
      });
    });

    it('should return current dolar blue BUY and SELL rate, and a datetime', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.newer();
      nocks.Bluelytics.normal();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.exist(data.LaNacion);
        data.LaNacion.should.deep.equal({
          Date: '2016-01-25T00:00:00',
          CasaCambioVentaValue: '14,06',
          BolsaCompraValue: '',
          BolsaVentaValue: '',
          InformalVentaValue: '',
          CasaCambioCompraValue: '13,69',
          InformalCompraValue: ''
        });
        data.rates.should.deep.equal({
          buy: 13.69,
          sell: 14.06,
          source: 'LaNacion',
          date: new Date('2016-01-25T00:00:00')
        });
        done();
      });
    });

    it('should ignore incomplete response from LaNacion', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.incomplete();
      nocks.Bluelytics.normal();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.not.exist(data.LaNacion);
        should.exist(data.Bluelytics);
        data.Bluelytics.should.deep.equal([{
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
        data.rates.should.deep.equal({
          buy: 14.0667,
          sell: 14.35,
          source: 'Bluelytics',
          date: new Date('2016-01-04T09:50:10.971586-03:00')
        });
        done();
      });
    });

    it('should ignore incomplete response from Bluelytics', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.normal();
      nocks.Bluelytics.incomplete();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.not.exist(data.LaNacion);
        should.exist(data.Bluelytics);
        data.Bluelytics.should.deep.equal([{
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
        data.rates.should.deep.equal({
          buy: 13.99,
          sell: 14.39,
          source: 'Bluelytics',
          date: new Date('2016-01-04T09:50:04.293272-03:00')
        });
        done();
      });
    });

    it('should handle bad response from LaNacion', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.bad();
      nocks.Bluelytics.normal();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.not.exist(data.LaNacion);
        should.exist(data.Bluelytics);
        data.Bluelytics.should.deep.equal([{
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
        data.rates.should.deep.equal({
          buy: 14.0667,
          sell: 14.35,
          source: 'Bluelytics',
          date: new Date('2016-01-04T09:50:10.971586-03:00')
        });
        done();
      });
    });

    it('should handle bad response from Bluelytics', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.normal();
      nocks.Bluelytics.bad();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.not.exist(data.Bluelytics);
        should.exist(data.LaNacion);
        data.LaNacion.should.deep.equal({
          Date: '2016-01-04T00:00:00',
          CasaCambioVentaValue: '14,06',
          BolsaCompraValue: '',
          BolsaVentaValue: '',
          InformalVentaValue: '',
          CasaCambioCompraValue: '13,69',
          InformalCompraValue: ''
        });
        data.rates.should.deep.equal({
          buy: 13.69,
          sell: 14.06,
          source: 'LaNacion',
          date: new Date('2016-01-04T00:00:00')
        });
        done();
      });
    });

    it('should handle bad response from both', function(done) {
      // Prepare nocks
      nocks.LaNacion.bad();
      nocks.Bluelytics.bad();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data');
        done();
      });
    });

    it('should try Bluelytics after 404 from LaNacion', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.notfound();
      nocks.Bluelytics.normal();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.not.exist(data.LaNacion);
        should.exist(data.Bluelytics);
        data.Bluelytics.should.deep.equal([{
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
        data.rates.should.deep.equal({
          buy: 14.0667,
          sell: 14.35,
          source: 'Bluelytics',
          date: new Date('2016-01-04T09:50:10.971586-03:00')
        });
        done();
      });
    });

    it('should exclude el cronista if missing from Bluelytics', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.notfound();
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
        "value_avg": 14.18,
        "value_sell": 14.38,
        "value_buy": 13.98
      }]);

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.not.exist(data.LaNacion);
        should.exist(data.Bluelytics);
        data.Bluelytics.should.deep.equal([{
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
          "value_avg": 14.18,
          "value_sell": 14.38,
          "value_buy": 13.98
        }]);
        data.rates.should.deep.equal({
          buy: 13.985,
          sell: 14.385,
          source: 'Bluelytics',
          date: new Date('2016-01-04T09:50:09.274220-03:00')
        });
        done();
      });
    });

    it('should handle 404 response from all sources', function(done) {
      // Prepare nocks
      nocks.LaNacion.notfound();
      nocks.Bluelytics.notfound();

      // Execute
      dolarblue.getData(function(err, data) {
        var after = new Date();
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data');
        done();
      });
    });
  });

  describe('::getData({src:LaNacion})', function() {

    it('should return current dolar blue BUY and SELL rate, and a datetime', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.LaNacion.normal();

      // Execute
      dolarblue.getData({
        src: 'LaNacion'
      }, function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.exist(data.LaNacion);
        data.LaNacion.should.deep.equal({
          Date: '2016-01-04T00:00:00',
          CasaCambioVentaValue: '14,06',
          BolsaCompraValue: '',
          BolsaVentaValue: '',
          InformalVentaValue: '',
          CasaCambioCompraValue: '13,69',
          InformalCompraValue: ''
        });
        data.rates.should.deep.equal({
          buy: 13.69,
          sell: 14.06,
          source: 'LaNacion',
          date: new Date('2016-01-04T00:00:00')
        });
        done();
      });
    });

    it('should handle bad response from LaNacion', function(done) {

      // Prepare nocks
      nocks.LaNacion.bad();

      // Execute
      dolarblue.getData({
        src: 'LaNacion'
      }, function(err, data) {
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data');
        done();
      });
    });

    it('should handle 404 response from LaNacion', function(done) {

      // Prepare nocks
      nocks.LaNacion.notfound();

      // Execute
      dolarblue.getData({
        src: 'LaNacion'
      }, function(err, data) {
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data');
        done();
      });
    });
  });

  describe('::getData({src:Bluelytics})', function() {

    it('should ignore data from la nacion', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.Bluelytics.normal();

      // Execute
      dolarblue.getData({
        src: 'Bluelytics'
      }, function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.not.exist(data.LaNacion);
        should.exist(data.Bluelytics);
        data.Bluelytics.should.deep.equal([{
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
        data.rates.should.deep.equal({
          buy: 14.0667,
          sell: 14.35,
          source: 'Bluelytics',
          date: new Date('2016-01-04T09:50:10.971586-03:00')
        });
        done();
      });
    });

    it('should return current dolar blue BUY and SELL rate, and a datetime', function(done) {
      var before = new Date();

      // Prepare nocks
      nocks.Bluelytics.normal();

      // Execute
      dolarblue.getData({
        src: 'Bluelytics'
      }, function(err, data) {
        var after = new Date();
        should.not.exist(err);
        should.exist(data);
        should.exist(data.date);
        should.exist(data.rates);
        should.exist(data.rates.buy);
        should.exist(data.rates.sell);
        data.date.getTime().should.be.at.least(before.getTime());
        data.date.getTime().should.be.at.most(after.getTime());
        should.not.exist(data.LaNacion);
        should.exist(data.Bluelytics);
        data.Bluelytics.should.deep.equal([{
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
        data.rates.should.deep.equal({
          buy: 14.0667,
          sell: 14.35,
          source: 'Bluelytics',
          date: new Date('2016-01-04T09:50:10.971586-03:00')
        });
        done();
      });
    });

    it('should handle bad response from bluelytics', function(done) {
      // Prepare nocks
      nocks.Bluelytics.bad();

      // Execute
      dolarblue.getData({
        src: 'Bluelytics'
      }, function(err, data) {
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data')
        done();
      });
    });

    it('should handle 404 response from Bluelytics', function(done) {
      // Prepare nocks
      nocks.Bluelytics.notfound();

      // Execute
      dolarblue.getData({
        src: 'Bluelytics'
      }, function(err, data) {
        console.log(data);
        console.log(err);
        should.exist(err);
        should.not.exist(data);
        err.should.equal('no data');
        done();
      });
    });
  });


  describe('::getData({src:ERROR})', function() {
    it('should throw error', function(done) {
      dolarblue.getData({
        src: 'ERROR'
      }, function(err, data) {
        assert.ok(err === 'Unknown source provided: ERROR');
        assert.ok(!data);
        done();
      });
    });
  });

});
