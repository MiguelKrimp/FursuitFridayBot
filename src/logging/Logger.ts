export class Logger {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  private log(message: string, level: "Info" | "Warning" | "Error") {
    const timeStamp = new Date().toISOString();

    console.log(`${timeStamp}\t - ${this.name}\t\t\t\t: ${level}:\t${message}`);
  }

  info(message: string) {
    this.log(message, "Info");
  }

  warn(message: string) {
    this.log(message, "Warning");
  }

  error(message: string) {
    this.log(message, "Error");
  }
}
