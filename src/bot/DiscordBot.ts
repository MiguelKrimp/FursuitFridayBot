import ERIS from "eris";
import { TwitterApi } from "twitter-api-v2";
import * as Commands from "../commands";
import { ShowRecentCommand } from "../commands";
import { AbstractCommand } from "../commands/AbstractCommand";

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
      console.log("Connected");
    });

    this._discordClient.on("messageCreate", async (msg) => {
      if (msg.author.id === this._discordClient.user.id) {
        return;
      }

      if (!msg.content.startsWith(DiscordBot.BOT_PREFIX)) {
        return;
      }

      const fullCommand = msg.content.substring(DiscordBot.BOT_PREFIX.length);

      const commandSplits = fullCommand.split(/\s/).filter((s) => s.length > 0);
      const commandName = commandSplits[0];

      const command = this.commands.get(commandName);

      if (command) {
        console.log(`${msg.author.username} used command '${fullCommand}'`);

        try {
          command.run(this, msg, commandSplits.slice(1));
        } catch (e) {
          console.log(e);
        }
      } else {
        new ShowRecentCommand().run(this, msg, commandSplits);
      }
    });

    this._discordClient.on("error", (e) => {
      console.log(e);
    });
  }

  private instantiateCommands() {
    Object.entries(Commands).forEach(([_, c]) => {
      const command = new c();
      this.commands.set(command.id, command);
    });
  }
}
