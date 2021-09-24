import Eris from "eris";
import { DiscordBot } from "../bot/DiscordBot";
import { TwitterError } from "../types/Error";
import { AbstractCommand } from "./AbstractCommand";

export class ShowRecentCommand extends AbstractCommand {
  constructor() {
    super("recent");
  }

  async run(
    bot: DiscordBot,
    msg: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
    params: string[]
  ) {
    let maxResults = 1;
    if (+params[0]) {
      maxResults = +params[0];
      if (maxResults > 10) {
        maxResults = 10;
      }
    }

    const response = await bot.twitterClient
      .search("fursuitfriday", {
        "tweet.fields": ["lang"],
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
