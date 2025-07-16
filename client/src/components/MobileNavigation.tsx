export default function MobileNavigation() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(240,3.7%,15.9%)] border-t border-[hsl(240,3.7%,15.9%)]">
      <div className="grid grid-cols-5 py-2">
        <button className="flex flex-col items-center justify-center py-2 text-[hsl(207,90%,54%)]">
          <i className="fas fa-home text-lg"></i>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center py-2 text-gray-400">
          <i className="fas fa-chart-line text-lg"></i>
          <span className="text-xs mt-1">Markets</span>
        </button>
        <button className="flex flex-col items-center justify-center py-2 text-gray-400">
          <i className="fas fa-wallet text-lg"></i>
          <span className="text-xs mt-1">Portfolio</span>
        </button>
        <button className="flex flex-col items-center justify-center py-2 text-gray-400">
          <i className="fas fa-gem text-lg"></i>
          <span className="text-xs mt-1">NFTs</span>
        </button>
        <button className="flex flex-col items-center justify-center py-2 text-gray-400">
          <i className="fas fa-user text-lg"></i>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}
