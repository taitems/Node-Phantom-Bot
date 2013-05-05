/*global require*/

var page = require('webpage').create();
var fs = require("fs");
// a sample mobile search
var url = "http://m.realestate.com.au/buy/in-melbourne%2c+vic+3000/list-1";
var usedID = [];
var newItems = [];

// handler
var parseResults = function(arr) {
	for (var i = 0; i < arr.length; i++) {
		var alreadySeen = checkID(arr[i].id);
		if (alreadySeen) {
			// already seen this!
		} else {
			// a new listing, push to array
			usedID.push(arr[i].id);
			newItems.push(arr[i]);
		}
	}
	if (newItems.length) {
		fs.write("/dev/stdout", JSON.stringify(newItems) + "\n");
	}
	newItems = [];
	saveList();
};

// write to file
var saveList = function() {
	fs.write("REA/stored.json","[" + usedID + "]");
};

// check if it's already seen
var checkID = function(id) {
	var status = false;
	for (var i = 0; i < usedID.length; i++) {
		if(usedID[i] == id) {
			status = true;
			break;
		}
	};
	return status;
};


// fetch stored IDs
var storedList = fs.read("REA/stored.json");
if (storedList.length) {
	usedID = JSON.parse(storedList);
}

// fetch page
page.open(url, function (status) {
    // page is loaded!
    var result = page.evaluate(function () {
        var listings = document.querySelectorAll("[data-galleryid]");
        var arr = [];
		for (var i = 0; i < listings.length; i++) {
			var obj = {
				//title: listings[i].getElementsByTagName("a")[0].innerText,
				id: listings[i].getAttribute("data-galleryid")
			};
			arr.push(obj);
		};
		return arr;
    });
    parseResults(result);
    phantom.exit();
});