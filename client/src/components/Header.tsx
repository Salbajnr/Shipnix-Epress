import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-[hsl(240,3.7%,15.9%)] border-b border-[hsl(240,3.7%,15.9%)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[hsl(207,90%,54%)] rounded-lg flex items-center justify-center">
              <i className="fas fa-coins text-white"></i>
            </div>
            <h1 className="text-xl font-bold">CoinStats</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-[hsl(207,90%,54%)] transition-colors">Portfolio</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Markets</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">NFTs</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">News</a>
            <a href="#admin" className="text-gray-400 hover:text-[hsl(207,90%,54%)] transition-colors">Admin</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-[hsl(240,10%,3.9%)] hover:bg-gray-700 transition-colors">
              <i className="fas fa-bell"></i>
            </button>
            <div className="flex items-center space-x-2">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-[hsl(207,90%,54%)] to-purple-600 rounded-full"></div>
              )}
              <span className="hidden sm:block text-sm">
                {user?.firstName || user?.email || 'User'}
              </span>
              <button 
                onClick={() => window.location.href = '/api/logout'}
                className="text-gray-400 hover:text-white text-sm ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
