dolar-blue
==========

API to get the *dolar blue* rate in Argentina, from various sources.


## Synopsis

``` javascript
var dolarblue = require('dolar-blue');

dolarblue(function(data){
    console.log(data.datetime": el dolar blue esta a " + data.buy + " - " + data.sell);
    console.log("Debería comprar?");
});

```

## API

### dolarblue(callback(data))

*** callback *** 
    argument is an object with 3 members: buy, sell and datetime. Datetime's format is ISO8601 and is suitable for 
``` javascript
    var date = new Date(data.datetime);
```

This will try LaNacion first, Bluelytics second, and then dolar-blue.net.

You can especify a source also:
```
dolarblue(src:"LaNacion", callback(data))
dolarblue(src:"DolarBlue", callback(data))
dolarblue(src:"Bluelytics", callback(data))
```

## TODO
Support more data sources.

## Licence
MIT
