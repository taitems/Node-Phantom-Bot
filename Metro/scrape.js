/*global require*/

var page = require('webpage').create();
var fs = require("fs");
var url = "http://metrotrains.com.au/lines/pakenham";

// fetch page
page.open(url, function (status) {
    // page is loaded!
    var result = page.evaluate(function () {
        return $(".qtab-first").text();
    });
    result = result.replace(/\s/g,"");
    result = result.toLowerCase();
    if (result !== "goodservice") {
		fs.write("/dev/stdout", result);
	}
    phantom.exit();
});