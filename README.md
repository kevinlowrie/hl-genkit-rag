# Build gen AI features powered by your data with Firebase Genkit

This is the code for [Build gen AI features powered by your data with Firebase Genkit](https://firebase.google.com/codelabs/ai-genkit-rag) codelab.

## Getting Started

First, update `src/lib/genkit/genkit.config.js` with your own Firebase project id and login using `gcloud auth application-default login`.
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

## Contributing

Follow the [contributor workflow](AGENTS.md#contributor-workflow): 3-amigos
ownership, small implementation handoffs, independent review, RED -> GREEN ->
CLEAN checks, non-secret shared working notes, and small linked PR stacks.
Verify authorized merges to `main` and keep task-owned worktrees clean. Report
missing checks or access honestly, and keep private information out of this
public repository.
