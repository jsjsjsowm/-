import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameScoreSchema } from "@shared/schema";
import { z } from "zod";

const telegramUserSchema = z.object({
  id: z.number(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize user from Telegram data
  app.post("/api/auth/telegram", async (req, res) => {
    try {
      const telegramUser = telegramUserSchema.parse(req.body);
      
      let user = await storage.getUserByTelegramId(telegramUser.id.toString());
      
      if (!user) {
        user = await storage.createUser({
          telegramId: telegramUser.id.toString(),
          username: telegramUser.username || null,
          firstName: telegramUser.first_name || null,
          lastName: telegramUser.last_name || null,
          photoUrl: telegramUser.photo_url || null,
        });
        
        // Create player profile
        await storage.createPlayer({
          userId: user.id,
          level: 1,
          coins: 0,
          experience: 0,
          totalScore: 0,
          gamesPlayed: 0,
        });
        
        // Initialize daily rewards
        await storage.resetDailyRewards(user.id);
      }
      
      res.json({ user });
    } catch (error) {
      console.error("Auth error:", error);
      res.status(400).json({ error: "Invalid telegram data" });
    }
  });

  // Get player data
  app.get("/api/player/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const player = await storage.getPlayer(userId);
      
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to get player" });
    }
  });

  // Get daily rewards
  app.get("/api/daily-rewards/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const rewards = await storage.getDailyRewards(userId);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: "Failed to get daily rewards" });
    }
  });

  // Claim daily reward
  app.post("/api/daily-rewards/:userId/claim", async (req, res) => {
    try {
      const { userId } = req.params;
      const { day } = req.body;
      
      const reward = await storage.claimDailyReward(userId, day);
      
      // Update player coins based on reward
      const rewardCoins = [100, 150, 200, 250, 300, 400, 500][day - 1] || 100;
      const player = await storage.getPlayer(userId);
      if (player) {
        await storage.updatePlayer(userId, {
          coins: player.coins + rewardCoins
        });
      }
      
      res.json({ reward, coinsEarned: rewardCoins });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Get achievements
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const achievements = await storage.getAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to get achievements" });
    }
  });

  // Submit game score
  app.post("/api/game/score", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      const score = await storage.addGameScore(scoreData);
      
      // Update player stats
      const player = await storage.getPlayer(scoreData.userId);
      if (player) {
        const updatedPlayer = await storage.updatePlayer(scoreData.userId, {
          coins: player.coins + scoreData.coinsEarned,
          experience: player.experience + scoreData.experienceEarned,
          totalScore: player.totalScore + scoreData.score,
          gamesPlayed: player.gamesPlayed + 1,
        });

        // Check for level up (every 1000 XP = 1 level)
        const newLevel = Math.floor(updatedPlayer.experience / 1000) + 1;
        if (newLevel > updatedPlayer.level) {
          await storage.updatePlayer(scoreData.userId, {
            level: newLevel
          });
        }
      }
      
      // Update leaderboard
      await storage.updateLeaderboard(scoreData.userId, scoreData.score, 'all_time');
      
      res.json({ score, message: "Score submitted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Invalid score data" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { period = 'all_time', limit = 10 } = req.query;
      const leaderboard = await storage.getLeaderboard(
        period as string, 
        parseInt(limit as string)
      );
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
