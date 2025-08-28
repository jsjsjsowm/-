import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  level: integer("level").default(1).notNull(),
  coins: integer("coins").default(0).notNull(),
  experience: integer("experience").default(0).notNull(),
  totalScore: integer("total_score").default(0).notNull(),
  gamesPlayed: integer("games_played").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyRewards = pgTable("daily_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  day: integer("day").notNull(),
  claimed: boolean("claimed").default(false).notNull(),
  claimedAt: timestamp("claimed_at"),
  resetAt: timestamp("reset_at").notNull(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reward: integer("reward").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const gameScores = pgTable("game_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  gameMode: text("game_mode").notNull(),
  score: integer("score").notNull(),
  coinsEarned: integer("coins_earned").notNull(),
  experienceEarned: integer("experience_earned").notNull(),
  playedAt: timestamp("played_at").defaultNow().notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rank: integer("rank").notNull(),
  score: integer("score").notNull(),
  period: text("period").notNull(), // daily, weekly, monthly, all_time
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  updatedAt: true,
});

export const insertDailyRewardSchema = createInsertSchema(dailyRewards).omit({
  id: true,
  claimedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  playedAt: true,
});

export type User = typeof users.$inferSelect;
export type Player = typeof players.$inferSelect;
export type DailyReward = typeof dailyRewards.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type GameScore = typeof gameScores.$inferSelect;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type InsertDailyReward = z.infer<typeof insertDailyRewardSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
