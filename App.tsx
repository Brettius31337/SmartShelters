import { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSuiClient, useExecuteTransaction } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui/transactions';

function App() {
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [ships, setShips] = useState([]);
  const [shipId, setShipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: executeTx } = useExecuteTransaction();

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
  }, [account?.address, client]);

  async function depositShip() {
    if (!selectedShelter || !shipId) {
      setError('Select shelter and enter ship ID');
      return;
    }
    setError('');
    const tx = new TransactionBlock();
    tx.moveCall({
      target: '0x0::smartshelters::smartshelters::swap_ship',
      arguments: [
        tx.object(selectedShelter.id),
        tx.pure(shipId),
        tx.pure(true)
      ],
    });
    try {
      const result = await executeTx({
        transactionBlock: tx,
      });
      console.log('Deposit:', result);
      // Refetch
      fetchOwnedShelters();
    } catch (err) {
      setError('Deposit failed: ' + (err.message || err));
    }
  }

  async function withdrawShip() {
    if (!selectedShelter || !shipId || !ships.includes(shipId)) {
      setError('Ship not in shelter or missing');
      return;
    }
    setError('');
    const tx = new TransactionBlock();
    tx.moveCall({
      target: '0x0::smartshelters::smartshelters::swap_ship',
      arguments: [
        tx.object(selectedShelter.id),
        tx.pure(shipId),
        tx.pure(false)
      ],
    });
    try {
      const result = await executeTx({
        transactionBlock: tx,
      });
      console.log('Withdraw:', result);
      fetchOwnedShelters();
    } catch (err) {
      setError('Withdraw failed: ' + (err.message || err));
    }
  }

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
                  <>
                    <div style={{marginBottom: '15px'}}>
                      <input 
                        value={shipId}
                        onChange={(e) => setShipId(e.target.value)}
                        placeholder="Enter ship address"
                        style={{ padding: '8px', width: '70%', marginRight: '10px', background: '#1a1a1a', color: '#0f0', border: '1px solid #0f0' }}
                      />
                      <button 
                        onClick={() => depositShip()}
                        style={{ padding: '8px 16px', background: '#00ff9f', color: '#000', border: 'none', cursor: 'pointer' }}
                      >Deposit</button>
                      <button 
                        onClick={() => withdrawShip()}
                        style={{ padding: '8px 16px', background: '#ff4d4d', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
                      >Withdraw</button>
                    </div>
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
