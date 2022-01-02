import Eris from "eris";
import { DiscordBot } from "../bot/DiscordBot";
import { AbstractCommand } from "./AbstractCommand";

export class HelpCommand extends AbstractCommand {
  constructor() {
    super("help");
  }

  async run(
    bot: DiscordBot,
    msg: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
    _params: string[]
  ) {
    const help = `Use one the following commands:${bot.listCommands()}`;

    bot.discordClient.createMessage(msg.channel.id, help);
  }
}
