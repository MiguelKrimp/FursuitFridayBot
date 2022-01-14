import ERIS, { PrivateChannel } from "eris";
import { TwitterApi } from "twitter-api-v2";
import { CommandFactory } from "../commands";
import { TwitterError } from "../config/Error";
import { ShowRecentCommand } from "../commands/ShowRecentCommand";
import { getDefaultLogger } from "../logging";
import { ConfigManager } from "./ConfigManager";

const logger = getDefaultLogger("DiscordBot");

export class DiscordBot {
  private _discordClient: ERIS.Client;
  private _twitterClient: TwitterApi;
  private commandFactory: CommandFactory;
  private configManager: ConfigManager;
  static readonly BOT_PREFIX: string = "!fsf";

  constructor(
    discordClient: ERIS.Client,
    twitterClient: TwitterApi,
    commandFactory: CommandFactory,
    configManager: ConfigManager
  ) {
    this._discordClient = discordClient;
    this._twitterClient = twitterClient;
    this.commandFactory = commandFactory;
    this.configManager = configManager;
  }

  get discordClient(): ERIS.Client {
    return this._discordClient;
  }

  get twitterClient(): TwitterApi {
    return this._twitterClient;
  }

  start() {
    this.commandFactory.createCommands(this);
    this.initializeListeners();
    this._discordClient.connect();
  }

  private initializeListeners() {
    this._discordClient.on("ready", async () => {
      logger.info("Connected");
    });

    this._discordClient.on("messageCreate", async (msg) => {
      if (msg.author.id === this._discordClient.user.id) {
        return;
      }

      if (msg.channel instanceof PrivateChannel) {
        this.onPrivateMessage(msg);
      }

      if (!msg.content.startsWith(DiscordBot.BOT_PREFIX)) {
        return;
      }

      this.onCommandMessage(msg);
    });

    this._discordClient.on("error", (e) => {
      logger.error(`${e}`);
    });
  }

  private async onPrivateMessage(
    msg: ERIS.Message<ERIS.PossiblyUncachedTextableChannel>
  ) {
    logger.info("Direct message received");
    this._discordClient.createMessage(
      msg.channel.id,
      "Rawr X3 *nuzzles* How are you? *pounces on you* you're so warm o3o *notices you have a bulge* someone's happy! *nuzzles your necky wecky* ~murr~ hehe ;)"
    );
  }

  private async onCommandMessage(
    msg: ERIS.Message<ERIS.PossiblyUncachedTextableChannel>
  ) {
    const fullCommand = msg.content
      .substring(DiscordBot.BOT_PREFIX.length)
      .trim();

    if (fullCommand) {
      const commandSplits = fullCommand.split(/\s/).filter((s) => s.length > 0);

      const commandName = commandSplits[0];

      const command = this.commandFactory.getCommand(commandName);

      if (command) {
        logger.info(`${msg.author.username} used command '${fullCommand}'`);

        try {
          command.run(this, msg, commandSplits.slice(1));
        } catch (e) {
          if (e instanceof TwitterError) {
            // TODO proper logging to discord
            logger.error(`${e.internalError}`);
          } else {
            logger.error(`${e}`);
          }
        }
      } else {
        logger.warn(
          `${msg.author.username} used unknown command '${fullCommand}'`
        );

        let errorMessage = `Unknown command '${commandName}'. Please use one of the known commands:${this.listCommands()}`;

        this.discordClient.createMessage(msg.channel.id, errorMessage);
      }
    } else {
      new ShowRecentCommand("").run(this, msg, []);
    }
  }

  listCommands(): string {
    return this.commandFactory.listCommands();
  }

  readFsfSubscriptions(): string[] {
    return this.configManager.readSubscriptions();
  }

  writeFsfSubscriptions(subs: string[]): void {
    this.configManager.writeSubscriptions(subs);
  }
}
