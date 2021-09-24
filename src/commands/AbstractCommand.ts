import Eris from "eris";
import { DiscordBot } from "../bot/DiscordBot";

export abstract class AbstractCommand {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  abstract run(
    bot: DiscordBot,
    msg: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
    params: string[]
  ): Promise<void>;
}
