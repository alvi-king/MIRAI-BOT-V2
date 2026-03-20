const axios = require("axios");

module.exports.config = {
  name: "numberinfo",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ALVI",
  description: "Get detailed information (carrier, country, line type) about a phone number",
  commandCategory: "utility",
  usages: "[number]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (args.length === 0) {
      return api.sendMessage(
        "❌ দয়া করে একটি নাম্বার লিখুন!\n\nউদাহরণ:\nnumberinfo +8801712345678",
        event.threadID,
        event.messageID
      );
    }

    const number = args[0];
    const apiKey = "9edf4d6eab17e3818454312a8f9d531b"; 
    const url = `http://apilayer.net/api/validate?access_key=${apiKey}&number=${number}&country_code=&format=1`;

    const res = await axios.get(url);
    const data = res.data;

    if (!data.valid) {
      return api.sendMessage("❌ অবৈধ নাম্বার দেওয়া হয়েছে!", event.threadID, event.messageID);
    }

    const msg = 
`📞 Number Info
──────────────────
✅ Valid: Yes
🌍 Country: ${data.country_name} (${data.country_code})
🌐 International: ${data.international_format}
🏠 Local: ${data.local_format}
🏢 Carrier: ${data.carrier || "Unknown"}
📱 Line Type: ${data.line_type || "Unknown"}`;

    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("⚠️ কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};
