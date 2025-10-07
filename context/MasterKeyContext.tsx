'use client'; 
// MasterKeyContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Buffer } from 'buffer'; // Needed for the Buffer type

// 1. Define the Context structure
interface MasterKeyContextType {
  masterKey: Buffer | null;
  setMasterKey: (key: Buffer | null) => void;
  isKeyLoaded: boolean;
}

// 2. Create the Context
const MasterKeyContext = createContext<MasterKeyContextType | undefined>(undefined);

// 3. Create the Provider Component
interface MasterKeyProviderProps {
  children: ReactNode;
}

export const MasterKeyProvider: React.FC<MasterKeyProviderProps> = ({ children }) => {
  // Key is stored in local component state (IN-MEMORY)
  const [masterKey, setMasterKey] = useState<Buffer | null>(null);
  
  // Flag to know when the key is ready for use
  const isKeyLoaded = masterKey !== null;

  return (
    <MasterKeyContext.Provider value={{ masterKey, setMasterKey, isKeyLoaded }}>
      {children}
    </MasterKeyContext.Provider>
  );
};

// 4. Custom Hook for easy use in components
export const useMasterKey = () => {
  const context = useContext(MasterKeyContext);
  if (context === undefined) {
    throw new Error('useMasterKey must be used within a MasterKeyProvider');
  }
  return context;
};
// Inside your PasswordGenerator.tsx or similar file


// Define the shape of your settings (TypeScript Interface)
interface GeneratorSettings {
    length: number;
    includeLowercase: boolean;
    includeNumbers: boolean;
    // ... other settings
}

export default function PasswordGenerator() {
    // 1. Initialize the state (This is where 'settings' comes from!)
    const [settings, setSettings] = useState<GeneratorSettings>({
        length: 12,
        includeLowercase: true,
        includeNumbers: false,
        // ...
    });

    // 2. Your generation logic now uses the 'settings' variable defined above
    const generatePassword = () => {
        let characterPool = '';
        
        // This line now works:
        if (settings.includeLowercase) {
            characterPool += 'abcdefghijklmnopqrstuvwxyz';
        }
        // ... and so on
    }

    // ... rest of your component
}