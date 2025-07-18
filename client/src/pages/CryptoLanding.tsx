import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bitcoin, TrendingUp, Shield, Users, ArrowRight, BarChart3, Wallet, Star, CheckCircle, Zap } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "wouter";

export default function CryptoLanding() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Bitcoin,
      title: "Real-Time Trading",
      description: "Track and trade cryptocurrencies with live market data and instant execution.",
      color: "text-orange-500"
    },
    {
      icon: Shield,
      title: "Portfolio Protection",
      description: "Advanced insurance calculations and risk management for your crypto assets.",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Referral Rewards",
      description: "Earn cryptocurrency commissions by referring new traders to our platform.",
      color: "text-blue-500"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Advanced portfolio analytics and market insights powered by AI.",
      color: "text-purple-500"
    },
    {
      icon: Wallet,
      title: "Multi-Currency Support",
      description: "Trade Bitcoin, Ethereum, and 100+ cryptocurrencies in one platform.",
      color: "text-cyan-500"
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Buy crypto instantly with Apple Pay, Google Pay, and bank transfers.",
      color: "text-yellow-500"
    }
  ];

  const stats = [
    { label: "Active Traders", value: "250K+", icon: Users },
    { label: "Trading Volume", value: "$2.5B", icon: TrendingUp },
    { label: "Cryptocurrencies", value: "100+", icon: Bitcoin },
    { label: "Security Rating", value: "AAA", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header showUserMenu={false} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              Trade Crypto Like a Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced cryptocurrency trading platform with real-time data, portfolio protection, 
              and smart features designed for serious traders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/api/login">
                <Button size="lg" className="btn-gradient text-lg px-8 py-3">
                  <Bitcoin className="h-5 w-5 mr-2" />
                  Start Trading Now
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-white/20 hover:bg-white/10">
                  Explore Features
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Trade Crypto
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From beginner-friendly tools to advanced trading features, we've got everything 
              covered for your cryptocurrency journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 ${hoveredFeature === index ? 'scale-110' : ''} transition-transform duration-300`}>
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Choose CryptoTrader Pro?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Advanced Security</h3>
                    <p className="text-gray-400">
                      Bank-grade security with 2FA, encrypted storage, and insurance protection for your digital assets.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
                    <p className="text-gray-400">
                      Live market data, instant price updates, and real-time portfolio tracking across all major exchanges.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Smart Tools</h3>
                    <p className="text-gray-400">
                      AI-powered analytics, automated trading strategies, and intelligent portfolio rebalancing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-center">Live Portfolio Preview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <Bitcoin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Bitcoin</p>
                        <p className="text-sm text-gray-400">BTC</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">+12.5%</p>
                      <p className="text-sm text-gray-400">$67,234</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Ξ</span>
                      </div>
                      <div>
                        <p className="font-medium">Ethereum</p>
                        <p className="text-sm text-gray-400">ETH</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">+8.3%</p>
                      <p className="text-sm text-gray-400">$3,456</p>
                    </div>
                  </div>
                  
                  <div className="text-center pt-4 border-t border-gray-600">
                    <p className="text-2xl font-bold text-green-400">$125,890</p>
                    <p className="text-sm text-gray-400">Total Portfolio Value</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of traders who trust CryptoTrader Pro for their cryptocurrency investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/api/login">
                <Button size="lg" className="btn-gradient text-lg px-8 py-3">
                  <Star className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-white/20 hover:bg-white/10">
                  View All Features
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Start trading in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 CryptoTrader Pro. All rights reserved. Trade responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}