// pages/vault/index.tsx
import React, { FC, useState, useEffect } from "react";

// Placeholder types for Vault entries
interface VaultEntry {
  _id: string;
  title: string;
  username: string;
  password: string;
}

// Placeholder encrypt/decrypt functions
const encrypt = (text: string, key: string) => text; // Replace with real logic
const decrypt = (text: string, key: string) => text; // Replace with real logic

const Vault: FC = () => {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const masterKey = "dummy-key"; // Replace with your actual key

  // Fetch entries from API
  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/entries");
      const data: VaultEntry[] = await res.json();
      setEntries(data);
    } catch (err) {
      console.error("Error fetching entries:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAddEntry = async () => {
    try {
      const encryptedEntry = {
        title: encrypt(newTitle, masterKey),
        username: encrypt(newUsername, masterKey),
        password: encrypt(newPassword, masterKey),
      };

      const res = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(encryptedEntry),
      });

      if (res.ok) {
        setNewTitle("");
        setNewUsername("");
        setNewPassword("");
        fetchEntries();
      }
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMessage("Copied!");
    setTimeout(() => setCopyMessage(""), 2000);
  };

  return (
    <div>
      <h1>Vault</h1>

      <div>
        <input
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          placeholder="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleAddEntry}>Add Entry</button>
      </div>

      <p>{copyMessage}</p>

      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            <strong>{decrypt(entry.title, masterKey)}</strong> |{" "}
            {decrypt(entry.username, masterKey)} |{" "}
            {decrypt(entry.password, masterKey)}{" "}
            <button onClick={() => handleCopy(decrypt(entry.password, masterKey))}>
              Copy Password
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vault;
