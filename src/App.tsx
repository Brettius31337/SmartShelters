import { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

function App() {
  // Path B: DApp hosted on Smart Storage Unit, controlling Shelter(s)
  const STORAGE_UNIT_ID = '0xd27c1b6100ae66ad297be3c74702dee0aef82f337a016e104b9e22aba0ee11d1';
  const DEFAULT_SHELTER_ID = '0xa5bf5396398cec9433e63019235174a0461b09952c73da71b96eb3b9e6e9091a';

  const [controlledShelterId, setControlledShelterId] = useState(() => {
    return localStorage.getItem('controlledShelterId') || DEFAULT_SHELTER_ID;
  });
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [ships, setShips] = useState([]);
  const [shipId, setShipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isStorageOwner, setIsStorageOwner] = useState(false);

  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: executeTx } = useSignAndExecuteTransaction();

  // Load Storage Unit to check ownership + load controlled Shelter
  useEffect(() => {
    const loadData = async () => {
      if (!account) {
        setSelectedShelter(null);
        setShips([]);
        setIsStorageOwner(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Check if user owns the Storage Unit
        const storageResult = await client.getObject({
          id: STORAGE_UNIT_ID,
          options: { showOwner: true }
        });

        if (storageResult.data?.owner?.AddressOwner) {
          setIsStorageOwner(storageResult.data.owner.AddressOwner === account.address);
        }

        // Load the controlled Shelter
        const shelterResult = await client.getObject({
          id: controlledShelterId,
          options: { showContent: true }
        });

        if (shelterResult.data) {
          const shelterData = {
            id: shelterResult.data.objectId,
            ships: shelterResult.data.content?.fields?.ships || [],
            owner: shelterResult.data.content?.fields?.owner
          };
          setSelectedShelter(shelterData);
          setShips(shelterData.ships);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Make sure you are connected to the correct network.');
      }
      setLoading(false);
    };

    loadData();
  }, [account?.address, client, controlledShelterId]);

  const saveControlledShelter = (newId) => {
    const trimmed = newId.trim();
    if (trimmed) {
      setControlledShelterId(trimmed);
      localStorage.setItem('controlledShelterId', trimmed);
      setShowSettings(false);
    }
  };

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
        tx.object(controlledShelterId),
        tx.pure(shipId),
        tx.pure(true)
      ],
    });
    try {
      const result = await executeTx({ transactionBlock: tx });
      console.log('Deposit:', result);
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
        tx.object(controlledShelterId),
        tx.pure(shipId),
        tx.pure(false)
      ],
    });
    try {
      const result = await executeTx({ transactionBlock: tx });
      console.log('Withdraw:', result);
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

      <div style={{ position: 'absolute', top: '30px', right: '30px' }}>
        <ConnectButton />
        {isStorageOwner && (
          <button 
            onClick={() => setShowSettings(true)}
            style={{ marginLeft: '10px', padding: '8px', background: '#333', color: '#0f0', border: '1px solid #0f0', borderRadius: '4px', cursor: 'pointer' }}
          >
            ⚙️
          </button>
        )}
      </div>

      {account && <div style={{marginTop:'40px', color:'#0a0'}}>Connected: {account.address.slice(0,8)}...{account.address.slice(-6)}</div>}

      {account && (
        <div style={{ marginTop: '30px', width: '100%', maxWidth: '700px' }}>
          {loading && <div>Loading...</div>}
          {error && <div style={{color:'red'}}>{error}</div>}

          {selectedShelter && (
            <div>
              <div style={{ marginBottom: '10px', color: '#0f0' }}>
                Hosted on Storage: {STORAGE_UNIT_ID.slice(0,8)}...{STORAGE_UNIT_ID.slice(-6)}
              </div>
              <div style={{ marginBottom: '20px', color: '#0f0', fontSize: '1.1em' }}>
                Controlling Shelter: {controlledShelterId.slice(0,8)}...{controlledShelterId.slice(-6)}
              </div>

              <div style={{ background: '#111', padding: '20px', border: '1px solid #0f0' }}>
                <h3>Ships in Shelter</h3>
                <div style={{ color: '#aaa', marginBottom: '15px' }}>
                  Object ID: <span style={{color:'#0f0'}}>{selectedShelter.id}</span>
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
          Connect your Sui wallet to access Smart Shelters
        </div>
      )}

      {showSettings && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#111', padding: '30px', border: '2px solid #0f0', maxWidth: '500px', width: '90%' }}>
            <h3>Configure Controlled Shelter</h3>
            <p style={{color:'#aaa', marginBottom: '15px'}}>Enter the Shelter or Heavy Shelter Object ID:</p>
            <input 
              value={controlledShelterId}
              onChange={(e) => setControlledShelterId(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#1a1a1a', color: '#0f0', border: '1px solid #0f0', marginBottom: '20px' }}
              placeholder="0x..."
            />
            <button onClick={() => saveControlledShelter(controlledShelterId)} style={{ padding: '10px 20px', background: '#00ff9f', color: '#000', border: 'none', marginRight: '10px' }}>
              Save
            </button>
            <button onClick={() => { setShowSettings(false); setControlledShelterId(localStorage.getItem('controlledShelterId') || DEFAULT_SHELTER_ID); }} style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
