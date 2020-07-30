import { config } from "dotenv";
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
import recursiveReaddir from "recursive-readdir";
import {} from "fs-extra";
import archiver from "archiver";

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

/**
 * @param {String} source
 * @param {String} out
 * @source https://stackoverflow.com/a/51518100/1656944
 */
const zipDirectory = (source: string, out: string) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);
  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
};

export const encrypt = async () => {
  await zipDirectory(
    join(".", "temp"),
    join(".", BACKUPS_DIRECTORY, `${new Date().toISOString()}.zip`)
  );
  // const cipher = createCipheriv("aes-256-cbc", KEY, INITIALIZATION_VECTOR);
  // return encryptDecryptAll(cipher);
};

export const backup = async () => {
  console.log("Starting backup...");
  await fs.promises.mkdir(join(".", BACKUPS_DIRECTORY), { recursive: true });
  const collections = await firestore().listCollections();
  for await (const details of collections) {
    const id = details.id;
    console.log("Backing up", id);
    await fs.promises.mkdir(join(".", BACKUPS_DIRECTORY, id), {
      recursive: true,
    });
    const documents: Array<firestore.QueryDocumentSnapshot<
      firestore.DocumentData
    >> = [];
    const _documents = await firestore().collection(id).get();
    _documents.forEach((doc) => documents.push(doc));
    for await (const document of documents) {
      console.log(`> ${document.id}`);
      await fs.promises.writeFile(
        join(".", BACKUPS_DIRECTORY, id, `${document.id}.json`),
        JSON.stringify(document.data())
      );
    }
    console.log("Completed backing up", id);
  }
  console.log("Encryping files...");
  console.log("Done!");
};

encrypt();
