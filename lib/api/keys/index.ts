import { AxiosInstance } from "axios";
import { Keys } from "@/../types";
import { pbkdf2Sync } from "crypto";

const salt = process.env.NEXT_PUBLIC_MASTER_KEY_SALT as string;

export const getPrimeAndGenerator = async (axios: AxiosInstance) => {
  const res = await axios.get<{
    prime: string;
    generator: string;
  }>("/encryption");

  return res.data;
};

export const deriveMasterKey = (password: string) => {
  return pbkdf2Sync(password, salt, 100000, 32, "sha512").toString("hex");
};

export const getKeys = async (axios: AxiosInstance) => {
  const res = await axios.get<Keys>("/encryption/keys");

  return res.data;
};

export const saveKeys = async (
  axios: AxiosInstance,
  encryptedPrivateKey: string,
  publicKey: string,
  iv: string
) => {
  const res = await axios.post<Keys>("/encryption/keys", {
    encrypted_private_key: encryptedPrivateKey,
    public_key: publicKey,
    iv,
  });

  return res.data;
};

export const updateKeys = async (
  axios: AxiosInstance,
  encryptedPrivateKey: string,
  publicKey: string,
  iv: string
) => {
  const res = await axios.put("/encryption/keys", {
    encrypted_private_key: encryptedPrivateKey,
    public_key: publicKey,
    iv,
  });

  return res.data;
};

export const deleteKeys = async (axios: AxiosInstance) => {
  const res = await axios.post("/encryption/keys/delete");

  return res.data;
};
