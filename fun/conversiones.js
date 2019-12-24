
module.exports = { 
    stringToXml: function(cadena){
        
        var DOMParser = require('xmldom').DOMParser;
        var parser = new DOMParser();
        return parser.parseFromString(cadena, 'text/xml');
    },
    xmlToJson: function(xml) {
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		console.log("linea 15");
		if (xml.attributes.length > 0) {
			console.log("linea 17");
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		console.log("linea 25");
		obj = xml.nodeValue;
	}
	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			console.log("item"+i+": " + item + "\n");
			var nodeName = item.nodeName;
			
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
  }
}