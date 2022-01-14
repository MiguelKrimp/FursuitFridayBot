import Eris from "eris";
import { Job, scheduleJob } from "node-schedule";
import { DiscordBot } from "../bot/DiscordBot";
import { getDefaultLogger } from "../logging";
import { AbstractCommand } from "./AbstractCommand";
import { MostLikedCommand } from "./MostLikedCommand";

const tweetCount = 3;

const logger = getDefaultLogger("ScheduleCommand");

export class SubscribeCommand extends AbstractCommand {
  private job?: Job;

  private channels: string[] = [];

  inititalize(bot: DiscordBot): void {
    this.channels = bot.readFsfSubscriptions();
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
        "You subscribed to the Best of Fursuitsuit Friday!"
      );
    } else {
      this.channels.push(msg.channel.id);

      bot.discordClient.createMessage(
        msg.channel.id,
        "You unsubscribed from the Best of Fursuit Friday!"
      );
    }
    bot.writeFsfSubscriptions(this.channels);

    this.job?.cancel();
    if (this.channels.length > 0) {
      this.job = scheduleJob("weeklyPost", "0 0 18 * * 5", async () => {
        const mostLikedCmd = new MostLikedCommand("");
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
    }
  }
}
