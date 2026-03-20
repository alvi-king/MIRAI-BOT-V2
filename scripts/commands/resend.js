const { execSync } = require("child_process");
const fs = require("fs");
const axios = require("axios");

// 🧩 Auto Dependency Installer
const dependencies = ["fs-extra", "axios"];
for (const dep of dependencies) {
  try {
    require.resolve(dep);
  } catch (e) {
    console.log(`📦 Installing missing package: ${dep} ...`);
    execSync(`npm install ${dep}`, { stdio: "inherit" });
  }
}

// ইনস্টল শেষে এখন মডিউলগুলো লোড করো
const fse = require("fs-extra");
const ax = require("axios");

module.exports.config = {
  name: "resend",
  version: "3.1.1",
  hasPermssion: 0,
  credits: "ALVI",
  description: "Auto resend deleted messages (text, image, video, etc.)",
  commandCategory: "system",
  cooldowns: 0,
  hide: true
};

module.exports.handleEvent = async function ({ event, api, Users }) {
  const { threadID, messageID, type, body, attachments } = event;

  if (!global.logMessage) global.logMessage = new Map();

  // 🔹 Step 1: Save all normal messages
  if (type === "message") {
    global.logMessage.set(messageID, {
      msgBody: body || "",
      attachments: attachments || []
    });
  }

  // 🔹 Step 2: Detect unsend event properly
  if (event.logMessageType === "log:message-unsend") {
    const unsendMsgID = event.logMessageData.messageID;
    const msg = global.logMessage.get(unsendMsgID);
    if (!msg) return;

    const senderID = event.logMessageData.messageSenderID;
    const userName = await Users.getNameUser(senderID);

    // 📝 টেক্সট রিমুভ হলে
    if (!msg.attachments || msg.attachments.length === 0) {
      return api.sendMessage(
        {
          body:
            `════════════════\n─꯭─⃝‌‌𝐀𝐥𝐯𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭\n═════════════════\n\n😏 কই গো সবাই দেখো!\n@${userName} এই লুচ্ছায় মাত্র এই টেক্সট টা রিমুভ দিছে 👇\n\n『 ${msg.msgBody || "—খালি মেসেজ—"} 』\n\n══════════════════\n𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 ➤ 𝐀𝐋𝐕𝐈 𝐈𝐒𝐋𝐀𝐌\n══════════════════`,
          mentions: [{ tag: userName, id: senderID }]
        },
        threadID
      );
    }

    // 📸 মিডিয়া রিমুভ হলে
    let attachmentsList = [];
    let count = 0;

    for (const file of msg.attachments) {
      count++;
      const fileUrl = file.url;
      const ext = fileUrl.split(".").pop().split("?")[0];
      const filePath = `${__dirname}/cache/resend_${Date.now()}_${count}.${ext}`;
      const fileData = (await ax.get(fileUrl, { responseType: "arraybuffer" })).data;
      fse.writeFileSync(filePath, Buffer.from(fileData, "utf-8"));
      attachmentsList.push(fse.createReadStream(filePath));
    }

    const resendMsg = {
      body: `════════════════\n─꯭─⃝‌‌𝐀𝐥𝐯𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭\n═════════════════\n\n😏 কই গো সবাই দেখো!\n@${userName}👈 এই লুচ্ছায় মাত্র এই মিডিয়া টা রিমুভ দিছে!👇\n${msg.msgBody ? `\n📄 টেক্সট ছিলো:\n「${msg.msgBody}」` : ""}\n\n══════════════════\n𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 ➤ 𝐀𝐋𝐕𝐈 𝐈𝐒𝐋𝐀𝐌\n══════════════════`,
      attachment: attachmentsList,
      mentions: [{ tag: userName, id: senderID }]
    };

    api.sendMessage(resendMsg, threadID, () => {
      attachmentsList.forEach(file => fse.unlinkSync(file.path)); // 🧹 ক্যাশ ক্লিন
    });
  }
};
