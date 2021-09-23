import fs from "fs-extra";
import { Auth } from "../configTypes/Auth";

export class ConfigReader {
  readDiscordToken(): string {
    const json = fs.readJsonSync("./config/auth.json") as Auth;

    if (json.discordToken) {
      return json.discordToken;
    } else {
      throw new Error("No token specified");
    }
  }
}
