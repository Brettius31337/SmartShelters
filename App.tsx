function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', color: 'white', backgroundColor: 'black', minHeight: '100vh' }}>
      <h1>SMART SHELTERS</h1>
      <p>Basic version is working.</p>
      <p>Sui integration coming soon.</p>
      <p>Current Shelter ID: {shelterId || 'None entered'}</p>
    </div>
  );
}

export default App;
