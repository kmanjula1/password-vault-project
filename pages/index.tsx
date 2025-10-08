import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('Login functionality not yet implemented.');
    // Here is where your final login logic would go (using fetch to your API)
    // For now, this is just a placeholder to get the UI deployed!
  };

  return (
    <>
      <Head>
        <title>Secure Vault Login</title>
      </Head>
      <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Secure Vault Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block' }}>Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block' }}>Master Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}>
            Login
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </>
  );
}