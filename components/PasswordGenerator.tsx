import { useState } from "react";

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

interface Props {
  onGenerate: (password: string) => void;
}

const PasswordGenerator: React.FC<Props> = ({ onGenerate }) => {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generate = () => {
    let chars = letters;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    onGenerate(password);
  };

  return (
    <div>
      <h3>Password Generator</h3>
      <label>Length: {length}</label>
      <input
        type="range"
        min={6}
        max={32}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
      />
      <label>
        <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} />
        Numbers
      </label>
      <label>
        <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} />
        Symbols
      </label>
      <button onClick={generate}>Generate</button>
    </div>
  );
};

export default PasswordGenerator;