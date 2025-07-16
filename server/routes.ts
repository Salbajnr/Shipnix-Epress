import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { coinGeckoService } from "./services/coinGecko";
import { insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Cryptocurrency routes
  app.get('/api/cryptocurrencies', async (req, res) => {
    try {
      const cryptos = await storage.getTopCryptocurrencies(10);
      res.json(cryptos);
    } catch (error) {
      console.error("Error fetching cryptocurrencies:", error);
      res.status(500).json({ message: "Failed to fetch cryptocurrencies" });
    }
  });

  app.get('/api/cryptocurrencies/:id/history', async (req, res) => {
    try {
      const { id } = req.params;
      const { days = '1' } = req.query;
      const history = await coinGeckoService.getCryptocurrencyPriceHistory(id, parseInt(days as string));
      res.json(history);
    } catch (error) {
      console.error(`Error fetching price history for ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });

  // Portfolio routes
  app.get('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let portfolio = await storage.getPortfolioByUserId(userId);
      
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId,
          name: "Main Portfolio",
          isDefault: true,
        });
      }

      const holdings = await storage.getHoldingsByPortfolioId(portfolio.id);
      const transactions = await storage.getTransactionsByPortfolioId(portfolio.id, 5);
      
      res.json({
        portfolio,
        holdings,
        transactions,
      });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Admin routes for simulating transactions
  app.post('/api/admin/simulate-transaction', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolio = await storage.getPortfolioByUserId(userId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        portfolioId: portfolio.id,
        isSimulated: true,
      });

      const transaction = await storage.createTransaction(transactionData);

      // Update holdings based on transaction
      if (transactionData.type === 'buy') {
        const existingHoldings = await storage.getHoldingsByPortfolioId(portfolio.id);
        const existingHolding = existingHoldings.find(h => h.cryptoId === transactionData.cryptoId);
        
        if (existingHolding) {
          const newAmount = parseFloat(existingHolding.amount) + parseFloat(transactionData.amount);
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            cryptoId: transactionData.cryptoId,
            amount: newAmount.toString(),
            averageCost: transactionData.price,
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            cryptoId: transactionData.cryptoId,
            amount: transactionData.amount,
            averageCost: transactionData.price,
          });
        }
      }

      // Broadcast transaction to WebSocket clients
      broadcastToClients('transaction', { transaction, userId });

      res.json(transaction);
    } catch (error) {
      console.error("Error simulating transaction:", error);
      res.status(500).json({ message: "Failed to simulate transaction" });
    }
  });

  app.post('/api/admin/simulate-market', isAuthenticated, async (req: any, res) => {
    try {
      const { action } = req.body; // 'bull' or 'bear'
      const multiplier = action === 'bull' ? 1.1 : 0.9;
      
      const cryptos = await storage.getCryptocurrencies();
      
      for (const crypto of cryptos) {
        const newPrice = parseFloat(crypto.currentPrice || '0') * multiplier;
        const priceChange = newPrice - parseFloat(crypto.currentPrice || '0');
        const priceChangePercentage = (priceChange / parseFloat(crypto.currentPrice || '1')) * 100;
        
        await storage.upsertCryptocurrency({
          ...crypto,
          currentPrice: newPrice.toString(),
          priceChange24h: priceChange.toString(),
          priceChangePercentage24h: priceChangePercentage.toString(),
        });
      }

      // Broadcast market update to WebSocket clients
      broadcastToClients('marketUpdate', { action, multiplier });

      res.json({ message: `${action} market simulation applied` });
    } catch (error) {
      console.error("Error simulating market:", error);
      res.status(500).json({ message: "Failed to simulate market" });
    }
  });

  // NFT routes
  app.get('/api/nft-collections', async (req, res) => {
    try {
      const collections = await storage.getTopNFTCollections();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching NFT collections:", error);
      res.status(500).json({ message: "Failed to fetch NFT collections" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);
    console.log('New WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  function broadcastToClients(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Update cryptocurrency prices every 30 seconds
  setInterval(async () => {
    try {
      const cryptoData = await coinGeckoService.getTopCryptocurrencies(10);
      
      for (const crypto of cryptoData) {
        await storage.upsertCryptocurrency({
          id: crypto.id,
          symbol: crypto.symbol,
          name: crypto.name,
          currentPrice: crypto.current_price.toString(),
          priceChange24h: crypto.price_change_24h?.toString() || '0',
          priceChangePercentage24h: crypto.price_change_percentage_24h?.toString() || '0',
          marketCap: crypto.market_cap?.toString() || '0',
          marketCapRank: crypto.market_cap_rank || 0,
          totalVolume: crypto.total_volume?.toString() || '0',
        });
      }

      broadcastToClients('priceUpdate', cryptoData);
    } catch (error) {
      console.error('Error updating cryptocurrency prices:', error);
    }
  }, 30000);

  // Update NFT collections every 5 minutes
  setInterval(async () => {
    try {
      const nftData = await coinGeckoService.getTopNFTCollections();
      
      for (const nft of nftData) {
        await storage.upsertNFTCollection({
          name: nft.name,
          slug: nft.id,
          floorPrice: nft.floor_price?.native_currency?.toString() || '0',
          priceChangePercentage24h: nft.floor_price_in_usd_24h_percentage_change?.toString() || '0',
          imageUrl: `https://images.unsplash.com/photo-1635322966219-b75ed372eb01?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64`,
        });
      }

      broadcastToClients('nftUpdate', nftData);
    } catch (error) {
      console.error('Error updating NFT collections:', error);
    }
  }, 300000);

  return httpServer;
}
