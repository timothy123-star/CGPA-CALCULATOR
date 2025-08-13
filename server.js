const TelegramBot = require("node-telegram-bot-api");
const token = "YOUR_BOT_TOKEN";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hello! Send me your courses and grades.");
});
