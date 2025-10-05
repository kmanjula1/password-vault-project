// pages/vault/index.tsx
import React, { useEffect, useState, FC } from "react";
import CryptoJS from "crypto-js";

interface Entry {
  _id: string;
  title: string;
  username: string;
  password: string;
}

const Vault: FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [masterKey, setMasterKey] = useState(""); // Set this from login/session
  const [search, setSearch] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const encrypt = (text: string) => CryptoJS.AES.encrypt(text, masterKey).toString();
  const decrypt = (cipher: string) =>
    CryptoJS.AES.decrypt(cipher, masterKey).toString(CryptoJS.enc.Utf8);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/entries", {
        headers: {
          Authorization: `Bearer ${masterKey}`, // or real token
        },
      });
      if (res.ok) {
        const data: Entry[] = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addEntry = async () => {
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

  const deleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${masterKey}`,
        },
      });
      if (res.ok) {
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMessage("Copied!");
    setTimeout(() => setCopyMessage(""), 2000);
  };

  useEffect(() => {
    if (masterKey) fetchEntries();
  }, [masterKey]);

  const filteredEntries = entries.filter((entry) =>
    decrypt(entry.title).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vault-container">
      <h1>Password Vault</h1>

      <div>
        <input
          type="text"
          placeholder="Master key"
          value={masterKey}
          onChange={(e) => setMasterKey(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
            <strong>{decrypt(entry.title)}</strong> | {decrypt(entry.username)} |{" "}
            {decrypt(entry.password)}
            <button onClick={() => copyToClipboard(decrypt(entry.password))}>Copy</button>
            <button onClick={() => deleteEntry(entry._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vault;
