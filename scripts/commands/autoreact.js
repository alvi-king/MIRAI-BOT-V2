module.exports.config = {
  name: "autoreact",
  version: "1.2.0",
  hasPermssion: 0, // <-- corrected spelling (many frameworks expect hasPermssion)
  credits: "ALVI",
  description: "Bot auto reacts to messages",
  commandCategory: "noprefix",
  cooldowns: 0
};

module.exports.handleEvent = async ({ api, event }) => {
  try {
    // safety: need messageID to react
    if (!event.messageID) return;

    // don't react to bot's own messages (if api provides current id)
    const me = typeof api.getCurrentUserID === "function" ? api.getCurrentUserID() : null;
    if (me && event.senderID === me) return;

    // get thread config (global.data.threadData should store the plain data object)
    const threadData = global.data.threadData.get(event.threadID) || {};
    if (threadData.autoreact === false) return; // explicitly disabled

    const emojis = [
      "🥰","😗","🍂","💜","☺️","🖤","🤗","😇","🌺","🥹","😻",
      "😘","🫣","😽","😺","👀","❤️","🧡","💛","💚","💙","💜",
      "🤎","🤍","💫","💦","🫶","🫦","👄","🗣️","💏","👨‍👩‍👦‍👦",
      "👨‍👨‍👦","😵","🥵","🥶","🤨","🤐","🫡","🤔"
    ];

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // setMessageReaction(reaction, messageID, callback, [isReactToSelf])
    api.setMessageReaction(randomEmoji, event.messageID, (err) => {
      if (err) console.error("❌ Error sending reaction:", err);
    }, true);

  } catch (e) {
    console.error("❌ AutoReact error:", e);
  }
};

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID, messageID } = event;
  try {
    const threadInfo = (await Threads.getData(threadID)) || {};
    const data = threadInfo.data || {};

    // toggle (default ON)
    if (typeof data.autoreact === "undefined") data.autoreact = true;
    else data.autoreact = !data.autoreact;

    await Threads.setData(threadID, { data });
    // store the plain data object in global cache so handleEvent can read it
    global.data.threadData.set(threadID, data);

    return api.sendMessage(
      `✅ Auto-react is now ${data.autoreact ? "ON 🟢" : "OFF 🔴"}`,
      threadID,
      messageID
    );
  } catch (e) {
    console.error("❌ Error in run():", e);
    return api.sendMessage("❌ Failed to toggle auto-react!", threadID, messageID);
  }
};
