import Eris from "eris";
import { Job, scheduleJob } from "node-schedule";
import { MostLikedCommand } from ".";
import { DiscordBot } from "../bot/DiscordBot";
import { Logger } from "../logging/Logger";
import { AbstractCommand } from "./AbstractCommand";

const tweetCount = 3;

const logger = new Logger("ScheduleCommand");

export class ScheduleCommand extends AbstractCommand {
  private job?: Job;

  constructor() {
    super("schedule");
  }

  async run(
    bot: DiscordBot,
    msg: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
    _params: string[]
  ) {
    if (this.job) {
      this.job.cancel();
      this.job = undefined;
      bot.discordClient.createMessage(
        msg.channel.id,
        "Automatic posting stopped"
      );
    } else {
      this.job = scheduleJob("0 0 18 * * 4", async () => {
        const mostLikedCmd = new MostLikedCommand();
        try {
          const tweets = await mostLikedCmd.getMostLikedTweets(bot, tweetCount);

          bot.discordClient.createMessage(
            msg.channel.id,
            "Look at all this beautiful fur! ʕ·ᴥ·ʔ"
          );

          for (let i = 0; i < tweetCount; i++) {
            const tweet = tweets[i];
            const url = `https://twitter.com/i/web/status/${tweet.id}`;

            bot.discordClient.createMessage(msg.channel.id, url);
          }
        } catch (e) {
          logger.error(`An error occured: ${e}`);
        }
      });

      bot.discordClient.createMessage(
        msg.channel.id,
        "Automatic posting started"
      );
    }
  }
}
