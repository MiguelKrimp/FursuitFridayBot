import ERIS from "eris";
import { TwitterApi } from "twitter-api-v2";
import { DiscordBot } from "./bot/DiscordBot";
import { ConfigManager } from "./bot/ConfigManager";
import { CommandFactory } from "./commands";

const configManager = new ConfigManager();

const erisClient = new ERIS.Client(configManager.readDiscordToken());

const twitterClient = new TwitterApi(configManager.readTwitterToken());

const bot = new DiscordBot(
  erisClient,
  twitterClient,
  new CommandFactory(),
  configManager
);

bot.start();
