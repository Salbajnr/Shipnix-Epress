import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function DebugApp() {
  console.log("DebugApp rendering...");
  
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Debug Application</h1>
      <p>React is working correctly!</p>
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <h3>Debug Info:</h3>
        <p>Current URL: {window.location.href}</p>
        <p>User Agent: {navigator.userAgent}</p>
        <p>Environment: {process.env.NODE_ENV || 'development'}</p>
      </div>
    </div>
  );
}

export default function App() {
  console.log("App wrapper rendering...");
  
  return (
    <QueryClientProvider client={queryClient}>
      <DebugApp />
    </QueryClientProvider>
  );
}