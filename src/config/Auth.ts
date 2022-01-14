export interface Auth {
  discord: DiscordAuth;
  twitter: TwitterAuth;
}

export interface DiscordAuth {
  token: string;
}

export interface TwitterAuth {
  bearerToken: string;
}
