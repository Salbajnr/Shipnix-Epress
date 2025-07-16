import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

interface NFTCollection {
  id: number;
  name: string;
  slug: string;
  floorPrice: string;
  priceChangePercentage24h: string;
  imageUrl?: string;
}

export default function TopNFTCollections() {
  const { data: collections, isLoading } = useQuery<NFTCollection[]>({
    queryKey: ["/api/nft-collections"],
  });

  if (isLoading) {
    return (
      <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="h-3 bg-gray-700 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const defaultCollections = [
    {
      id: 1,
      name: 'Bored Ape Yacht Club',
      slug: 'bored-ape-yacht-club',
      floorPrice: '28.5',
      priceChangePercentage24h: '5.2',
      imageUrl: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64'
    },
    {
      id: 2,
      name: 'CryptoPunks',
      slug: 'cryptopunks',
      floorPrice: '58.9',
      priceChangePercentage24h: '-2.1',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64'
    },
    {
      id: 3,
      name: 'Art Blocks Curated',
      slug: 'art-blocks-curated',
      floorPrice: '2.1',
      priceChangePercentage24h: '1.8',
      imageUrl: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64'
    }
  ];

  const displayCollections = collections && collections.length > 0 ? collections : defaultCollections;

  return (
    <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
      <h3 className="text-xl font-bold mb-6">Top NFT Collections</h3>
      
      <div className="space-y-4">
        {displayCollections.slice(0, 3).map((collection) => {
          const change = parseFloat(collection.priceChangePercentage24h);
          const isPositive = change >= 0;
          
          return (
            <div key={collection.id} className="flex items-center space-x-3">
              <img 
                src={collection.imageUrl || 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64'} 
                alt={collection.name}
                className="w-12 h-12 rounded-lg object-cover" 
              />
              <div className="flex-1">
                <p className="font-medium">{collection.name}</p>
                <p className="text-gray-400 text-sm">Floor: {parseFloat(collection.floorPrice).toFixed(1)} ETH</p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${isPositive ? 'text-[hsl(142,76%,36%)]' : 'text-[hsl(0,84%,60%)]'}`}>
                  {isPositive ? '+' : ''}{change.toFixed(1)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
