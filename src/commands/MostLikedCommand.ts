import Eris from "eris";
import { DiscordBot } from "../bot/DiscordBot";
import { TwitterError } from "../types/Error";
import { AbstractCommand } from "./AbstractCommand";
import { getMaxResults } from "./Utils";

export class MostLikedCommand extends AbstractCommand {
  constructor() {
    super("mostLiked");
  }

  async run(
    bot: DiscordBot,
    msg: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
    params: string[]
  ) {
    const maxResults = getMaxResults(params[0]);

    const response = await bot.twitterClient.v2
      .search("fursuitfriday", {
        "tweet.fields": ["public_metrics"],
        max_results: 100,
      })
      .catch((e) => {
        throw new TwitterError(e);
      });

    const tweets = [...response.data.data];

    tweets.sort(
      (a, b) =>
        (b.public_metrics?.like_count || 0) -
        (a.public_metrics?.like_count || 0)
    );

    console.log(tweets[0].public_metrics);

    for (let i = 0; i < maxResults; i++) {
      const tweet = tweets[i];
      const url = `https://twitter.com/i/web/status/${tweet.id}`;

      bot.discordClient.createMessage(msg.channel.id, url);
    }
  }
}
