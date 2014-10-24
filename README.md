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

*** callback *** 
    argument is an object with 3 members: buy, sell and datetime. Datetime's format is ISO8601 and is suitable for
``` javascript
    var date = new Date(data.datetime);
```

This will try all currently supported sources (e.g.: [LaNacion](http://contenidos.lanacion.com.ar/json/dolar), [Bluelytics](http://api.bluelytics.com.ar/json/last_price)) and return results from the one with the most recent data.

Alternatively, you can explicitly specify a source to use:

```
dolarblue({src:"LaNacion"}, callback);
dolarblue({src:"Bluelytics"}, callback);
```

## TODO
Support more data sources.

## Licence
MIT
