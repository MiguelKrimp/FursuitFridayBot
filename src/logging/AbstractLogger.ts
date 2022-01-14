export type LogLevel = "info" | "warn" | "error" | "trace" | "debug";

export abstract class AbstractLogger {
  readonly name: string;
  readonly child?: AbstractLogger;

  constructor(nameOrLogger: string | AbstractLogger) {
    if (typeof nameOrLogger === "string") {
      this.name = nameOrLogger;
    } else {
      this.child = nameOrLogger;
      this.name = this.child.name;
    }
  }

  private log(message: string, level: LogLevel) {
    this.internalLog(message, level);
    this.child?.log(message, level);
  }

  protected createDefaultLogMessage(message: string, level: LogLevel): string {
    const timeStamp = new Date().toISOString();
    return `${timeStamp} - ${this.name.padEnd(25, " ")} - ${level.padEnd(
      5,
      " "
    )}: ${message}`;
  }

  protected abstract internalLog(message: string, level: LogLevel): void;

  info(message: string) {
    this.log(message, "info");
  }

  warn(message: string) {
    this.log(message, "warn");
  }

  error(message: string) {
    this.log(message, "error");
  }

  trace(message: string): void {
    this.log(message, "trace");
  }

  debug(message: string): void {
    this.log(message, "debug");
  }
}
