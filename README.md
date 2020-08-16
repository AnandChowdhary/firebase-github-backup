# 🔥🗄️ Firebase GitHub Backup

Automagically backup your Firebase Cloud Firestore database to a GitHub repository, with AES-256 encryption. The GitHub Actions workflow runs every week and stores encrypted backups in the `./backups` directory as `.zip` files.

[![Release CI](https://github.com/koj-co/firebase-github-backup/workflows/Release%20CI/badge.svg)](https://github.com/koj-co/firebase-github-backup/actions?query=workflow%3A%22Release+CI%22)
[![Backup CI](https://github.com/koj-co/firebase-github-backup/workflows/Backup%20CI/badge.svg)](https://github.com/koj-co/firebase-github-backup/actions?query=workflow%3A%22Backup+CI%22)

## ⭐ Getting started

1. Fork this repository
1. Add required repository secrets

Backup files will be created weekly, and can be downloaded and manually decrypted for viewing. You can also use the `npm run decrypt` script to decrypt all stored files. As an example, our production database' backups are available in the [`./backups`](./backups) directory of this repository.

## ⚙️ Configuration

### Environment variables

Locally, environment variables are loaded from a `.env` file. For GitHub Actions, add the following as repository secrets (see [Creating and storing encrypted secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)):

- `FIREBASE_SERVICE_ACCOUNT_KEY` is the Firebase Service Account Key in JSON format
- `FIREBASE_DATABASE_URL` is the Firebase Cloud Firestore database URL, e.g., https://example.firebaseio.com
- `BACKUPS_DIRECTORY` is the directory to save backups in, defaults to `backups`
- `KEY` is the key for AES-256 encryption, can be any length since it is hashed
- `INITIALIZATION_VECTOR` is the IV for AES-256, can be any length since it is hashed

### Deployment

Run the script using `ts-node`:

```bash
npm run run
```

You can also decrypt all backups in the directory:

```bash
npm run decrypt
```

Compile TypeScript and run Node.js script:

```bash
npm run build && npm run start
```

## 📄 License

- Code: [MIT](./LICENSE) © [Koj](https://joinkoj.com)
- "Firebase" is a trademark of Google LLC
- "GitHub" is a trademark of GitHub, Inc.

<p align="center">
  <a href="https://koj.co">
    <img width="44" alt="Koj" src="https://kojcdn.com/v1593890002/website-v2/logo_mcxuwq.svg">
  </a>
</p>
<p align="center">
  <sub>An open source project by <a href="https://koj.co">Koj</a>. <br> <a href="https://koj.co">Furnish your home in style, for as low as CHF175/month →</a></sub>
</p>
