require('custom-env').env('url')
const express = require("express");
const servicios = require("../servicios/callServices.js");
var bodyParser = require('body-parser');
const filtros = require('../fun/filtros');
const app = express();

var jsonParser = bodyParser.json();
var comuna = "";
var local = "";

function validaData(request, parametros) {
    var mensaje = '';

    JSON.parse(JSON.stringify(request), (key, value) => {
        if (key + ''.trim() !== '') 
        {
            if (parametros.indexOf(key)<0)
                mensaje = 'Parametros incorrectos o faltan parametros ';
        }
    });
    return mensaje;
}

app.post(process.env.URL_API_FARMACIA_TURNO, jsonParser, function(req, res){
    if (res.statusCode !== 200) {
        res.send({ "salida": { "codigo": res.statusCode, "mensaje": "Error - " + res.statusMessage } });
    }

    if (!req.body)
        res.send({ "salida": { "codigo": 400, "mensaje": "Info - No se encontraron parametros en body" } });

    var valida = validaData(req.body, process.env.ARRAY_PARAMETROS_ENTRADA_FARMACIAS_TURNO);
    if (valida !== '')
        res.send({ "salida": { "codigo": 201, "mensaje": "Info - " + valida } });

    if(req.body.comuna!==undefined)
        comuna = req.body.comuna;

    if(req.body.local!==undefined)
        local = req.body.local;

    let cabeceras = { "Content-Type": "application/json" };
    var parametros = { "id_region": req.body.id_region,
                       "tipoConsumo": req.body.tipoConsumo
                     };
    var url = process.env.URL_API_BASE + ":" + process.env.URL_API_PUERTO + process.env.URL_API_COMUNA;
    servicios.invocaServicioPOST(url, cabeceras,"rawBody", parametros, function(resultado, codRespuesta)
    {
        if(codRespuesta===200)
        {
            var urlTurno = process.env.URL_FARMACIAS_X_COMUNA;
            let cabecerasTurno = {};
            var parametrosTurno = { "id_region": req.body.id_region};
            servicios.invocaServicioGET(urlTurno, cabecerasTurno, "queryString", 
            parametrosTurno, function(resultadoTurno, codRespuestaTurno)
            {
                if(codRespuestaTurno===200)
                {
                    var objSalida = [];
                    var obj1 = JSON.parse(JSON.parse(JSON.stringify(resultadoTurno)));
                    for(var i in obj1) 
                    { 
                        var map = new Map(Object.entries(obj1[i]));
                        if(map.get("comuna_nombre").toUpperCase().indexOf(comuna.trim().toUpperCase())>-1 && comuna.trim().length>0)
                        {
                            objSalida.push(obj1[i]);
                        }
                        if(map.get("local_nombre").toUpperCase().indexOf(local.trim().toUpperCase())>-1 && local.trim().length>0)
                        {
                            objSalida.push(obj1[i]);
                        }                     
                    }
                    if(objSalida.length>0)                    
                        res.send({ "salida": { "codigo": codRespuestaTurno, "mensaje": objSalida } });
                    else
                        res.send({ "salida": { "codigo": 201, "mensaje": "No se encontraron registros" } });
                }
                else
                    res.send({ "error": { "codigo": codRespuestaTurno, "mensaje": "Info - " + resultadoTurno } });
            });
        }else
            res.send({ "error": { "codigo": codRespuesta, "mensaje": "Info - " + resultado } });
    });
});

app.post(process.env.URL_API_COMUNA, jsonParser, function (req, res) {
    if (res.statusCode !== 200) {
        res.send({ "salida": { "codigo": res.statusCode, "mensaje": "Error - " + res.statusMessage } });
    }

    if (!req.body)
        res.send({ "salida": { "codigo": 400, "mensaje": "Info - No se encontraron parametros en body" } });

    var valida = validaData(req.body, process.env.ARRAY_PARAMETROS_ENTRADA_COMUNAS_REGION);
    if (valida !== '')
        res.send({ "salida": { "codigo": 201, "mensaje": "Info - " + valida } });

    var url = process.env.URL_COMUNAS;
    let cabeceras = { "Content-Type": "multipart/form-data" };
    let parametros = { "reg_id": req.body.id_region, "tipoConsumo": req.body.tipoConsumo };

    servicios.invocaServicioPOST(url, cabeceras, "formData", parametros, function (resultado, codRespuesta) {
        if (req.body.tipoConsumo === 'A') 
        {
            const response = "<option>"
                + resultado.replace(" selected", "") + "</option>";
            const xml2js = require('xml2js');
            xml2js.parseString(response, function (err, result) {
                if (err) {
                    return '{"error":"' + err + '"}';
                }
                const json = JSON.stringify(result, ['salida', 'option', '_']);
                var jsonTransformado = '{"option":{';
                var v = 0;
                var objSalida = [];
                JSON.parse(json, (key, value) => {
                    if (key === '_') 
                    {
                        var obj = new Object();
                        if(v>0)
                        {          
                            obj = {"value": value};
                            objSalida.push(obj);                                    
                        }
                        v+=1;
                    }
                });
                res.send({ "salida": { "codigo": res.statusCode, "mensaje": objSalida} });
            });
        }
        else if (req.body.tipoConsumo === 'H') {
            res.send({ "salida": { "codigo": res.statusCode, "mensaje": resultado } });
        }
        else {
            res.send({ "salida": { "codigo": 201, "mensaje": "Info - Parametro incorrecto" } });
        }
    });
});

app.listen(process.env.URL_API_PUERTO, "localhost", () => {
    console.log("El servidor está inicializado en el puerto 3000");
});