const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "wordgame", // command name
  version: "2.1.0", // version
  permission: 0, // public
  credits: "ALVI", // author
  description: "একটি শব্দ অনুমান খেলা (Hint সহ)", // details
  prefix: false, // no prefix required
  premium: false,
  category: "ধাঁধার খেলা", // shown in help
  usages: "wordgame", // usage
  cooldowns: 5, // 5 seconds
  dependencies: {
    "fs": "",
    "path": ""
  }
};

const timeoutDuration = 30 * 1000; // ৩০ সেকেন্ড

function shuffleWord(word) {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join("");
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID } = event;
  const dataPath = path.join(__dirname, "json", "words.json");

  if (!fs.existsSync(dataPath)) {
    return api.sendMessage("❌ | শব্দের ডেটা পাওয়া যায়নি!", threadID, messageID);
  }

  let allItems;
  try {
    allItems = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  } catch (err) {
    console.error("Failed to load word list:", err);
    return api.sendMessage("⚠️ শব্দের ডেটা পড়তে সমস্যা হয়েছে!", threadID, messageID);
  }

  if (args[0]?.toLowerCase() === "guide") {
    return api.sendMessage(
      `🧠 | শব্দ খেলার গাইড ✨\n\n` +
      `➤ কমান্ড চালাতে: wordgame\n` +
      `➤ অগোছানো শব্দ সাজাও এবং সঠিক শব্দ খুঁজে বের করো।\n` +
      `➤ একটি Hint দেওয়া হবে সাহায্যের জন্য।\n` +
      `➤ ভুল দিলে আবার চেষ্টা করো!\n` +
      `➤ ৩০ সেকেন্ডের মধ্যে উত্তর দিতে হবে!\n\n` +
      `⚡ শুভকামনা!`, threadID, messageID
    );
  }

  const item = allItems[Math.floor(Math.random() * allItems.length)];
  const shuffled = shuffleWord(item.word);

  return api.sendMessage(
    `🧩 | শব্দ সাজাও: ${shuffled}\n` +
    `💡 | Hint: ${item.hint}\n\n` +
    `💬 | উত্তর পাঠাতে এই মেসেজে রিপ্লাই করুন!\n` +
    `⏳ | সময়: ৩০ সেকেন্ড!`, 
    threadID,
    async (err, info) => {
      const timeout = setTimeout(() => {
        try {
          api.unsendMessage(info.messageID);
          api.sendMessage(`⏰ | সময় শেষ! সঠিক উত্তর ছিল: "${item.word}"`, threadID);
        } catch (e) {
          console.log("Timeout unsend failed:", e);
        }
      }, timeoutDuration);

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        word: item.word,
        timeout
      });
    }
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, senderID, messageID, body } = event;

  if (senderID !== handleReply.author) return;

  if (body.toLowerCase().trim() === handleReply.word.toLowerCase()) {
    clearTimeout(handleReply.timeout);
    try {
      await api.unsendMessage(handleReply.messageID);
    } catch (e) {
      console.error("Unsend error:", e);
    }
    return api.sendMessage(`✅ | সঠিক উত্তর! দুর্দান্ত কাজ করেছো!`, threadID, messageID);
  } else {
    return api.sendMessage(`❌ | ভুল উত্তর! আবার চেষ্টা করো!`, threadID, messageID);
  }
};
