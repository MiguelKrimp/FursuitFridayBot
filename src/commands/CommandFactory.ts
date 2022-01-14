import { DiscordBot } from "../bot/DiscordBot";
import { getDefaultLogger } from "../logging";
import { AbstractCommand } from "./AbstractCommand";
import { commands as COMMANDS } from "./Commands";

const logger = getDefaultLogger("CommandFactory");

export class CommandFactory {
  private cachedCommands: Map<string, AbstractCommand> = new Map();

  async createCommands(bot: DiscordBot) {
    for (const pair of Object.entries(COMMANDS)) {
      const [id, commandConstructor] = pair;
      const command = new commandConstructor(id);
      command.inititalize(bot);
      logger.info(`Create command ${command.id}`);
      this.cachedCommands.set(command.id, command);
    }
  }

  getCommand(id: string): AbstractCommand | undefined {
    return this.cachedCommands.get(id);
  }

  listCommands(): string {
    let commands = "";
    this.cachedCommands.forEach((c) => (commands += `\n - ${c.id}`));
    return commands;
  }
}
