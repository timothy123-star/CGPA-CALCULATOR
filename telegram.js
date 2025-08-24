// index.js
const TelegramBot = require("node-telegram-bot-api");

// Replace with your token
const token = "8257510203:AAHrjzIwtUPrzXtF2MXJzsfmj3JbZIZvbF8";

// Create bot
const bot = new TelegramBot(token, { polling: true });

// Start command

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const username = msg.from.first_name
    ? `${msg.from.first_name}`
    : msg.from.username;

  bot.sendMessage(chatId, `👋 Welcome ${username} !\nWhat are you up to?`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "➕ 👩‍💻Digital Wellbeing", callback_data: "dig_wellb" }],
        [{ text: "📊 Calculate GPA", callback_data: "calc_gpa" }],
        [{ text: "📏Metrics📈", callback_data: "metrics" }],
        [{ text: "❓ Help", callback_data: "help" }],
      ],
    },
  });
});

//Options clicks
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "dig_wellb") {
    bot.sendMessage(chatId, "Select From the Options", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🅱 Block a Website", callback_data: "b_web" }],
          [{ text: "⏲ Screen Time control", callback_data: "s_time_ctr" }],
        ],
      },
    });
  }
});

// CGPA option
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "dig_wellb") {
    bot.sendMessage(chatId, "Select From the Options", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🅱 Block a Website", callback_data: "b_web" }],
          [{ text: "⏲ Screen Time control", callback_data: "s_time_ctr" }],
        ],
      },
    });
  }
});

// Handle user message
bot.on("message", (msg) => {
  if (msg.text && !msg.text.startsWith("/")) {
    const lines = msg.text.trim().split("\n");

    let totalPoints = 0;
    let totalCourses = 0;

    lines.forEach((line) => {
      const [course, grade] = line.trim().split(" ");
      const points = gradeToPoints(grade);
      if (points !== null) {
        totalPoints += points;
        totalCourses++;
      }
    });

    if (totalCourses > 0) {
      const cgpa = (totalPoints / totalCourses).toFixed(2);
      bot.sendMessage(msg.chat.id, `Your CGPA is: ${cgpa}`);
    } else {
      bot.sendMessage(
        msg.chat.id,
        "Please send valid grades (A, B, C, D, E, F)."
      );
    }
  }
});

// Helper function
function gradeToPoints(grade) {
  switch (grade.toUpperCase()) {
    case "A":
      return 5;
    case "B":
      return 4;
    case "C":
      return 3;
    case "D":
      return 2;
    case "E":
      return 1;
    case "F":
      return 0;
    default:
      return null;
  }
}
