var  Request = require("request");

const querystring = require('querystring');
var reto;
module.exports = {
    invocaServicioPOST: function(url, cabeceras, tipoParametros, parametros, callback)
    {
        switch(tipoParametros)
        {
            case "formData":
                Request.post({
                    "headers": cabeceras,
                    "url": url,
                    "formData": parametros
                }, 
                (error, response, body) => {
                    if(error) 
                    {
                        callback(error, response.statusCode);
                    }
                    callback(body, response.statusCode);
                });  
            break;
            case "rawBody":  
                Request.post({
                    "headers": cabeceras,
                    "url": url,
                    "body": parametros,
                    "json": true
                }, 
                (error, response, body) => {
                    if(error) 
                    {
                        console.log("error: " + error);
                        callback(error, response.statusCode);
                    }
                    callback(body, response.statusCode);
                });  
            break;
        }            
    },
    invocaServicioGET: function(url, cabeceras, tipoParametros, parametros, callback)
    {
        console.log("url: " + url);
        console.log("parametros: " + parametros);
        switch(tipoParametros)
        {
            case "queryString":
                Request.get({
                    "headers":cabeceras,
                    "url":url,
                    "qs":parametros
                }, 
                (error, response, body) => {
                    if(error) 
                    {
                        callback(error, response.statusCode);
                    }
                    callback(body, response.statusCode);
                });  
                break;
        }
    }
}