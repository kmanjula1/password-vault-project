import CryptoJS from "crypto-js";

// Encrypt plaintext with a key (user’s master password)
export const encryptData = (plainText: string, key: string) => {
  return CryptoJS.AES.encrypt(plainText, key).toString();
};

// Decrypt ciphertext with the key
export const decryptData = (cipherText: string, key: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed", error);
    return "";
  }
};