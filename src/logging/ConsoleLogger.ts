import { AbstractLogger, LogLevel } from "./AbstractLogger";

export class ConsoleLogger extends AbstractLogger {
  protected internalLog(message: string, level: LogLevel): void {
    const logMessage = this.createDefaultLogMessage(message, level);

    console[level](logMessage);
  }
}
