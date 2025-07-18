export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Shipnix-Express
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#64748b',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Global Logistics & Package Tracking Platform
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
              📦 Package Tracking
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Real-time tracking for packages worldwide with detailed status updates and delivery notifications.
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
              🚚 Global Shipping
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Fast and reliable shipping to over 220 countries and territories worldwide.
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
              📊 Admin Dashboard
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Comprehensive admin panel for managing packages, tracking, and customer communications.
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            Track Package
          </button>
          
          <button style={{
            background: 'white',
            color: '#3b82f6',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}