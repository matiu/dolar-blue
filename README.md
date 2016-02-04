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

The following is an example of the JavaScript object returned by a successful result:

``` javascript
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

Add support for additional data sources.

## Licence

```
The MIT License (MIT)

Copyright (c) 2014 Matias Alejo Garcia.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
