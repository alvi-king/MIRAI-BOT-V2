module.exports.config = {
	name: "unsend",
	version: "1.0.3",
	hasPermssion: 0, 
	credits: "ALVI",
	description: "Bot er message unsend korbe (only specific admin)",
	commandCategory: "system",
	usages: "unsend",
	cooldowns: 0
};

module.exports.languages = {
	"vi": {
		"returnCant": "Không thể gỡ tin nhắn của người khác.",
		"missingReply": "Hãy reply tin nhắn cần gỡ."
	},
	"en": {
		"returnCant": "কি unsent করমু replig করে বলো বেবি🫰",
		"missingReply": "Mere Jis Msg ko Unsend Karna Hai Usme Reply Karke Likkho.",
		"notAdmin": "এই কমান্ড শুধু মাএ আমার বস আলভি ব্যবহার করতে পারবেন! তুই এডমিন লেভেলে নাই বুঝলি 🤣🚫"
	}
};

const adminUID = ["100082607436864"]; 

module.exports.run = function({ api, event, getText }) {
	// এডমিন চেক
	if (!adminUID.includes(event.senderID)) {
		return api.sendMessage(getText("notAdmin"), event.threadID, event.messageID);
	}

	// reply ছাড়া unsend করা যাবে না
	if (event.type != "message_reply") 
		return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);

	// শুধু বটের পাঠানো মেসেজ unsend হবে
	if (event.messageReply.senderID != api.getCurrentUserID()) 
		return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);

	// unsend করা হচ্ছে
	return api.unsendMessage(event.messageReply.messageID);
};
