dolar-blue
==========

API to get the current [*dolar blue*](https://es.wikipedia.org/wiki/D%C3%B3lar_blue) rate in Argentina, from various sources.


## Synopsis

``` javascript
var dolarblue = require('dolar-blue');

dolarblue(function (err, data) {
    if (err) { console.log("Error: " + err);}

    console.log(data.date + ": el dolar blue esta a "  + data.rates.buy  + " - "  + data.rates.sell);
    console.log('\tsource: ' + data.source.name + ', last update: ' + data.rates.date);
    console.log("\tDebería comprar?");
});

```

## API

### dolarblue( callback(err, data) )

Query all supported sources and return results from the most recently updated source.

#### Example Response:

``` json
{ date: Fri Oct 24 2014 14:27:32 GMT-0700 (PDT),
  source: 
   { name: 'LaNacion',
     uri: 'http://contenidos.lanacion.com.ar/json/dolar' },
  data: 
   { Date: '2014-10-24T00:00:00-03:00',
     CasaCambioVentaValue: '8,49',
     BolsaCompraValue: '13,37',
     BolsaVentaValue: '13,37',
     InformalVentaValue: '14,7',
     CasaCambioCompraValue: '8,49',
     InformalCompraValue: '14,58' },
  rates: 
   { buy: 14.58,
     sell: 14.7,
     source: 'LaNacion',
     date: Thu Oct 23 2014 20:00:00 GMT-0700 (PDT) },
  LaNacion: 
   { Date: '2014-10-24T00:00:00-03:00',
     CasaCambioVentaValue: '8,49',
     BolsaCompraValue: '13,37',
     BolsaVentaValue: '13,37',
     InformalVentaValue: '14,7',
     CasaCambioCompraValue: '8,49',
     InformalCompraValue: '14,58' } }
```

#### Notes:

Date values are in ISO8601 format and are suitable for
``` javascript
    var date = new Date(data.date);
```

Alternatively, you can explicitly specify a source to use (see list of sources below for acceptable values):

``` javascript
dolarblue({src:"LaNacion"}, callback);
dolarblue({src:"Bluelytics"}, callback);
```

## Sources

* [LaNacion](http://contenidos.lanacion.com.ar/json/dolar)
* [Bluelytics](http://api.bluelytics.com.ar/json/last_price)

## TODO
Support more data sources.

## Licence
MIT
