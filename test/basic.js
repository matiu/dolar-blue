var assert = require("assert")
var dolarblue = require('../lib/dolar-blue');

describe('exchange rates from dolar-blue.net', function(){

  
  
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
        })
 
  })
})


