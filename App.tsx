function App() {
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
  const tx = new TransactionBlock();
  console.log('SuiClient initialized:', client);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', color: 'white', backgroundColor: 'black', minHeight: '100vh' }}>
      <h1>SMART SHELTERS</h1>
      <p>Shelter ID: {shelterId || 'Enter a Shelter ID above'}</p>
      <p>Ships in shelter: {ships.length}</p>
      <div>
        {ships.map((ship, i) => (
          <div key={i} style={{ margin: '5px 0', padding: '5px', backgroundColor: '#111' }}>
            Ship {i+1}: {ship}
          </div>
        ))}
      </div>
      <p>SuiClient is initialized and ready.</p>
    </div>
  );
}

export default App;
