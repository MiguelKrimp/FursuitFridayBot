export interface Auth {
  discord: {
    token?: string;
  };
  twitter: TwitterAuth;
}

export interface TwitterAuth {
  bearerToken: string;
}
