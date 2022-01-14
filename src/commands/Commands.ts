import { HelpCommand } from "./HelpCommand";
import { MostLikedCommand } from "./MostLikedCommand";
import { ShowRecentCommand } from "./ShowRecentCommand";
import { SubscribeCommand } from "./SubscribeCommand";

export const commands = {
  help: HelpCommand,
  mostLiked: MostLikedCommand,
  recent: ShowRecentCommand,
  subscribe: SubscribeCommand,
};
