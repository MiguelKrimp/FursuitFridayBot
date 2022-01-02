import ERIS from "eris";
import { TwitterApi } from "twitter-api-v2";
import { DiscordBot } from "./bot/DiscordBot";
import { ConfigReader } from "./bot/ConfigReader";
import { CommandFactory } from "./commands";

const configReader = new ConfigReader();

const erisClient = new ERIS.Client(configReader.readDiscordToken());

const twitterClient = new TwitterApi(configReader.readTwitterToken());

const bot = new DiscordBot(erisClient, twitterClient, new CommandFactory());

bot.start();
