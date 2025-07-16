import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

export default function PriceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('1');

  const { data: priceHistory } = useQuery<number[][]>({
    queryKey: ["/api/cryptocurrencies", selectedCrypto, "history", { days: timeframe }],
  });

  useEffect(() => {
    if (!canvasRef.current || !priceHistory || typeof window === 'undefined') return;

    const loadChart = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const labels = priceHistory.map((_, index) => {
        const date = new Date(Date.now() - (priceHistory.length - index - 1) * 24 * 60 * 60 * 1000);
        return date.toLocaleDateString();
      });

      const prices = priceHistory.map(point => point[1]);

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Price',
            data: prices,
            borderColor: 'hsl(207, 90%, 54%)',
            backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: true,
              grid: {
                color: 'hsl(240, 3.7%, 15.9%)'
              },
              ticks: {
                color: 'hsl(240, 5%, 64.9%)'
              }
            },
            y: {
              display: true,
              grid: {
                color: 'hsl(240, 3.7%, 15.9%)'
              },
              ticks: {
                color: 'hsl(240, 5%, 64.9%)',
                callback: function(value: any) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index',
          }
        }
      });
    };

    loadChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [priceHistory]);

  return (
    <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Price Chart</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeframe('1')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeframe === '1' 
                ? 'bg-[hsl(207,90%,54%)] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            24H
          </button>
          <button 
            onClick={() => setTimeframe('7')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeframe === '7' 
                ? 'bg-[hsl(207,90%,54%)] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            7D
          </button>
          <button 
            onClick={() => setTimeframe('30')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeframe === '30' 
                ? 'bg-[hsl(207,90%,54%)] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            1M
          </button>
        </div>
      </div>
      <div className="relative h-[300px]">
        <canvas ref={canvasRef} />
      </div>
    </Card>
  );
}
