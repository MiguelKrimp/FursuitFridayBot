import ERIS, { PrivateChannel } from "eris";
import { TwitterApi } from "twitter-api-v2";
import * as Commands from "../commands";
import { ShowRecentCommand } from "../commands";
import { AbstractCommand } from "../commands/AbstractCommand";
import { Logger } from "../logging/Logger";
import { TwitterError } from "../types/Error";

const logger = new Logger("DiscordBot");

export class DiscordBot {
  private _discordClient: ERIS.Client;
  private _twitterClient: TwitterApi;
  private commands: Map<string, AbstractCommand> = new Map();
  static readonly BOT_PREFIX: string = "!fsf";

  constructor(discordClient: ERIS.Client, twitterClient: TwitterApi) {
    this._discordClient = discordClient;
    this._twitterClient = twitterClient;
  }

  get discordClient(): ERIS.Client {
    return this._discordClient;
  }

  get twitterClient(): TwitterApi {
    return this._twitterClient;
  }

  start() {
    this.instantiateCommands();
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

  private instantiateCommands() {
    Object.entries(Commands).forEach(([_, c]) => {
      const command = new c();
      logger.info(`Create command ${command.id}`);
      this.commands.set(command.id, command);
    });
  }

  private async onPrivateMessage(
    msg: ERIS.Message<ERIS.PossiblyUncachedTextableChannel>
  ) {
    logger.info("Direct message received");
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

      const command = this.commands.get(commandName);

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

        let errorMessage = `Unknown command '${commandName}'. Please use one of the known commands:`;
        this.commands.forEach((c) => (errorMessage += `\n - ${c.id}`));
        this.discordClient.createMessage(msg.channel.id, errorMessage);
      }
    } else {
      new ShowRecentCommand().run(this, msg, []);
    }
  }
}
