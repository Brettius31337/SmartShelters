import { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

function App() {
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const account = useCurrentAccount();
  const client = useSuiClient();

  // Auto-load user's shelters when wallet connects
  useEffect(() => {
    const fetchOwnedShelters = async () => {
      if (!account) {
        setShelters([]);
        setSelectedShelter(null);
        setShips([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: '0x0::smartshelters::smartshelters::SmartShelter'
          },
          options: { showContent: true }
        });

        const owned = result.data.map(obj => ({
          id: obj.data.objectId,
          ships: obj.data.content?.fields?.ships || []
        }));

        setShelters(owned);

        if (owned.length === 1) {
          setSelectedShelter(owned[0]);
          setShips(owned[0].ships);
        } else if (owned.length > 1) {
          setSelectedShelter(owned[0]);
          setShips(owned[0].ships);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load shelters. Make sure you are connected to the correct network.');
      }
      setLoading(false);
    };

    fetchOwnedShelters();
  }, [wallet.connected, wallet.currentAccount, client]);

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'monospace', 
      color: '#00ff9f', 
      backgroundColor: '#0a0a0a', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3.2rem', marginBottom: '10px', letterSpacing: '4px' }}>SMART SHELTERS</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>EVE FRONTIER CIVILIZATION TOOLKIT</p>

      <ConnectButton />

      {account && <div style={{marginTop:'10px', color:'#0a0'}}>Connected: {account.address.slice(0,8)}...{account.address.slice(-6)}</div>}

      {wallet.connected && (
        <div style={{ marginTop: '30px', width: '100%', maxWidth: '700px' }}>
          {loading && <div>Loading your shelters...</div>}
          {error && <div style={{color:'red'}}>{error}</div>}

          {shelters.length === 0 && !loading && (
            <div>No SmartShelters found in this wallet.</div>
          )}

          {shelters.length > 0 && (
            <div>
              <div style={{marginBottom: '15px'}}>
                Owned Shelters: {shelters.length}
              </div>

              <select 
                value={selectedShelter?.id || ''}
                onChange={(e) => {
                  const shelter = shelters.find(s => s.id === e.target.value);
                  if (shelter) {
                    setSelectedShelter(shelter);
                    setShips(shelter.ships);
                  }
                }}
                style={{ width: '100%', padding: '12px', background: '#111', color: '#0f0', border: '1px solid #0f0', marginBottom: '20px' }}
              >
                {shelters.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.id.slice(0,8)}...{s.id.slice(-6)} ({s.ships.length} ships)
                  </option>
                ))}
              </select>

              <div style={{ background: '#111', padding: '20px', border: '1px solid #0f0' }}>
                <h3>Ships in Shelter</h3>
                <div style={{ color: '#aaa', marginBottom: '15px' }}>
                  Object ID: <span style={{color:'#0f0'}}>{selectedShelter?.id}</span>
                </div>
                {ships.length === 0 ? (
                  <div>No ships stored yet.</div>
                ) : (
                  ships.map((ship, i) => (
                    <div key={i} style={{ 
                      margin: '8px 0', 
                      padding: '12px', 
                      backgroundColor: '#1a1a1a', 
                      borderLeft: '3px solid #00ff9f' 
                    }}>
                      Ship {i+1}: {ship}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!account && (
        <div style={{marginTop: '40px', color:'#555', textAlign:'center'}}>
          Connect your Sui wallet to automatically load your SmartShelters<br/>
          (no manual ID entry required)
        </div>
      )}
    </div>
  );
}

export default App;
