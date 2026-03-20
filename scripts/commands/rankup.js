const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
  name: "rankup",
  version: "7.6.9",
  hasPermssion: 1,
  credits: "ALVI",
  description: "Announce rankup for each group/user automatically",
  commandCategory: "Edit-IMG",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event, Currencies, Users, getText }) {
  const { threadID, senderID } = event;
  const pathImg = __dirname + "/cache/rankup.png";
  const pathAvt = __dirname + "/cache/avt.png";

  try {
    // --- XP Data ---
    let expData = await Currencies.getData(senderID);
    let exp = expData.exp || 0;
    exp += 1;

    // Calculate Level
    let curLevel = Math.floor(Math.sqrt((exp - 1) / 3));
    let level = Math.floor(Math.sqrt(exp / 3));

    // Save updated exp
    await Currencies.setData(senderID, { exp });

    // --- If ranked up ---
    if (level > curLevel && level > 0) {
      const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);

      const message = getText("levelup")
        .replace(/\{name}/g, name)
        .replace(/\{level}/g, level);

      const backgrounds = [
        "https://i.ibb.co/DffbB7x/2-7-BDCACE.png",
        "https://i.ibb.co/606p1ZF/1-C0-CF112.png",
        "https://i.ibb.co/54b5KY6/3-10100-BC.png",
        "https://i.ibb.co/4RHd3mM/4-AB4-CF2-B.png",
        "https://i.ibb.co/7WHKF0H/9-498-C5-E0.png",
        "https://i.ibb.co/nPfY3HN/8-ADA7767.png",
        "https://i.ibb.co/Ldctgw4/5-49-F92-DC.png"
      ];

      const rd = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      // --- Download avatar & background ---
      const avatarBuffer = (await axios.get(
        `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )).data;
      fs.writeFileSync(pathAvt, Buffer.from(avatarBuffer));

      const bgBuffer = (await axios.get(rd, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg, Buffer.from(bgBuffer));

      // --- Canvas Editing ---
      const baseImage = await loadImage(pathImg);
      const avatar = await loadImage(pathAvt);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(250, 500, 150, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 100, 350, 300, 300);
      ctx.restore();

      const finalImg = canvas.toBuffer();
      fs.writeFileSync(pathImg, finalImg);

      api.sendMessage(
        {
          body: message,
          mentions: [{ tag: name, id: senderID }],
          attachment: fs.createReadStream(pathImg)
        },
        threadID,
        () => {
          fs.unlinkSync(pathImg);
          fs.unlinkSync(pathAvt);
        }
      );
    }
  } catch (err) {
    console.error("❌ Rankup Error:", err);
  }
};

module.exports.languages = {
  vi: {
    levelup: "🌸 Kĩ năng xảo lộng của {name} vừa lên tới level {level} 🌸"
  },
  en: {
    levelup: "{name},👈🙄_দেখ লুচ্চা তুই আমাকে কতটা ডিস্টার্ব করছিস-🙄💁‍♀️👉 𝗟𝗮𝗯𝗲𝗹➪ {level}"
  }
};
