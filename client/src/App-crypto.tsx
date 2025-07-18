import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

// Simple dashboard without complex dependencies for now
function CryptoDashboard() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Price Ticker */}
      <div style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '12px 0',
        overflow: 'hidden'
      }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          BTC $43,250.92 +2.45% | ETH $2,634.18 +1.23% | BNB $245.67 -0.89%
        </div>
      </div>
      
      {/* Main Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CryptoTracker Pro
          </h1>
          <p style={{ color: '#9ca3af' }}>
            Real-time cryptocurrency tracking and simulation platform
          </p>
        </div>

        {/* Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Portfolio Stats */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #334155'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Portfolio Value
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              $12,485.92
            </p>
            <p style={{ color: '#10b981', fontSize: '0.9rem' }}>
              +$1,248.59 (+11.12%)
            </p>
          </div>

          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #334155'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Bitcoin Price
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              $43,250.92
            </p>
            <p style={{ color: '#10b981', fontSize: '0.9rem' }}>
              +2.45% (24h)
            </p>
          </div>

          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #334155'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Ethereum Price
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              $2,634.18
            </p>
            <p style={{ color: '#10b981', fontSize: '0.9rem' }}>
              +1.23% (24h)
            </p>
          </div>
        </div>

        {/* Top Cryptocurrencies */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #334155'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Top Cryptocurrencies
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { name: 'Bitcoin', symbol: 'BTC', price: '$43,250.92', change: '+2.45%', positive: true },
              { name: 'Ethereum', symbol: 'ETH', price: '$2,634.18', change: '+1.23%', positive: true },
              { name: 'BNB', symbol: 'BNB', price: '$245.67', change: '-0.89%', positive: false },
              { name: 'Cardano', symbol: 'ADA', price: '$0.47', change: '+3.21%', positive: true },
              { name: 'Solana', symbol: 'SOL', price: '$98.34', change: '+5.67%', positive: true }
            ].map((crypto, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: crypto.positive ? '#10b981' : '#ef4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {crypto.symbol.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '500' }}>{crypto.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{crypto.symbol}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '500' }}>{crypto.price}</p>
                  <p style={{ 
                    color: crypto.positive ? '#10b981' : '#ef4444',
                    fontSize: '0.875rem'
                  }}>
                    {crypto.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="crypto-theme">
        <TooltipProvider>
          <CryptoDashboard />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;