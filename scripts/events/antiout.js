const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "1.0.1",
  credits: "ALVI",
  description: "কেউ গ্রুপ ছাড়লে আবার এড করবে + GIF"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  try {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (data.antiout === false) return;
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    const userID = event.logMessageData.leftParticipantFbId;
    const name = global.data.userName.get(userID) || await Users.getNameUser(userID);

    const type = (event.author == userID) ? "self-separation" : "kick";

    if (type === "self-separation") {
      api.addUserToGroup(userID, event.threadID, (error) => {
        if (error) {
          api.sendMessage(
            {
              body: `❌ দুঃখিত আলভি বস, ${name} কে আবার এড করতে পারলাম না। 
সম্ভবত উনি বটকে ব্লক করেছে অথবা প্রাইভেসি সেটিংসের কারণে এড করা যাচ্ছে না। 
\n──────꯭─⃝‌‌𝐀𝐥𝐯𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭─────`,
              attachment: fs.createReadStream(path.join(__dirname, "cache/failed.gif")) // এখানে GIF ফাইল রাখবেন
            },
            event.threadID
          );
        } else {
          api.sendMessage(
            {
              body: `✅ ${name}, 
এই গ্রুপ হচ্ছে আড্ডা বক্স!  
এখান থেকে যেতে চাইলে এডমিনের পারমিশন লাগবে।  
তুমি পারমিশন ছাড়া লিভ নিয়েছো – তাই তোমাকে আবার গ্রুপে এড করে দিলাম।  
\n──────꯭─⃝‌‌𝐀𝐥𝐯𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭─────`,
              attachment: fs.createReadStream(path.join(__dirname, "cache/welcome.gif")) // এখানে GIF ফাইল রাখবেন
            },
            event.threadID
          );
        }
      });
    }
  } catch (err) {
    console.error("❌ antiout error:", err);
  }
};
