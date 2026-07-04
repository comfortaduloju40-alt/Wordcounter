require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { analyzeText } = require('./counter');

// Create bot in webhook mode — no polling
const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: true });

// ─── /start ───────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'there';

  const text =
    `👋 Hello, ${name}!\n\n` +
    `I'm your *Word Counter Bot*.\n` +
    `Send me any text and I'll count it instantly!\n\n` +
    `*Commands:*\n` +
    `📌 /start — Welcome message\n` +
    `❓ /help — How to use me\n` +
    `📊 /count <text> — Count words in text\n` +
    `ℹ️ /about — About this bot\n\n` +
    `_Tip: No command needed — just paste any text!_`;

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// ─── /help ────────────────────────────────────────────
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const text =
    `📖 *How to Use Word Counter Bot*\n\n` +
    `*Option 1 — Just send text:*\n` +
    `Paste or type anything and I count it automatically.\n\n` +
    `*Option 2 — Use the command:*\n` +
    `/count Hello world, this is my message.\n\n` +
    `*What I count:*\n` +
    `• 📝 Total words\n` +
    `• 🔤 Characters (with & without spaces)\n` +
    `• 📖 Sentences\n` +
    `• 📏 Average word length\n` +
    `• 🏆 Longest word`;

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// ─── /about ───────────────────────────────────────────
bot.onText(/\/about/, (msg) => {
  const chatId = msg.chat.id;

  const text =
    `ℹ️ *About Word Counter Bot*\n\n` +
    `This bot counts words, characters, sentences and more.\n\n` +
    `Built with Node.js and hosted on Railway.app 🚀\n\n` +
    `Send me any text to get started!`;

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// ─── /count <text> ────────────────────────────────────
bot.onText(/\/count (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1].trim();

  if (!input) {
    bot.sendMessage(chatId, '⚠️ Please add text after /count\n\nExample: /count Hello world');
    return;
  }

  const result = analyzeText(input);
  bot.sendMessage(chatId, formatResult(result), { parse_mode: 'Markdown' });
});

// Handle /count sent alone with no text
bot.onText(/^\/count$/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    '⚠️ Please add text after /count\n\nExample: /count Hello world this is my text'
  );
});

// ─── Plain text messages (no command) ─────────────────
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore commands and empty messages
  if (!text || text.startsWith('/')) return;

  const trimmed = text.trim();
  if (!trimmed) {
    bot.sendMessage(chatId, '⚠️ That looks empty. Send me some text to count!');
    return;
  }

  const result = analyzeText(trimmed);
  bot.sendMessage(chatId, formatResult(result), { parse_mode: 'Markdown' });
});

// ─── Format result into a readable reply ──────────────
function formatResult(result) {
  const wordLabel = result.words === 1 ? 'word' : 'words';
  const sentLabel = result.sentences === 1 ? 'sentence' : 'sentences';

  return (
    `📊 *Word Count Results*\n\n` +
    `📝 Words: *${result.words}* ${wordLabel}\n` +
    `🔤 Characters: *${result.characters}* (${result.charactersNoSpaces} without spaces)\n` +
    `📖 Sentences: *${result.sentences}* ${sentLabel}\n` +
    `📏 Avg. word length: *${result.avgWordLength}* chars\n` +
    `🏆 Longest word: *${result.longestWord}*\n\n` +
    `_Send me any text to count!_`
  );
}

module.exports = { bot };
