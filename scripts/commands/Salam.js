const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "salam",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ALVI",
  description: "Stylish auto reply to salam (multi-design)",
  commandCategory: "noprefix",
  usages: "assalamu alaikum",
  cooldowns: 3,
};

module.exports.handleEvent = async ({ api, event, Users }) => {
  const name = await Users.getNameUser(event.senderID);

  if (
    event.body &&
    (
      event.body.toLowerCase().indexOf("assalamu alaikum") == 0 ||
      event.body.toLowerCase().indexOf("assalamualaikum") == 0 ||
      event.body.toLowerCase().indexOf("salam") == 0 ||
      event.body.indexOf("আসসালামু আলাইকুম") == 0 ||
      event.body.indexOf("সালাম") == 0 ||
      event.body.indexOf("আসসালামু") == 0
    )
  ) {
    // 🌸 Random Islamic Pics
    const link = [
      "https://i.imgur.com/JtenMLO.jpeg",
      "https://i.imgur.com/kjvZ9iO.jpeg",
      "https://i.imgur.com/uq1X7A4.jpeg",
      "https://i.imgur.com/dMRDrVv.jpeg",
      "https://i.imgur.com/cgtD9cs.jpeg",
      "https://i.imgur.com/YCVtjm3.jpeg",
      "https://i.imgur.com/RGUxNFG.jpeg",
      "https://i.imgur.com/dA3rT0E.jpeg",
      "https://i.imgur.com/oalGZL4.jpeg",
      "https://i.imgur.com/zhSVly7.jpeg"
    ];

    // ✨ Multiple Stylish Designs (fixed with backticks)
    const designs = [
      `╭─❁🌸❁───────────────❁🌸❁─╮  
        🌺 ওয়ালাইকুম আসসালাম 🌺  
╰─❁🌸❁───────────────❁🌸❁─╯  

✨ প্রিয় ${name} ✨  
🕊️ আল্লাহ আপনার উপর শান্তি বর্ষণ করুন 🕊️  
🤲 আপনার জীবন হোক সুখে-সমৃদ্ধিতে ভরা 💖`,

      `┏━━━━━━━━❀🌿❀━━━━━━━━┓  
   🕌 وَعَلَيْكُمُ السَّلَام 🕌  
┗━━━━━━━━❀🌿❀━━━━━━━━┛  

💚 প্রিয় ${name},  
🌸 আল্লাহর রহমত বর্ষিত হোক আপনার উপর 🌸  
🤍 ইমান ও তাকওয়া বৃদ্ধি পাক 🤍`,

      `╔══✿══❀•°❀°•❀══✿══╗  
      🤍 ওয়ালাইকুম আসসালাম 🤍  
╚══✿══❀•°❀°•❀══✿══╝  

💫 ${name}, আপনার মুখে সালাম শুনে হৃদয় জুড়িয়ে গেলো 💫  
🌿 দোয়া করি আল্লাহ আপনাকে বরকতময় জীবন দিন 🌿`,

      `✦••┈┈┈┈••✦✦••┈┈┈┈••✦  
        🕊️ ওয়ালাইকুম আসসালাম 🕊️  
✦••┈┈┈┈••✦✦••┈┈┈┈••✦  

🌹 প্রিয় ${name} 🌹  
✨ সালাম শান্তির বার্তা, আল্লাহ আপনাকে হেফাজত করুন ✨`,

      `╭━━•🌺•━━╮  
   وَعَلَيْكُمُ السَّلَام  
╰━━•🌺•━━╯  

🤍 ${name}, আল্লাহ আপনার দিনটিকে সুন্দর ও বরকতময় করুন 🤍  
🕊️ আমিন 🤲`
    ];

    // Random Style Pick
    const msg = designs[Math.floor(Math.random() * designs.length)];

    const callback = () =>
      api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(__dirname + "/cache/salam.jpg"),
        },
        event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/salam.jpg"),
        event.messageID
      );

    request(encodeURI(link[Math.floor(Math.random() * link.length)]))
      .pipe(fs.createWriteStream(__dirname + "/cache/salam.jpg"))
      .on("close", () => callback());
  }
};

module.exports.run = () => {};
