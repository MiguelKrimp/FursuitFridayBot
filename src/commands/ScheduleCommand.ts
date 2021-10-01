import Eris from "eris";
import { cancelJob, Job, scheduleJob } from "node-schedule";
import { MostLikedCommand } from ".";
import { DiscordBot } from "../bot/DiscordBot";
import { Logger } from "../logging/Logger";
import { AbstractCommand } from "./AbstractCommand";

const tweetCount = 3;

const logger = new Logger("ScheduleCommand");

export class ScheduleCommand extends AbstractCommand {
  private job?: Job;

  private channels: string[] = [];

  constructor() {
    super("schedule");
  }

  async run(
    bot: DiscordBot,
    msg: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
    _params: string[]
  ) {
    const index = this.channels.indexOf(msg.channel.id);
    if (index >= 0) {
      this.channels.splice(index, 1);

      bot.discordClient.createMessage(
        msg.channel.id,
        "Automatic posting stopped"
      );
    } else {
      this.channels.push(msg.channel.id);

      bot.discordClient.createMessage(
        msg.channel.id,
        "Automatic posting started"
      );
    }

    if (this.channels.length > 0) {
      this.job?.cancel();
      this.job = scheduleJob("weeklyPost", "0 * * * * *", async () => {
        const mostLikedCmd = new MostLikedCommand();
        try {
          const tweets = await mostLikedCmd.getMostLikedTweets(bot, tweetCount);

          for (const channelId of this.channels) {
            bot.discordClient.createMessage(
              channelId,
              "Look at all this beautiful fur! ʕ·ᴥ·ʔ"
            );
            for (let i = 0; i < tweetCount; i++) {
              const tweet = tweets[i];
              const url = `https://twitter.com/i/web/status/${tweet.id}`;
              bot.discordClient.createMessage(channelId, url);
            }
          }
        } catch (e) {
          logger.error(`An error occured: ${e}`);
        }
      });
    } else {
      this.job?.cancel();
    }
  }
}
