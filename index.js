'use strict';
let https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();
const config = require("./config.json");
let subscriptionKey = config["subscription_key"];
let host = config["subscription_endpoint"];
let path = config["search_url"];
var port = process.env.PORT || 3000;

app.get('/image', function(req, res, next){
   var search = req.query.query;
   console.log(host, path, subscriptionKey) 

   let request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(search),
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    let response_handler = function (response) {
        let body = '';

        response.on('data', function (d) {
            body += d;
        });
        
        response.on('end', function () {
            let imageResults = JSON.parse(body);
            console.log(imageResults);
            let firstImageResult = imageResults.value[0];
            console.log(`First image thumbnail url: ${firstImageResult.thumbnailUrl}`);
            var result = {image_url: firstImageResult.thumbnailUrl};
            res.status(200).send(JSON.stringify(result));
        });

        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };

    let request = https.request(request_params, response_handler);
    request.end();


});

app.listen(port, function () {
    console.log("== Server is listening on port", port);
  });



