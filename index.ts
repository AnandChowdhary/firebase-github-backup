import { config } from "dotenv";
import {
  initializeApp,
  credential,
  ServiceAccount,
  firestore,
} from "firebase-admin";
config();

const FIREBASE_SERVICE_ACCOUNT_KEY: ServiceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY ?? ""
);
const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;

initializeApp({
  credential: credential.cert(FIREBASE_SERVICE_ACCOUNT_KEY),
  databaseURL: FIREBASE_DATABASE_URL,
});

export const backup = async () => {
  console.log("Starting backup...");
};

backup();
