import { ConnectButton } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { useState, useEffect, useCallback } from 'react';

const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

export default function App() {
  const { address } = useWallet();

  const [shelterId, setShelterId] = useState('');
  const [newShipId, setNewShipId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [ships, setShips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshShips = useCallback(async () => {
    if (!shelterId.startsWith('0x')) {
      setShips([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `smartshelters::smartshelters::view_ships`,
        arguments: [tx.object(shelterId)],
      });

      const result = await client.devInspectTransactionBlock({
        transactionBlock: tx,
      });

      const returnValues = result.results?.[0]?.returnValues;
      if (returnValues && returnValues.length > 0) {
        const rawData = returnValues[0][0];
        setShips(Array.isArray(rawData) ? rawData.map(id => String(id)) : []);
      } else {
        setShips([]);
      }
    } catch (err: any) {
      console.error('view_ships failed:', err);
      setError('Could not load ships from shelter');
      setShips([]);
    } finally {
      setIsLoading(false);
    }
  }, [shelterId]);

  useEffect(() => {
    refreshShips();
  }, [shelterId, refreshShips]);

  const depositShip = async () => {
    if (!address || !shelterId || !newShipId) {
      setError('Please connect wallet, enter Shelter ID, and Ship ID to deposit');
      return;
    }

    setStatus('');
    setError('');
    setIsLoading(true);

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `smartshelters::smartshelters::swap_ship`,
        arguments: [
          tx.object(shelterId),
          tx.pure.address(newShipId),
          tx.pure.bool(true),
        ],
      });

      await signAndExecuteTransaction({ transaction: tx });

      setStatus('✅ Ship deposited successfully!');
      setNewShipId('');
      setTimeout(refreshShips, 1500);
    } catch (err: any) {
      console.error(err);
      let msg = 'Transaction failed';
      if (err.message?.includes('100')) msg = '❌ Not in the owner’s tribe';
      else if (err.message?.includes('101')) msg = '❌ Insufficient standing';
      else if (err.message?.includes('ObjectNotFound')) msg = '❌ Invalid Object ID';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-zinc-950 border border-cyan-500/30 rounded-3xl p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold tracking-tighter text-cyan-400">SMART SHELTERS</h1>
          <ConnectButton />
        </div>

        <input
          type="text"
          placeholder="Shelter or Heavy Shelter Object ID (0x...)"
          value={shelterId}
          onChange={(e) => setShelterId(e.target.value)}
          className="w-full bg-zinc-900 border border-cyan-500/50 focus:border-cyan-400 rounded-2xl px-6 py-5 text-lg placeholder:text-zinc-500 outline-none mb-8"
        />

        <div className="mb-8 bg-zinc-900 border border-cyan-500/30 rounded-2xl p-6">
          <div className="flex justify-between mb-4">
            <div className="text-cyan-400 font-bold text-sm">SHIPS STORED IN THIS SHELTER</div>
            <button 
              onClick={refreshShips}
              disabled={isLoading}
              className="text-xs px-4 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-cyan-500/50 disabled:opacity-50"
            >
              {isLoading ? 'LOADING...' : 'REFRESH'}
            </button>
          </div>
          
          {ships.length > 0 ? (
            <div className="font-mono text-sm text-green-400 max-h-48 overflow-auto space-y-2">
              {ships.map((ship, i) => (
                <div key={i} className="py-2 px-3 bg-black/50 rounded-lg break-all">{ship}</div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-500 italic text-sm py-12 text-center border border-dashed border-zinc-700 rounded-2xl">
              No ships currently stored in this shelter.
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-amber-400/30 rounded-2xl p-6">
          <div className="text-amber-400 text-sm font-bold mb-4">DEPOSIT NEW SHIP</div>
          <input
            type="text"
            placeholder="Ship Object ID to deposit (0x...)"
            value={newShipId}
            onChange={(e) => setNewShipId(e.target.value)}
            className="w-full bg-zinc-900 border border-amber-400/50 focus:border-amber-400 rounded-2xl px-6 py-5 text-lg placeholder:text-zinc-500 outline-none mb-6"
          />
          <button 
            onClick={depositShip}
            disabled={isLoading || !newShipId}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-4 rounded-2xl text-lg"
          >
            DEPOSIT SHIP INTO SHELTER
          </button>
        </div>

        {status && <p className="mt-8 text-center text-green-400 font-medium text-lg">{status}</p>}
        {error && <p className="mt-8 text-center text-red-400 font-medium text-lg">{error}</p>}

        <p className="text-center text-zinc-500 text-xs mt-12">
          SmartShelters • Automatically loads ships from shelter • Owner has full access
        </p>
      </div>
    </div>
  );
}
