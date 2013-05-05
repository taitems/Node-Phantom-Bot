/*global twit, postTweet*/

var sentience = (function() {

	var parseTweet = function(str,author) {

		var isQuestion = false;

		// basic validation
		if (author !== "taitems" && author !== "laurenmsharp") {
			console.log("not from @taitems or @laurenmsharp");
			return;
		}

		// check if mention or a @reply
		if (str.indexOf("@taitbot") !== 0) {
			console.log("not a prompt");
			return;
		}				

		// check if tweet is a question
		for (var i = 0, len = questionFormat.length; i < len; i++) {
			if (str.indexOf(questionFormat[i]) != -1) {
				isQuestion = true;
				break;
			}
		}

		// evaluate tweet if it matches keywords
		for (var i = 0, len = responses.length; i < len; i++) {
			var possibleResponse = responses[i];
			for (var j = 0, keyLen = possibleResponse.keywords.length; j < keyLen; j++) {
				responseKeyword = possibleResponse.keywords[j];
				// if the tweet contains the keywords
				if (str.indexOf(responseKeyword) != -1) {
					// if it requires a question, but the tweet is not - skip
					if (possibleResponse.isQuestion && !isQuestion) {
						continue;
					}
					// otherwise run it
					possibleResponse.action(str,author);
					break; //TODO: does this only break the inside loop???
				}
			}
		}

	}

	var questionFormat = [
		"?",
		"who",
		"what",
		"when",
		"where",
		"how",
		"why",
		"can",
		"will",
		"did",
		"what is",
		"does"
	];

	var responses = [{
		keywords: ["hello","how are you","greetings","good morning","good afternoon","good evening"],
		action: function(str,author) {
			var responseArr = ["kill all humans BEEP BOOP BEEP","greetings puny human BEEP BOOP BEEP","SILENCE, HUMAN! BEEP BOOP BEEP"];
			var chosenMessage = responseArr[Math.round(Math.random() * responseArr.length)];
			bot.postTweet("@" + author + " " + chosenMessage);
		}
	},{
		keywords: ["train","trains","metro"],
		action: function(str,author) {
			bot.trainScraper.trigger();
		}
	},{
		keywords: ["property","properties","house","houses","realestate","real estate", "REA"],
		action: function(str,author) {
			bot.houseScraper.trigger();
		}
	},{
		isQuestion: true,
		keywords: ["awake","up","uptime","up time","running","sleep"],
		action: function(str,author) {
			getUptime();
		}
	},{
		keywords: ["ping"],
		action: function(str,author) {
			bot.postTweet("@" + author + " pong.");
		}
	}];

	return {
		parseTweet: parseTweet
	}

}());

module.exports = sentience;