function App() {
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
  console.log('SuiClient initialized:', client);

  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', color: 'white', backgroundColor: 'black', minHeight: '100vh' }}>
      <h1>SMART SHELTERS</h1>
      <p>Basic version - Sui integration coming soon.</p>
      <p>Deployment test successful.</p>
    </div>
  );
}

export default App;
