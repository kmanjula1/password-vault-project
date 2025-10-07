"use client";
import * as crypto from 'crypto'; // Node.js crypto, not browser-safe

// Encryption function (example placeholder)
export function encryptVaultEntry(plaintext: string, masterKey: Buffer): { ciphertext: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(12); // 96-bit IV for AES-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
        ciphertext,
        iv: iv.toString('hex'),
        authTag,
    };
}

// Decryption function
export function decryptVaultEntry(
    ciphertext: string,
    iv: string,
    authTag: string,
    masterKey: Buffer
): string {
    const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}



