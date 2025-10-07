// pages/vault/index.tsx
import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import CryptoJS from "crypto-js";

// Entry interface
interface Entry {
  _id: string;
  title: string;
  username: string;
  password: string;
}

const Vault: FC = () => {
  // State declarations
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [search, setSearch] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Encrypt & decrypt helpers
  const encrypt = useCallback(
    (text: string) => CryptoJS.AES.encrypt(text, masterKey).toString(),
    [masterKey]
  );

  const decrypt = useCallback(
    (cipher: string) => {
      try {
        return CryptoJS.AES.decrypt(cipher, masterKey).toString(CryptoJS.enc.Utf8);
      } catch {
        return "";
      }
    },
    [masterKey]
  );

  // Fetch entries from API
  const fetchEntries = useCallback(async () => {
    if (!masterKey) return;
    try {
      const res = await fetch("/api/entries", {
        headers: { Authorization: `Bearer ${masterKey}` },
      });
      if (res.ok) {
        const data: Entry[] = await res.json();
        setEntries(data);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error(err);
      setEntries([]);
    }
  }, [masterKey]);

  // Load entries only when "Load Vault" is clicked
  useEffect(() => {
    if (loaded) fetchEntries();
  }, [loaded, fetchEntries]);

  // Add a new entry
  const addEntry = async () => {
    if (!masterKey || !newTitle || !newUsername || !newPassword) return;
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${masterKey}`,
        },
        body: JSON.stringify({
          title: encrypt(newTitle),
          username: encrypt(newUsername),
          password: encrypt(newPassword),
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewUsername("");
        setNewPassword("");
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete an entry
  const deleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${masterKey}` },
      });
      if (res.ok) fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  // Copy password to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMessage("Copied!");
    setTimeout(() => setCopyMessage(""), 2000);
  };

  // Decrypt entries and memoize
  const decryptedEntries = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        title: decrypt(entry.title),
        username: decrypt(entry.username),
        password: decrypt(entry.password),
      })),
    [entries, decrypt]
  );

  const filteredEntries = useMemo(
    () =>
      decryptedEntries.filter((entry) =>
        entry.title.toLowerCase().includes(search.toLowerCase())
      ),
    [decryptedEntries, search]
  );

  return (
    <div className="vault-container">
      <h1>Password Vault</h1>

      <input
        type="text"
        placeholder="Master key"
        value={masterKey}
        onChange={(e) => setMasterKey(e.target.value)}
      />
      <button onClick={() => setLoaded(true)}>Load Vault</button>

      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={addEntry}>Add Entry</button>
      </div>

      {copyMessage && <div>{copyMessage}</div>}

      <ul>
        {filteredEntries.map((entry) => (
          <li key={entry._id}>
            <strong>{entry.title}</strong> | {entry.username} | {entry.password}
            <button onClick={() => copyToClipboard(entry.password)}>Copy</button>
            <button onClick={() => deleteEntry(entry._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vault;

