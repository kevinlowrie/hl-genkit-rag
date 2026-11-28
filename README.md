# Build gen AI features powered by your data with Firebase Genkit

This is the code for [Build gen AI features powered by your data with Firebase Genkit](https://firebase.google.com/codelabs/ai-genkit-rag) codelab.

## Getting Started

For local development, set `GOOGLE_CLOUD_PROJECT` to your Firebase project ID and run `gcloud auth application-default login`. The app also accepts `GCLOUD_PROJECT` as a fallback. When both variables are unset, the app uses the default Firebase Admin app's project, including any project specified by the platform in `FIREBASE_CONFIG`. If the Admin app has no project ID, the SDKs use their default project discovery. An existing default Admin app must specify a matching `projectId` if either project variable is set. Run `node index.js YOUR_PROJECT_ID` from `load-firestore-data/` with the same project ID the app uses.
See [Genkit documentation](https://firebase.google.com/docs/genkit/plugins/vertex-ai) for more information.

Then install the dependencies:

```bash
npm install
```

Then run Genkit UI standalone sandbox:

```bash
npm run dev:genkit
```

Alternatively, run Genkit UI alongside the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to lauch Genkit UI.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Next.js app.

You can start editing the app by modifying `genkit-functions/src/lib/itineraryFlow.ts`, `src/app/gemini/page.tsx`. The page auto-updates as you edit the file.

## Branch & hook policy

This repository follows the [harmonized branch, hook & release policy](docs/dev-branch-policy.md).
Local hooks run `scripts/hook_policy.py` — **FAST** profile on WIP/PR branches
(fast commit/push loop), **FULL** profile on protected branches (`main`,
`testing`, `freeze`, `release-candidate`, `release`, `prod`).

```sh
pre-commit install            # or: make hooks-install
python3 scripts/hook_policy.py status
```
