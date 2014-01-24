var assert = require("assert")
var dolarblue = require('../lib/dolar-blue');

describe('exchange rates', function(){
    this.timeout(5000);
  
  
    describe('getData', function(){

        
        it('should return current dolar blue BUY and SELL cotization, an datetime', function(done){
            dolarblue.getData(function(data) {
                assert.ok( data.buy > 0);
                assert.ok( data.sell > 0);


                var d = new Date(data.datetime);
                assert.ok( d > new Date(0) );
                var before =  new Date('2013-12-16 18:00:00');
                assert.ok( d > before);
                done();
            });
        });
    });

    describe('getData({src:LaNacion})', function(){
        it('should return current dolar blue BUY and SELL cotization, an datetime', function(done){
            dolarblue.getData({src:'LaNacion'}, function(data) {
                assert.ok( data.buy > 0);
                assert.ok( data.sell > 0);


                var d = new Date(data.datetime);
                assert.ok( d > new Date(0) );
                var before =  new Date('2013-12-16 18:00:00');
                assert.ok( d > before);
                done();
            });
        });
    });

    describe.skip('getData({src:DolarBlue})', function(){
        it('should return current dolar blue BUY and SELL cotization, an datetime', function(done){
            dolarblue.getData({src:'DolarBlue'}, function(data) {
                assert.ok( data.buy > 0);
                assert.ok( data.sell > 0);


                var d = new Date(data.datetime);
                assert.ok( d > new Date(0) );
                var before =  new Date('2013-12-16 18:00:00');
                assert.ok( d > before);
                done();
            });
        });
    });


    describe('getData({src:ERROR})', function(){
        it('should throw error', function(done){
            try {
              dolarblue.getData({src:'ERROR'}, done);
            } catch (e) { 
                assert.ok( e );
                done();
            }
        });
    });


});



