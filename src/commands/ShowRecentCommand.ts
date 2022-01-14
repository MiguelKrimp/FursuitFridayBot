import Eris from "eris";
import { DiscordBot } from "../bot/DiscordBot";
import { TwitterError } from "../config/Error";
import { AbstractCommand } from "./AbstractCommand";
import { getMaxResults } from "./Utils";

export class ShowRecentCommand extends AbstractCommand {
  async run(
    bot: DiscordBot,
    msg: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
    params: string[]
  ) {
    const maxResults = getMaxResults(params[0]);

    const response = await bot.twitterClient.v2
      .search("fursuitfriday", {
        max_results: 10,
      })
      .catch((e) => {
        throw new TwitterError(e);
      });

    for (let i = 0; i < maxResults; i++) {
      const tweet = response.data.data[i];
      const url = `https://twitter.com/i/web/status/${tweet.id}`;

      bot.discordClient.createMessage(msg.channel.id, url);
    }
  }
}
