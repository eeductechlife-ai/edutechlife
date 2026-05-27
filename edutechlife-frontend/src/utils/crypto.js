const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const STORAGE_KEY = 'edutechlife_crypto_key';

function getOrCreateKey(userId) {
  let keyData = localStorage.getItem(STORAGE_KEY);
  if (keyData) {
    try {
      const parsed = JSON.parse(keyData);
      if (parsed.userId === userId) {
        return parsed.key;
      }
    } catch {}
  }
  const newKey = crypto.randomUUID().replace(/-/g, '').slice(0, 32);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId, key: newKey }));
  return newKey;
}

function deriveKey(keyMaterial) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(keyMaterial).slice(0, 32),
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(plainText, userId) {
  if (!plainText || !userId) return plainText;
  try {
    const key = deriveKey(getOrCreateKey(userId));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      await key,
      encoded
    );
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  } catch {
    return plainText;
  }
}

export async function decryptData(cipherText, userId) {
  if (!cipherText || !userId) return cipherText;
  try {
    const key = deriveKey(getOrCreateKey(userId));
    const combined = new Uint8Array(
      atob(cipherText).split('').map(c => c.charCodeAt(0))
    );
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      await key,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return cipherText;
  }
}
