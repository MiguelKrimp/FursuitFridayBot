import Eris from "eris";
import { TwitterApiRequestError } from "twitter-api-v2";
import { DiscordBot } from "../bot/DiscordBot";
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
    if (+params[0] && +params[0] < 10) {
      maxResults = +params[0];
    }

    const response = await bot.twitterClient.search("fursuitfriday", {
      "tweet.fields": ["lang"],
      max_results: 10,
    });

    for (let i = 0; i < maxResults; i++) {
      const tweet = response.data.data[i];
      const url = `https://twitter.com/i/web/status/${tweet.id}`;

      bot.discordClient.createMessage(msg.channel.id, url);
    }
  }
}
