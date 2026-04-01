import { useState } from 'react';

function App() {
  const [shelterId, setShelterId] = useState('');
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadShips = async () => {
    if (!shelterId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/shelter?shelterId=${shelterId}`);
      const data = await res.json();
      setShips(data.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'monospace', 
      color: 'lime', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '3rem' }}>SMART SHELTERS</h1>
      <input 
        type="text" 
        placeholder="Enter Shelter ID" 
        value={shelterId} 
        onChange={(e) => setShelterId(e.target.value)}
        style={{ width: '80%', padding: '10px', margin: '20px 0', fontSize: '1rem' }}
      />
      <button onClick={loadShips} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Load Ships from Shelter
      </button>
      <div>
        {loading ? 'Loading...' : `Ships in shelter: ${ships.length}`}
      </div>
      <div style={{ marginTop: '20px' }}>
        {ships.map((ship, i) => (
          <div key={i} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#111', width: '80%' }}>
            {ship}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '1rem', marginTop: '20px', color: '#666' }}>Sui integration via backend API</p>
    </div>
  );
}

export default App;
