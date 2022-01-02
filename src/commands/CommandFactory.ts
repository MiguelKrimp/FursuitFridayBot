import { Logger } from "../logging/Logger";
import { AbstractCommand } from "./AbstractCommand";
import * as Commands from "./Commands";

const logger = new Logger("CommandFactory");

export class CommandFactory {
  private cachedCommands: Map<string, AbstractCommand> = new Map();

  constructor() {
    Object.entries(Commands).forEach(([_, c]) => {
      const command = new c();
      logger.info(`Create command ${command.id}`);
      this.cachedCommands.set(command.id, command);
    });
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
