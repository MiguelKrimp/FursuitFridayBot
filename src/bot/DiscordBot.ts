import * as ERIS from "eris";

export class DiscordBot {
  private client: ERIS.Client;

  constructor(client: ERIS.Client) {
    this.client = client;
  }

  start() {
    this.intilializeListeners();
    this.client.connect();
  }

  private intilializeListeners() {
    this.client.on("ready", async () => {
      console.log("Connected");
    });

    this.client.on("messageCreate", async (msg) => {
      if (msg.author.id !== this.client.user.id) {
        console.log(msg.content);

        await this.client.createMessage(msg.channel.id, "Echo: " + msg.content);
      }
    });

    this.client.on("error", (e) => {
      console.log(e);
    });
  }
}
