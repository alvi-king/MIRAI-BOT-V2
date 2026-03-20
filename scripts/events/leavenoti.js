const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.1",
  credits: "ALVI",
  description: "গ্রুপ থেকে কেউ চলে গেলে বা রিমুভ হলে মেসেজ দিবে"
};

module.exports.run = async function({ api, event, Users, Threads }) {
  try {
    const { threadID } = event;

    // যদি বট নিজে লেফট হয়
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    const data = (await Threads.getData(threadID)).data || {};
    const name = await Users.getNameUser(event.logMessageData.leftParticipantFbId);

    const type = (event.author == event.logMessageData.leftParticipantFbId)
      ? "বেবি তোমার সাহস তো কম নাহ এডমিন এর পারমিশন ছাড়াই লিফট নাও 😡😠🤬\n\n✦─────꯭─⃝‌‌𝐀𝐥𝐯𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦"
      : "তোমার এই গ্রুপে থাকার কোনো যোগ্যাতা নেই!😡\nতাই তোমাকে গ্রুপ থেকে রিমুভ করে দেওয়া হলো?🤪\n\n𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗥𝗘𝗠𝗢𝗩𝗘🤧\n\n✦─────꯭─⃝‌‌𝐀𝐥𝐯𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦";

    let msg = (typeof data.customLeave == "undefined")
      ? `ইস ${name} ${type}`
      : data.customLeave.replace(/\{name}/g, name).replace(/\{type}/g, type);

    const gifFolder = path.join(__dirname, "cache", "leaveGif");
    const gifPath = path.join(gifFolder, "leave1.gif");

    if (!fs.existsSync(gifFolder)) fs.mkdirSync(gifFolder, { recursive: true });

    const formPush = fs.existsSync(gifPath)
      ? { body: msg, attachment: fs.createReadStream(gifPath) }
      : { body: msg };

    return api.sendMessage(formPush, threadID);
  } catch (err) {
    console.error("Leave event error:", err);
  }
};
