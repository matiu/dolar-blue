
var http = require('http');
var JSON5 = require('json5');

var URL='www.eldolarblue.net';

function getData (callback) {

    var options = {
        host: URL,
        path: '/getDolarBlue.php?as=json'
    };

    http.request(options, function(res) {
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            
            var ret;
            try {
//                console.log(str);
                ret = JSON5.parse(str);    
    
                if ( ret.exchangerate ) {
                    callback({
                        buy: ret.exchangerate.buy,
                        sell: ret.exchangerate.sell,
                        datetime:ret.datetime
                    });
                }
                else {
                    throw new Error( 'Unexpected response from ' + URL );
                }
            }
            catch (err) {
               throw new Error( 'Bad JSON from ' + URL + ":" + err + "\n" + str );
            }
          
        });
 
    }).end();
}

exports.getData = getData;
