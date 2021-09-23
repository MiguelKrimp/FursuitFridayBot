import ERIS from "eris";
import { DiscordBot } from "./bot/DiscordBot";
import { ConfigReader } from "./bot/ConfigReader";

const configReader = new ConfigReader();

const erisClient = new ERIS.Client(configReader.readDiscordToken());

const bot = new DiscordBot(erisClient);

bot.start();
