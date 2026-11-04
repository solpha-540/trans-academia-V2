import CryptoJS from 'crypto-js';

type StorageValue = string | number | boolean | null | Record<string, unknown> | unknown[];

const getSecret = (): string => {
  const secret = (import.meta as any)?.env?.VITE_STORAGE_SECRET;
  if (typeof secret === 'string' && secret.trim().length > 0) return secret;
  return 'VITE_STORAGE_SECRET_NOT_SET';
};

const ENCRYPTED_PREFIX = 'enc:';

export const setEncryptedItem = (key: string, value: StorageValue): void => {
  const secret = getSecret();
  const plain = typeof value === 'string' ? value : JSON.stringify(value);
  const cipher = CryptoJS.AES.encrypt(plain, secret).toString();
  localStorage.setItem(key, `${ENCRYPTED_PREFIX}${cipher}`);
};

export const getDecryptedItem = <T = string>(key: string): T | null => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  if (!raw.startsWith(ENCRYPTED_PREFIX)) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  const secret = getSecret();
  const cipher = raw.slice(ENCRYPTED_PREFIX.length);
  const bytes = CryptoJS.AES.decrypt(cipher, secret);
  const plain = bytes.toString(CryptoJS.enc.Utf8);
  if (!plain) return null;

  try {
    return JSON.parse(plain) as T;
  } catch {
    return plain as unknown as T;
  }
};

export const removeStoredItem = (key: string): void => {
  localStorage.removeItem(key);
};
