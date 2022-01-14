import { appendFile, appendFileSync } from "fs-extra";
import { AbstractLogger, LogLevel } from "./AbstractLogger";

const DEFAULT_FILE_PATH = "log.txt";

export class FileLogger extends AbstractLogger {
  private readonly filePath;

  constructor(
    nameOrLogger: string | AbstractLogger,
    filePath: string = DEFAULT_FILE_PATH
  ) {
    super(nameOrLogger);
    this.filePath = filePath;
  }

  protected internalLog(message: string, level: LogLevel): void {
    const logMessage = this.createDefaultLogMessage(message, level) + "\n";

    appendFileSync(this.filePath, logMessage);
  }
}
