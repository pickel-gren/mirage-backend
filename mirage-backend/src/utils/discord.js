import env from "../config/env.js";

const DISCORD_API_BASE_URL = "https://discord.com/api/v10";

export function getDiscordAuthorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: env.discord.clientId,
    redirect_uri: env.discord.redirectUri,
    response_type: "code",
    scope: "identify email",
    state,
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code) {
  const body = new URLSearchParams({
    client_id: env.discord.clientId,
    client_secret: env.discord.clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: env.discord.redirectUri,
  });

  const response = await fetch(`${DISCORD_API_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Discord token exchange failed");
  }

  return response.json();
}

export async function getDiscordUser(accessToken) {
  const response = await fetch(`${DISCORD_API_BASE_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Discord user lookup failed");
  }

  return response.json();
}