// index.js
// const TelegramBot = require("node-telegram-bot-api");
// const fs = require("fs");
// const fs = require("fs").promises;
// const { readFile } = require("fs/promises");
import TelegramBot from "node-telegram-bot-api";
import fs from "fs/promises";
import express from "express";
import { type } from "os";

// Replace with your token
const token = "8257510203:AAHrjzIwtUPrzXtF2MXJzsfmj3JbZIZvbF8";

// Create bot
const bot = new TelegramBot(token, { polling: true });
bot.on("polling_error", (err) => console.log(err));
bot.on("error", (err) => console.log(err));

const dbFile = "Database.json";

// Ensure DB file exists
async function initDB() {
  try {
    await fs.access(dbFile); // check if file exists
  } catch {
    await fs.writeFile(dbFile, "{}"); // create empty DB if not found
  }
}
initDB();

async function loadDB() {
  try {
    const data = await fs.readFile(dbFile, "utf8");
    return data.trim() ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

async function saveDB(data) {
  await fs.writeFile(dbFile, JSON.stringify(data, null, 2));
}

async function ensureUser(chatId, msg) {
  const db = await loadDB();

  if (!db[chatId]) {
    db[chatId] = {
      first_name: msg.from.first_name,
      last_name: msg.from.last_name || null,
      username: msg.from.username || null,
      Years: {},
    }; // new user starts with empty semesters
    saveDB(db);
  }

  return db;
}

// Variables
let level, semester;

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  ((level = ""), (semester = ""));

  const username = msg.from.first_name
    ? `${msg.from.first_name}`
    : msg.from.username;

  ensureUser(chatId, msg);

  bot.sendMessage(chatId, `👋 Welcome ${username} !\nWhat are you up to?`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "👩‍💻Digital Wellbeing", callback_data: "dig_wellb" }],
        [{ text: "📊 GPA Tracker", callback_data: "calc_gpa" }],
        [{ text: "📚 To-do List", callback_data: "todo" }],
        [{ text: "📖 Reservations", callback_data: "reserve" }],
        [{ text: "📏 Metrics", callback_data: "metrics" }],
        [{ text: "Take a Survey", callback_data: "survey" }],

        [
          { text: "❓ Help", callback_data: "help" },
          { text: "♾ Reset", callback_data: "reset" },
        ],
      ],
    },
  });
});

//Options clicks
//Digital wellbeing Option
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

  if (query.data === "calc_gpa") {
    bot.sendMessage(
      chatId,
      "What Level and Semester Courses are we tracking?\n\n Enter it in this Format\n\n  year1 semester2",

      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Previous SGPA & GPA", callback_data: "sgpa_gpa" },
              { text: "📈View Analysis", callback_data: "view_analysis" },
            ],
          ],
        },
      }
    );
  }
});

// Second GPA button clicks
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  let db = await loadDB();

  if (query.data === "bulk") {
    db[chatId].mode.type = "bulk";
    await saveDB(db);

    return bot.sendMessage(
      chatId,
      "✍️ Please send all your courses in this format:\n\n\COURSECODE GRADE CREDIT\\nExample:\n\MAT101 A 3\nCSC102 B 2\nPHY103 A 4"
    );
  }

  if (query.data === "step") {
    db[chatId].mode.type = "step";
    await saveDB(db);

    return bot.sendMessage(
      chatId,
      "➡️ Okay! Let's add courses one by one.\nSend course like this:\n\MAT101 A 3",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Finish & Calculate GPA",
                callback_data: "finish_step",
              },
            ],
          ],
        },
      }
    );
  }

  if (query.data === "finish_step") {
    const mode = db[chatId]?.mode;
    if (!mode?.level || !mode?.semester) {
      return bot.sendMessage(chatId, "⚠️ Please enter year & semester first.", {
        parse_mode: "Markdown",
      });
    }

    if (!db[chatId].Years[mode.level][mode.semester].courses?.length) {
      return bot.sendMessage(
        chatId,
        "❌ No courses entered.\n\nEnter format: `MAT111 A 3`",
        { parse_mode: "Markdown" }
      );
    }
    // const gpa = calculateGPA(semesterCourses);
    // saveSemester(chatId, currentSemester, semesterCourses, gpa);

    bot.sendMessage(
      chatId,
      `🎯 GPA for Semester ${currentSemester}: *${gpa}*`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "➕ Add Another Semester", callback_data: "new_sem" }],
            [{ text: "📊 View CGPA", callback_data: "view_cgpa" }],
          ],
        },
      }
    );
  }
  return;
});

// Handle messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text.startsWith("/")) return;

  //User sends in year and semester
  let db = await ensureUser(chatId, msg);

  // db[chatId].mode = { type: "waiting_for_course_choice" };
  // await saveDB(db);

  const mode = db[chatId].mode;

  // Bulk mode
  if (mode?.type === "bulk") {
    const lines = msg.text.trim().split("\n");
    lines.forEach((line) => {
      const [course, grade, credit] = line.split(" ");
      db[chatId].Years[mode.level][mode.semester].courses.push({
        course,
        grade,
        credit: Number(credit),
      });
    });
    delete db[chatId].mode;
    await saveDB(db);

    bot.sendMessage(chatId, " ✅ Bulk courses saved!", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "➕ Add Another Semester", callback_data: "new_sem" }],
          [{ text: "📊 View CGPA", callback_data: "view_cgpa" }],
        ],
      },
    });
    return;
  }

  // Step mode
  if (mode?.type === "step") {
    if (/^[A-Za-z]+\d+\s+[A-Fa-f]\s+\d+$/.test(msg.text)) {
      delete db[chatId].mode;
      await saveDB(db);
      const [code, grade, credits] = msg.text.split(" ");
      db[chatId].Years[mode.level][mode.semester].courses.push({
        code,
        grade,
        credits: Number(credits),
      });

      bot.sendMessage(chatId, `✅ Added ${code} (${grade}, ${credits} units)`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "➕ Add Another", callback_data: "step" }],
            [
              {
                text: "✅ Finish & Calculate GPA",
                callback_data: "finish_step",
              },
            ],
          ],
        },
      });
    } else {
      bot.sendMessage(chatId, "⚠️ Format: `MAT111 A 3`", {
        parse_mode: "Markdown",
      });
    }
    return;
  }

  const [lvl, sem] = msg.text.toLowerCase().trim().split(" ");

  if (!lvl || !sem) {
    return bot.sendMessage(
      chatId,
      "❌ Please enter in format: `year2 semester1`",
      {
        parse_mode: "Markdown",
      }
    );
  }

  level = lvl;
  semester = sem;

  // Ensure storage exists
  if (!db[chatId].Years[level]) db[chatId].Years[level] = {};
  if (!db[chatId].Years[level][semester])
    db[chatId].Years[level][semester] = { courses: [] };

  db[chatId].mode = {
    type: "waiting_for_course_choice",
    level: lvl,
    semester: sem,
  };
  await saveDB(db);

  // Ask user how they want to add courses
  bot.sendMessage(
    chatId,
    `✅ Saved! You are tracking for *${level} and ${semester}*.\n\nHow would you like to add your courses?`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📝 Bulk Entry",
              callback_data: "bulk",
            },
          ],
          [
            {
              text: "➡️ Step-by-step Entry",
              callback_data: "step",
            },
          ],
        ],
      },
    }
  );
});
