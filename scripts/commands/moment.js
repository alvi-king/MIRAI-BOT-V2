const moment = require("moment-timezone");
require("moment/locale/bn"); // বাংলা লোকেল

module.exports.config = {
  name: "calendar",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "ALVI",
  description: "বাংলায় ক্যালেন্ডার দেখাবে",
  commandCategory: "utility",
  usages: "calendar",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  // টাইমজোন (আপনার দেশের জন্য)
  const timeZone = "Asia/Dhaka";

  // moment এ লোকেল সেট করা
  moment.locale("bn");

  const now = moment().tz(timeZone);

  const date = now.format("D MMMM YYYY"); // তারিখ মাস বছর
  const day = now.format("dddd"); // বার
  const time = now.format("hh:mm:ss A"); // সময়

  const msg = `📅 আজকের তারিখ: ${date}\n🗓️ বার: ${day}\n⏰ সময়: ${time}`;

  // ক্যালেন্ডারের ছবি (একটা ফ্রি ক্যালেন্ডার PNG)
  const imageUrl = "https://i.ibb.co/3N1PMxs/calendar-bn.png";

  const request = require("request");
  const fs = require("fs-extra");
  const path = __dirname + "/cache/calendar.png";

  request(imageUrl)
    .pipe(fs.createWriteStream(path))
    .on("close", () => {
      api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(path),
        },
        event.threadID,
        () => fs.unlinkSync(path),
        event.messageID
      );
    });
};
