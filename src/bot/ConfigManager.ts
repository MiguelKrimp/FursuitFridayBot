import fs, { existsSync } from "fs-extra";
import { Auth } from "../config/Auth";
import { Subscriptions } from "../config/Subscriptions";

export class ConfigManager {
  private readonly authPath = "./config/auth.json";
  private readonly subsPath = "./config/subscriptions.json";

  readDiscordToken(): string {
    const json = fs.readJsonSync(this.authPath) as Auth;

    if (json.discord.token) {
      return json.discord.token;
    } else {
      throw new Error("No discord authentication specified");
    }
  }

  readTwitterToken(): string {
    const json = fs.readJsonSync(this.authPath) as Auth;

    if (json.twitter.bearerToken) {
      return json.twitter.bearerToken;
    } else {
      throw new Error("No twitter authentication specified");
    }
  }

  readSubscriptions(): string[] {
    if (existsSync(this.subsPath)) {
      const json = fs.readJsonSync(this.subsPath, {}) as Subscriptions;

      if (Array.isArray(json.channels)) {
        return json.channels;
      } else {
        throw new Error("Subscriptions config is corrupted");
      }
    } else {
      return [];
    }
  }

  writeSubscriptions(channels: string[]): void {
    const json: Subscriptions = { channels };

    fs.writeJsonSync(this.subsPath, json);
  }
}
