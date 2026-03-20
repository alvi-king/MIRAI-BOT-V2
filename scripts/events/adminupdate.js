module.exports.config = {
  name: "adminUpdate",
  eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname", "log:thread-icon", "log:thread-call", "log:thread-color"],
  version: "1.0.2",
  credits: "ALVI",
  description: "Update team information quickly",
  envConfig: {
    sendNoti: true,
  }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const fs = require("fs");
  var iconPath = __dirname + "/emoji.json";
  if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));
  const { threadID, logMessageType, logMessageData } = event;
  const { setData, getData } = Threads;

  const thread = global.data.threadData.get(threadID) || {};
  if (typeof thread["adminUpdate"] != "undefined" && thread["adminUpdate"] == false) return;

  try {
    let dataThread = (await getData(threadID)).threadInfo;
    switch (logMessageType) {

      // 🧩 ADD / REMOVE ADMIN
      case "log:thread-admins": {
        const targetID = logMessageData.TARGET_ID;
        const name = await Users.getNameUser(targetID);
        const mention = [{ id: targetID, tag: name }];

        if (logMessageData.ADMIN_EVENT == "add_admin") {
          dataThread.adminIDs.push({ id: targetID });
          if (global.configModule[this.config.name].sendNoti)
            api.sendMessage({
              body: `»» 𝐍𝐎𝐓𝐈𝐂𝐄 ««\n${name}, এই নাও বেবি 💖 তোমাকে গ্রুপ এর এডমিন এর দায়িত্ব দিলাম! 🧙‍♂️🔮\nএখন তুমি অফিসিয়ালি 𝙑𝙄𝙋. 😎🎩`,
              mentions: mention
            }, threadID, async (error, info) => {
              if (global.configModule[this.config.name].autoUnsend) {
                await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                return api.unsendMessage(info.messageID);
              } else return;
            });
        }

        else if (logMessageData.ADMIN_EVENT == "remove_admin") {
          dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != targetID);
          if (global.configModule[this.config.name].sendNoti)
            api.sendMessage({
              body: `»» 𝐍𝐎𝐓𝐈𝐂𝐄 ««\n${name}, তুমি এডমিন এর দায়িত্ব পালন করতে ব্যর্থ হয়েছো? 😅\nতাই তোমাকে এডমিন থেকে বহিষ্কার করা হলো! 😂`,
              mentions: mention
            }, threadID, async (error, info) => {
              if (global.configModule[this.config.name].autoUnsend) {
                await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                return api.unsendMessage(info.messageID);
              } else return;
            });
        }
        break;
      }

      // 🧩 ICON CHANGE
      case "log:thread-icon": {
        let preIcon = JSON.parse(fs.readFileSync(iconPath));
        dataThread.threadIcon = event.logMessageData.thread_icon || "👍";
        if (global.configModule[this.config.name].sendNoti)
          api.sendMessage(`» [ 𝐆𝐑𝐎𝐔𝐏 𝐔𝐏𝐃𝐀𝐓𝐄 ]\n» Group icon changed!\n» Old icon: ${preIcon[threadID] || "unknown"}\n» New icon: ${dataThread.threadIcon}`,
            threadID, async (error, info) => {
              preIcon[threadID] = dataThread.threadIcon;
              fs.writeFileSync(iconPath, JSON.stringify(preIcon));
              if (global.configModule[this.config.name].autoUnsend) {
                await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                return api.unsendMessage(info.messageID);
              } else return;
            });
        break;
      }

      // 🧩 GROUP CALL UPDATE
      case "log:thread-call": {
        if (logMessageData.event === "group_call_started") {
          const name = await Users.getNameUser(logMessageData.caller_id);
          api.sendMessage(`[ 𝐆𝐑𝐎𝐔𝐏 𝐔𝐏𝐃𝐀𝐓𝐄 ]\n❯ ${name} 𝗦𝗧𝗔𝗥𝗧𝗘𝗗 𝗔 ${(logMessageData.video) ? 'VIDEO ' : ''}𝗖𝗔𝗟𝗟.`, threadID);
        } else if (logMessageData.event === "group_call_ended") {
          const callDuration = logMessageData.call_duration;
          const hours = Math.floor(callDuration / 3600);
          const minutes = Math.floor((callDuration - (hours * 3600)) / 60);
          const seconds = callDuration - (hours * 3600) - (minutes * 60);
          const timeFormat = `${hours}:${minutes}:${seconds}`;
          api.sendMessage(`[ 𝐆𝐑𝐎𝐔𝐏 𝐔𝐏𝐃𝐀𝐓𝐄 ]\n❯ ${(logMessageData.video) ? 'Video' : ''} 𝗰𝗮𝗹𝗹 𝗵𝗮𝘀 𝗲𝗻𝗱𝗲𝗱.\n❯ 𝗖𝗮𝗹𝗹 𝗱𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${timeFormat}`, threadID);
        } else if (logMessageData.joining_user) {
          const name = await Users.getNameUser(logMessageData.joining_user);
          api.sendMessage(`❯ [ 𝐆𝐑𝐎𝐔𝐏 𝐔𝐏𝐃𝐀𝐓𝐄 ]\n❯ ${name} 𝗷𝗼𝗶𝗻𝗲𝗱 𝘁𝗵𝗲 ${(logMessageData.group_call_type == '1') ? 'Video' : ''} 𝗰𝗮𝗹𝗹.`, threadID);
        }
        break;
      }

      // 🧩 COLOR CHANGE
      case "log:thread-color": {
        dataThread.threadColor = event.logMessageData.thread_color || "🌤";
        if (global.configModule[this.config.name].sendNoti)
          api.sendMessage(`» [ 𝐆𝐑𝐎𝐔𝐏 𝐔𝐏𝐃𝐀𝐓𝐄 ]\n» Group theme color updated!`, threadID, async (error, info) => {
            if (global.configModule[this.config.name].autoUnsend) {
              await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
              return api.unsendMessage(info.messageID);
            } else return;
          });
        break;
      }

      // 🧩 NICKNAME CHANGE
      case "log:user-nickname": {
        dataThread.nicknames[logMessageData.participant_id] = logMessageData.nickname;
        const name = await Users.getNameUser(logMessageData.participant_id);
        const mention = [{ id: logMessageData.participant_id, tag: name }];

        if (typeof global.configModule["nickname"] != "undefined" && !global.configModule["nickname"].allowChange.includes(threadID) && !dataThread.adminIDs.some(item => item.id == event.author) || event.author == api.getCurrentUserID()) return;
        if (global.configModule[this.config.name].sendNoti)
          api.sendMessage({
            body: `»» 𝐍𝐎𝐓𝐈𝐂𝐄 ««\n${name} এখন নিজের নিকনেম পরিবর্তন করেছে ➜ ${(logMessageData.nickname.length == 0) ? "Original name restored" : logMessageData.nickname}`,
            mentions: mention
          }, threadID, async (error, info) => {
            if (global.configModule[this.config.name].autoUnsend) {
              await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
              return api.unsendMessage(info.messageID);
            } else return;
          });
        break;
      }

      // 🧩 GROUP NAME CHANGE
      case "log:thread-name": {
        dataThread.threadName = event.logMessageData.name || "No name";
        if (global.configModule[this.config.name].sendNoti)
          api.sendMessage(`»» 𝐍𝐎𝐓𝐈𝐂𝐄 ««\nগ্রুপের নাম পরিবর্তন করা হয়েছে ➜ ${dataThread.threadName}`, threadID, async (error, info) => {
            if (global.configModule[this.config.name].autoUnsend) {
              await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
              return api.unsendMessage(info.messageID);
            } else return;
          });
        break;
      }
    }

    await setData(threadID, { threadInfo: dataThread });

  } catch (e) { console.log(e) };
};
