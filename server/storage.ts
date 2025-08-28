import { type User, type Player, type DailyReward, type Achievement, type GameScore, type LeaderboardEntry, type InsertUser, type InsertPlayer, type InsertDailyReward, type InsertAchievement, type InsertGameScore } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player methods
  getPlayer(userId: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(userId: string, updates: Partial<Player>): Promise<Player>;
  
  // Daily rewards methods
  getDailyRewards(userId: string): Promise<DailyReward[]>;
  claimDailyReward(userId: string, day: number): Promise<DailyReward>;
  resetDailyRewards(userId: string): Promise<void>;
  
  // Achievement methods
  getAchievements(userId: string): Promise<Achievement[]>;
  addAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Game score methods
  addGameScore(score: InsertGameScore): Promise<GameScore>;
  getRecentScores(userId: string, limit?: number): Promise<GameScore[]>;
  
  // Leaderboard methods
  getLeaderboard(period: string, limit?: number): Promise<(LeaderboardEntry & { user: User })[]>;
  updateLeaderboard(userId: string, score: number, period: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private players: Map<string, Player>;
  private dailyRewards: Map<string, DailyReward[]>;
  private achievements: Map<string, Achievement[]>;
  private gameScores: Map<string, GameScore[]>;
  private leaderboard: Map<string, LeaderboardEntry[]>;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.dailyRewards = new Map();
    this.achievements = new Map();
    this.gameScores = new Map();
    this.leaderboard = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getPlayer(userId: string): Promise<Player | undefined> {
    return this.players.get(userId);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { 
      ...insertPlayer, 
      id,
      updatedAt: new Date()
    };
    this.players.set(insertPlayer.userId, player);
    return player;
  }

  async updatePlayer(userId: string, updates: Partial<Player>): Promise<Player> {
    const existing = this.players.get(userId);
    if (!existing) {
      throw new Error('Player not found');
    }
    
    const updated: Player = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.players.set(userId, updated);
    return updated;
  }

  async getDailyRewards(userId: string): Promise<DailyReward[]> {
    return this.dailyRewards.get(userId) || [];
  }

  async claimDailyReward(userId: string, day: number): Promise<DailyReward> {
    const rewards = this.dailyRewards.get(userId) || [];
    const reward = rewards.find(r => r.day === day);
    
    if (!reward) {
      throw new Error('Daily reward not found');
    }
    
    if (reward.claimed) {
      throw new Error('Daily reward already claimed');
    }

    reward.claimed = true;
    reward.claimedAt = new Date();
    
    this.dailyRewards.set(userId, rewards);
    return reward;
  }

  async resetDailyRewards(userId: string): Promise<void> {
    const rewards: DailyReward[] = [];
    const resetAt = new Date();
    resetAt.setDate(resetAt.getDate() + 1);

    for (let day = 1; day <= 7; day++) {
      rewards.push({
        id: randomUUID(),
        userId,
        day,
        claimed: false,
        claimedAt: null,
        resetAt
      });
    }

    this.dailyRewards.set(userId, rewards);
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    return this.achievements.get(userId) || [];
  }

  async addAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      unlockedAt: new Date()
    };
    
    const userAchievements = this.achievements.get(insertAchievement.userId) || [];
    userAchievements.push(achievement);
    this.achievements.set(insertAchievement.userId, userAchievements);
    
    return achievement;
  }

  async addGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = randomUUID();
    const score: GameScore = {
      ...insertScore,
      id,
      playedAt: new Date()
    };
    
    const userScores = this.gameScores.get(insertScore.userId) || [];
    userScores.push(score);
    this.gameScores.set(insertScore.userId, userScores);
    
    return score;
  }

  async getRecentScores(userId: string, limit: number = 10): Promise<GameScore[]> {
    const scores = this.gameScores.get(userId) || [];
    return scores
      .sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime())
      .slice(0, limit);
  }

  async getLeaderboard(period: string, limit: number = 10): Promise<(LeaderboardEntry & { user: User })[]> {
    const entries = this.leaderboard.get(period) || [];
    
    return entries
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry, index) => {
        const user = this.users.get(entry.userId);
        return {
          ...entry,
          rank: index + 1,
          user: user!
        };
      });
  }

  async updateLeaderboard(userId: string, score: number, period: string): Promise<void> {
    const entries = this.leaderboard.get(period) || [];
    const existingIndex = entries.findIndex(e => e.userId === userId);
    
    if (existingIndex >= 0) {
      if (entries[existingIndex].score < score) {
        entries[existingIndex] = {
          ...entries[existingIndex],
          score,
          updatedAt: new Date()
        };
      }
    } else {
      entries.push({
        id: randomUUID(),
        userId,
        rank: 0,
        score,
        period,
        updatedAt: new Date()
      });
    }
    
    this.leaderboard.set(period, entries);
  }
}

export const storage = new MemStorage();
