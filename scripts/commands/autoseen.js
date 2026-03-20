const fs = require("fs-extra");
const pathFile = __dirname + "/cache/autoseen.txt";

if (!fs.existsSync(pathFile)) {
  fs.writeFileSync(pathFile, "false"); // Default OFF
}

module.exports.config = {
  name: "autoseen",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "ALVI",
  description: "Automatically marks all messages as seen (everywhere)",
  commandCategory: "tools",
  usages: "autoseen on/off",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event }) => {
  try {
    const status = fs.readFileSync(pathFile, "utf-8").trim();
    if (status === "true") {
      api.markAsReadAll((err) => {
        if (err) {
          console.error("❌ markAsReadAll failed, fallback to single thread:", err);
          if (event && event.threadID) {
            api.markAsRead(event.threadID, (e) => {
              if (e) console.error("❌ markAsRead fallback error:", e);
            });
          }
        }
      });
    }
  } catch (err) {
    console.error("❌ AutoSeen error:", err);
  }
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const { threadID, messageID } = event;

    if (!args[0]) {
      return api.sendMessage(
        `⚙️ Wrong format!\nUse: ${global.config.PREFIX}autoseen on/off`,
        threadID,
        messageID
      );
    }

    const option = args[0].toLowerCase();

    if (option === "on") {
      fs.writeFileSync(pathFile, "true");
      return api.sendMessage(`✅ ${this.config.name} turned ON 🟢`, threadID, messageID);
    }

    if (option === "off") {
      fs.writeFileSync(pathFile, "false");
      return api.sendMessage(`✅ ${this.config.name} turned OFF 🔴`, threadID, messageID);
    }

    return api.sendMessage(
      `⚙️ Wrong format!\nUse: ${global.config.PREFIX}autoseen on/off`,
      threadID,
      messageID
    );
  } catch (err) {
    console.error("❌ Error in autoseen run():", err);
    return api.sendMessage("❌ Something went wrong!", event.threadID, event.messageID);
  }
};
