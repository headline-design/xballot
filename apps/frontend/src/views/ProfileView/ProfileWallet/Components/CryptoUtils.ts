import nacl from 'tweetnacl';

export const cBuffer = (text) => Uint8Array.from([...text].map((ch) => ch.charCodeAt(0)));
export const deBuffer = (uintArray) => uintArray.reduce((str, byte) => str + String.fromCharCode(byte), '');
export const pad = (uarray) => Uint8Array.from({ length: 32 }, (_, i) => uarray[i] || 0);
export const nonce = new Uint8Array(24).fill(0);

export const decryptMnemonic = (savedMnemonic, password) => {
  const paddedPassword = pad(cBuffer(password));
  return deBuffer(
    nacl.secretbox.open(cBuffer(savedMnemonic), nonce, paddedPassword),
  );
};