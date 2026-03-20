const moment = require("moment-timezone");

module.exports.config = {
  name: "autotime",
  version: "3.3.0",
  hasPermssion: 0, 
  credits: "ALVI",
  description: "প্রতি ঘন্টা সব গ্রুপে সময়, তারিখ ও দোয়া পাঠাবে, নতুন গ্রুপও স্বয়ংক্রিয়ভাবে যুক্ত হবে",
  commandCategory: "system",
  usages: "",
  cooldowns: 0,
};

// সব গ্রুপে বার্তা পাঠানোর ফাংশন
async function sendTimeToAllThreads(api, Threads) {
  const allThreads = await Threads.getAll(); // সব গ্রুপের থ্রেড ID নিয়ে আসে
  const timeZone = "Asia/Dhaka";
  const now = moment().tz(timeZone);
  const time = now.format("hh:mm A");
  const date = now.format("DD/MM/YYYY, dddd");

  const msg = 
`╭╼╾╼🌸╾╼╾╮
 🌺𝐁𝐃~𝐓𝐈𝐌𝐄🌺
 ╰╼╾╼🌸╾╼╾╯
⏰ সময়: ${time}
📅 তারিখ: ${date}
🌍 টাইমজোন: ${timeZone}
━━━━━━━━━━━━━━━
━━━━━━━━━━━━━━━

উচ্চারণ : আল্লাহুম্মা মা আসবাহাবি মিন নিমাতিন আও বি আহাদিন মিন খালক্বিকা ফামিনকা ওয়াহদাকা লা শারিকা লাকা ফালাকাল হামদু ওয়া লাকাশ শুকরু। 

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

অর্থ : হে আল্লাহ! (আজ) সকালে আমি যে অনুগ্রহ পেলাম, অথবা তোমার প্রত্যেক সৃষ্টি যে অনুগ্রহ পেলো, তা সবই কেবল তোমারই দান। তোমার কোনো অংশীদার নেই, তাই সব প্রশংসা কেবল তুমিই প্রাপ্য, আর কৃতজ্ঞতাও কেবল তোমারই।

তাহলে তার ওদিনের শুকরিয়া (কৃতজ্ঞতা) আদায় হয়ে যায়। আর যদি কেউ সন্ধ্যার সময় এরূপ (জিকির) পাঠ করে, তার ওই রাতের কৃতজ্ঞতা আদায় হয়ে যায়।’ (আবু দাউদ)

আল্লাহ তাআলা মুমিন মুসলমানকে সকাল-সন্ধ্যা একবার করে এ দোয়াটি পড়ার মাধ্যমে দিন-রাতের শুকরিয়া আদায় করার তাওফিক দান করুন। হাদিসের ওপর আমল করার তাওফিক দান করুন। আমিন।

𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ 𝗔𝗟𝗩𝗜 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`;

  for (const thread of allThreads) {
    api.sendMessage(msg, thread.threadID);
  }
}

module.exports.run = async function({ api, Threads }) {

  const sendTime = () => sendTimeToAllThreads(api, Threads);

  const timeZone = "Asia/Dhaka"; 
  const now = moment().tz(timeZone);
  const nextHour = now.clone().add(1, "hour").startOf("hour");
  let delay = nextHour.diff(now);

  setTimeout(function tick() {
    sendTime(); // প্রথমবার

    setInterval(() => {
      sendTime(); // প্রতি ঘন্টা
    }, 60 * 60 * 1000);

  }, delay);
};
