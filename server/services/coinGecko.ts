const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY || process.env.VITE_COINGECKO_API_KEY || '';

interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

interface CoinGeckoNFT {
  id: string;
  name: string;
  floor_price: {
    native_currency: number;
  };
  floor_price_in_usd_24h_percentage_change: number;
}

class CoinGeckoService {
  private async makeRequest(endpoint: string): Promise<any> {
    const url = `${COINGECKO_API_BASE}${endpoint}`;
    const headers: HeadersInit = {
      'accept': 'application/json',
    };

    if (API_KEY) {
      headers['x-cg-demo-api-key'] = API_KEY;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getTopCryptocurrencies(limit = 10): Promise<CoinGeckoPrice[]> {
    try {
      const data = await this.makeRequest(
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );
      return data;
    } catch (error) {
      console.error('Error fetching cryptocurrency data:', error);
      throw error;
    }
  }

  async getCryptocurrencyById(id: string): Promise<CoinGeckoPrice> {
    try {
      const data = await this.makeRequest(
        `/coins/markets?vs_currency=usd&ids=${id}&sparkline=false`
      );
      return data[0];
    } catch (error) {
      console.error(`Error fetching cryptocurrency data for ${id}:`, error);
      throw error;
    }
  }

  async getMultipleCryptocurrencies(ids: string[]): Promise<CoinGeckoPrice[]> {
    try {
      const idsString = ids.join(',');
      const data = await this.makeRequest(
        `/coins/markets?vs_currency=usd&ids=${idsString}&sparkline=false`
      );
      return data;
    } catch (error) {
      console.error('Error fetching multiple cryptocurrency data:', error);
      throw error;
    }
  }

  async getCryptocurrencyPriceHistory(id: string, days = 1): Promise<number[][]> {
    try {
      const data = await this.makeRequest(
        `/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );
      return data.prices;
    } catch (error) {
      console.error(`Error fetching price history for ${id}:`, error);
      throw error;
    }
  }

  async getTopNFTCollections(): Promise<CoinGeckoNFT[]> {
    try {
      const data = await this.makeRequest('/nfts/list');
      return data.slice(0, 10); // Get top 10
    } catch (error) {
      console.error('Error fetching NFT collections:', error);
      // Return mock data if API fails
      return [
        {
          id: 'bored-ape-yacht-club',
          name: 'Bored Ape Yacht Club',
          floor_price: { native_currency: 28.5 },
          floor_price_in_usd_24h_percentage_change: 5.2,
        },
        {
          id: 'cryptopunks',
          name: 'CryptoPunks',
          floor_price: { native_currency: 58.9 },
          floor_price_in_usd_24h_percentage_change: -2.1,
        },
        {
          id: 'art-blocks-curated',
          name: 'Art Blocks Curated',
          floor_price: { native_currency: 2.1 },
          floor_price_in_usd_24h_percentage_change: 1.8,
        },
      ];
    }
  }
}

export const coinGeckoService = new CoinGeckoService();
