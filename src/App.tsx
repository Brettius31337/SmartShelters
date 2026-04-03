import { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

function App() {
  // Hardcoded to your specific Shelter for Phase 1
  const HARDCODED_SHELTER_ID = '0xa5bf5396398cec9433e63019235174a0461b09952c73da71b96eb3b9e6e9091a';

  const [selectedShelter, setSelectedShelter] = useState(null);
  const [ships, setShips] = useState([]);
  const [shipId, setShipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: executeTx } = useSignAndExecuteTransaction();

  // Load your specific Shelter (Phase 1 - hardcoded)
  useEffect(() => {
    const loadShelter = async () => {
      if (!account) {
        setSelectedShelter(null);
        setShips([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await client.getObject({
          id: HARDCODED_SHELTER_ID,
          options: { showContent: true }
        });

        if (result.data) {
          const shelterData = {
            id: result.data.objectId,
            ships: result.data.content?.fields?.ships || [],
            owner: result.data.content?.fields?.owner
          };
          setSelectedShelter(shelterData);
          setShips(shelterData.ships);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load your Shelter. Make sure you are connected to the correct network.');
      }
      setLoading(false);
    };

    loadShelter();
  }, [account?.address, client]);

  async function depositShip() {
    if (!selectedShelter || !shipId) {
      setError('Enter a ship ID to deposit');
      return;
    }
    setError('');
    const tx = new Transaction();
    tx.moveCall({
      target: '0x0::smartshelters::smartshelters::swap_ship_on_assembly',
      arguments: [
        tx.object(HARDCODED_SHELTER_ID),
        tx.pure(shipId),
        tx.pure(true)
      ],
    });
    try {
      const result = await executeTx({
        transactionBlock: tx,
      });
      console.log('Deposit:', result);
      // Refresh data
      window.location.reload();
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
    const tx = new Transaction();
    tx.moveCall({
      target: '0x0::smartshelters::smartshelters::swap_ship_on_assembly',
      arguments: [
        tx.object(HARDCODED_SHELTER_ID),
        tx.pure(shipId),
        tx.pure(false)
      ],
    });
    try {
      const result = await executeTx({
        transactionBlock: tx,
      });
      console.log('Withdraw:', result);
      // Refresh data
      window.location.reload();
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

      {account && (
        <div style={{ marginTop: '30px', width: '100%', maxWidth: '700px' }}>
          {loading && <div>Loading your Shelter...</div>}
          {error && <div style={{color:'red'}}>{error}</div>}

          {selectedShelter && (
            <div>
              <div style={{ marginBottom: '20px', color: '#0f0', fontSize: '1.1em' }}>
                Using Shelter: {HARDCODED_SHELTER_ID.slice(0,8)}...{HARDCODED_SHELTER_ID.slice(-6)}
              </div>

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
                    {ships.map((ship, i) => (
                      <div key={i} style={{ 
                        margin: '8px 0', 
                        padding: '12px', 
                        backgroundColor: '#1a1a1a', 
                        borderLeft: '3px solid #00ff9f' 
                      }}>
                        Ship {i+1}: {ship}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!account && (
        <div style={{marginTop: '40px', color:'#555', textAlign:'center'}}>
          Connect your Sui wallet to access your Smart Shelter
        </div>
      )}
    </div>
  );
}

export default App;
