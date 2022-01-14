import { AbstractLogger } from "./AbstractLogger";
import { ConsoleLogger } from "./ConsoleLogger";
import { FileLogger } from "./FileLogger";

export * from "./ConsoleLogger";
export * from "./FileLogger";

export function getDefaultLogger(name: string): AbstractLogger {
  return new ConsoleLogger(new FileLogger(name));
}
