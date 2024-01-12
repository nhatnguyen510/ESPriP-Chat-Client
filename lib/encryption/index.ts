import crypto, { DiffieHellman, createHash } from "crypto";

export const deriveSessionKey = (
  currentKey: DiffieHellman,
  friendPublicKey: string
) => {
  const sharedSecret = currentKey.computeSecret(
    Buffer.from(friendPublicKey, "hex")
  );

  const sessionKey = createHash("sha256").update(sharedSecret).digest("hex");

  return sessionKey;
};

export const encrypt = (text: string, key: Buffer) => {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
};

export const decrypt = (
  encryptedData: { iv: string; encryptedData: string },
  key: Buffer
) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(encryptedData.iv, "hex")
  );
  let decrypted = decipher.update(encryptedData.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Encrypt the session key using the master key and AES
export const encryptSessionKey = (sessionKey: string, masterKey: Buffer) => {
  return encrypt(sessionKey, masterKey);
};

// Decrypt the session key using the master key and AES
export const decryptSessionKey = (
  encryptedSessionKey: {
    iv: string;
    encryptedData: string;
  },
  masterKey: Buffer
) => {
  return decrypt(encryptedSessionKey, masterKey);
};

export const encryptMessage = (message: string, sessionKey: Buffer) => {
  return encrypt(message, sessionKey);
};

export const decryptMessage = (
  encryptedMessage: {
    iv: string;
    encryptedData: string;
  },
  sessionKey: Buffer
) => {
  return decrypt(encryptedMessage, sessionKey);
};
