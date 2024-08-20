const { App } = require("@slack/bolt");
var path = require("path");
var fs = require("fs");
const llog = require("learninglab-log");
const bot = require("./src/bot");
const { getConfig } = require("./src/bot/config");

global.ROOT_DIR = path.resolve(__dirname);

require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.command("/task", bot.slashes.task);

app.message("testing testing", bot.messages.testing);
app.message(process.env.SLACK_BOT_SLACK_ID, bot.messages.mentioned);
app.message(/.*/, bot.messages.parseAll);

app.event("reaction_added", bot.reactions.added);
// app.event("reaction_removed", handleEvents.reactionRemoved);

(async () => {

  const config = await getConfig([
    {
      name: "Workers",
      fields: ["FullName", "FirstName", "Slug", "SlackId"]
    },
    // {
    //   name: "Channels",
    //   fields: ["ChannelId", "Name", "Description", "CustomFunctions", "CustomFunctionNames"]
    // },
    // {
    //   name: "Functions",
    //   fields: ["Name", "Notes"]
    // },
  ])
  // llog.yellow(config);

  global.BOT_CONFIG = config;

  if (!fs.existsSync("_temp")) {
    fs.mkdirSync("_temp");
  }
  await app.start(process.env.PORT || 3000);
  llog.yellow("⚡️ Bolt app is running!");
  let slackResult = await app.client.chat.postMessage({
    channel: process.env.SLACK_LOGGING_CHANNEL,
    text: "starting up the task bot",
  });
})();
