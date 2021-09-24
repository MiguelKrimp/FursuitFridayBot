import fs from "fs-extra";
import { Auth, TwitterAuth } from "../types/Auth";

export class ConfigReader {
  readDiscordToken(): string {
    const json = fs.readJsonSync("./config/auth.json") as Auth;

    if (json.discord.token) {
      return json.discord.token;
    } else {
      throw new Error("No discord authentication specified");
    }
  }

  readTwitterToken(): string {
    const json = fs.readJsonSync("./config/auth.json") as Auth;

    if (json.twitter.bearerToken) {
      return json.twitter.bearerToken;
    } else {
      throw new Error("No twitter authentication specified");
    }
  }
}
