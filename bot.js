/*global require*/


global.bot = (function() {

	console.log("Attempting to start bot");

	var twitter = require('ntwitter');
	var spawn = require('child_process').spawn;
	var BOOP = ["BEEP BOOP BEEP","BEEPITY BOP","BLIP BLOOP","BEEPITY BOOP"];

	// load in credentials securely (not kept in github)
	var credentials = require("./credentials.js");
	var twit = new twitter(credentials);

	// include sentience communication
	var sentience = require("./bot-sentience.js");
	twit.stream("statuses/filter", { track: "@taitbot" }, function(stream) {
		stream.on("data", function(data) {
			console.log("Received tweet from @" + data.user.screen_name);
			console.log("  saying: " + data.text);
			sentience.parseTweet(data.text,data.user.screen_name);
		});
	});

	var postTweet = function(msg) {
		console.log("Attempting to post tweet: " + msg);
		twit.updateStatus(msg, function(err) {
		    if (err) {
		    	console.log('Twitter error: ' + err);
	    	}
		});
	};

	var getBOOP = function() {
		return BOOP[Math.round(Math.random()*(BOOP.length-1))];
	};

	var Scraper = function(params) {
		var trigger = function() {
			console.log("Attempt to run phantomjs process: " + params.url);
			var childProcess = spawn("phantomjs", [params.url]);
			childProcess.stdout.setEncoding('utf8');
			childProcess.stdout.on('data', function(data) {
				console.log("  - Receiving data: ",data);
				var str_phantom_output = data.toString();
				params.callback(str_phantom_output);
			});
			childProcess.stdout.on('err', function(data) {
				console.log("  - Receiving error data: ",data);
				var str_phantom_output = data.toString();
				params.error(str_phantom_output);
			});
		};
		setInterval(function() {
			var now = new Date();
			var isWeekend = (now.getDay() === 0 || now.getDay() === 6);
			var isWeekday = (!isWeekend);
			for (var i = 0, len = params.timing.range.length; i < len; i++) {
				if (params.timing.weekday && !isWeekday) {
					// fail
					break;
				}
				if (params.timing.weekend && !isWeekend) {
					// fail
					break;
				}
				if (now.getHours() >= params.timing.range[i][0] && now.getHours() < params.timing.range[i][1]) {
					// success
					trigger();
					break;
				}	
			}
		},params.timing.interval);
		return {
			trigger: trigger
		};
	};

	// run train check every five minutes if
	// it's between 7am-8am, or 5pm-6pm on a weekday
	var trainScraper  = new Scraper({
		url: "Metro/scrape.js",
		callback: function(data) {
			console.log(data);
			var str_phantom_output = data.toString();
			var msg = "@taitems '" + str_phantom_output + "' on Pakenham line. " + getBOOP();
			postTweet(msg);
		},
		error: function(data) {
			console.error(data);
		},
		timing: {
			weekdays: true,
			interval: (5*60*1000), // 5 minutes
			range: [
				[7,8],
				[17,18]
			]
		}
	});

	// run house scraper every 2 hours
	// on weekdays only
	var houseScraper  = new Scraper({
		url: "REA/scrape.js",
		callback: function(data) {
			var items = JSON.parse(data);
			console.log("items.length: ",items.length);
			for (var i = 0, len = items.length; i < len; i++) {
				console.log(items[i]);
				var msg = "@taitems @laurenmsharp http://realestate.com.au/" + items[i].id + " " + getBOOP();
				postTweet(msg);
			}
		},
		error: function(data) {
			console.error(data);
		},
		timing: {
			weekdays: true,
			interval: (2*60*60*1000), // 2 hours
			range: [
				[9,23]
			]
		}
	});

	console.log("Bot load complete");

	return {
		postTweet: postTweet,
		trainScraper: trainScraper,
		houseScraper: houseScraper
	}

}());