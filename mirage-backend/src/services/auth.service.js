import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema/users.js";

export async function findOrCreateDiscordUser(discordUser) {
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.discordId, discordUser.id))
    .limit(1);

  const existingUser = existingUsers[0];

  const avatar = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    : null;

  if (existingUser) {
    const updatedUsers = await db
      .update(users)
      .set({
        username: discordUser.username,
        avatar,
        email: discordUser.email || existingUser.email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))
      .returning();

    return updatedUsers[0];
  }

  const createdUsers = await db
    .insert(users)
    .values({
      discordId: discordUser.id,
      username: discordUser.username,
      avatar,
      email: discordUser.email || null,
    })
    .returning();

  return createdUsers[0];
}

export async function getUserById(userId) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] || null;
}