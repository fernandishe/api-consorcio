

module.exports = { 
    retornaPorValor: function (arr, valor)
    {
        var reto = "";
        var obj  = arr.find(function(elemento)
        {
            console.log("");
             return elemento.value==valor
            });
        if(obj != undefined)
            reto = arr.find(function(elemento){ return elemento.value==valor}).value;
        else 
            reto = "";
            return reto;
    }
}