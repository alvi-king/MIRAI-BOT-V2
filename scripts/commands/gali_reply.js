const fs = require("fs");
module.exports.config = {
	name: "gali",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "ALVI", 
	description: "no prefix",
	commandCategory: "no prefix",
	usages: "abal",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("ALVI BOKASODA")==0 || event.body.indexOf("alvi mc")==0 || event.body.indexOf("chod")==0 || event.body.indexOf("alvi nodir pola")==0 || event.body.indexOf("bc")==0 || event.body.indexOf("alvi re chudi")==0 || event.body.indexOf("alvi re chod")==0 || event.body.indexOf("alvi Abal")==0 || event.body.indexOf("alvi Bokachoda")==0 || event.body.indexOf("alvi madarchod")==0 || event.body.indexOf("alvi re chudi")==0 || event.body.indexOf("আলভি বোকাচোদা")==0) {
		var msg = {
				body: "তোর মতো বোকাচোদা রে আমার বস আলভি চু*দা বাদ দিছে🤣\nআলভি এখন আর hetars চু*দে না🥱😈",
			}
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
