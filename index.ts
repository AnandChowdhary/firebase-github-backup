import { config } from "dotenv";
import fs from "fs";
import { join } from "path";
import {
  initializeApp,
  credential,
  ServiceAccount,
  firestore,
} from "firebase-admin";
import {
  createHash,
  createCipheriv,
  createDecipheriv,
  Cipher,
  Decipher,
} from "crypto";

config();

const FIREBASE_SERVICE_ACCOUNT_KEY: ServiceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY ?? ""
);
const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
const BACKUPS_DIRECTORY = process.env.BACKUPS_DIRECTORY ?? "backups";
const INITIALIZATION_VECTOR = createHash("sha256")
  .update(process.env.INITIALIZATION_VECTOR ?? "")
  .digest("base64")
  .slice(0, 16);
const KEY = createHash("sha256")
  .update(process.env.KEY ?? "")
  .digest("base64")
  .slice(0, 32);

initializeApp({
  credential: credential.cert(FIREBASE_SERVICE_ACCOUNT_KEY),
  databaseURL: FIREBASE_DATABASE_URL,
});

const encryptDecryptFile = (cipher: Cipher | Decipher, path: string) =>
  new Promise((resolve, reject) => {
    const input = fs.createReadStream(path);
    const output = fs.createWriteStream(`${path}.temp`);
    input.pipe(cipher).pipe(output);
    output.on("finish", () => {
      fs.unlink(path, (error) => {
        if (error) return reject(error);
        fs.rename(`${path}.temp`, path, (error) => {
          if (error) return reject(error);
          return resolve();
        });
      });
    });
  });

const encryptDecryptAll = async (
  type: "encrypt" | "decrypt",
  cipher: Cipher | Decipher
) => {
  //await encryptDecryptFile(cipher, "backups/example.txt");
};

export const encrypt = () => {
  const cipher = createCipheriv("aes-256-cbc", KEY, INITIALIZATION_VECTOR);
  return encryptDecryptAll("encrypt", cipher);
};

export const decrypt = () => {
  const decipher = createDecipheriv("aes-256-cbc", KEY, INITIALIZATION_VECTOR);
  return encryptDecryptAll("decrypt", decipher);
};

export const backup = async () => {
  await fs.promises.mkdir(join(".", BACKUPS_DIRECTORY), { recursive: true });
};

encrypt();
