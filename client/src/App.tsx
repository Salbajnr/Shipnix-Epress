function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Shipnix-Express - Global Logistics Solutions
        </h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to Shipnix-Express! The application is loading...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
