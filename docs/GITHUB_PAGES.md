# GitHub Pages deployment: Aurev

Target website: **https://skgtheking.github.io/aurev/**

Target repository: **skgtheking/aurev**. The workflow is explicitly restricted to this repository. The separate **skgtheking/skgtheking.github.io** portfolio repository must not be modified or used as a remote.

## Publication

Public publication of the fictional prototype and source was approved by the owner on 11 November 2026. The repository is **https://github.com/skgtheking/aurev**. The workflow builds and deploys on pushes to main. Check the repository’s Actions tab for the latest deployment status.

Before publication, all 75 tracked/candidate source files were inspected for sensitive filenames and common secret patterns; no findings were detected. Dependencies, generated bundles, environment files and machine-specific configuration are excluded. The only runtime profile/message data is stored on individual browsers, not in the source or deployment artifact.

Verified locally: strict TypeScript and lint, 12 tests, web and native bundle exports, all 38 emitted asset references, and HTTP checks for all 48 exported files. Brave browser checks loaded the Pages subpath, navigated to a chat, reloaded through the 404 shell, and confirmed a fictional sent message and scripted reply persisted. Native device testing remains outstanding.

## Build and check locally

```sh
npm ci
npm run check
npm run export:web
npm run test:pages
npm run preview
```

Open **http://localhost:4173/aurev/** (use `PORT=4174 npm run preview` if needed). `npm run export:web` executes Expo’s web export, creates `dist/404.html` from the exact SPA shell, writes `.nojekyll`, and verifies the emitted paths. `npm run test:pages` starts a temporary local server and checks the actual exported files, MIME types, prefix isolation and deep-link fallback behavior.

Raw Expo equivalent:

```sh
npx expo export --platform web
node scripts/prepare-pages.mjs
npm run verify:pages
```

`app.json` uses `web.output: "single"` and `experiments.baseUrl: "/aurev"`. Expo prefixes the generated JavaScript, lazy chunks, fonts and favicon. Application code continues to navigate through Expo Router using logical routes such as `/onboarding` and `/person/p1`; manually prepending `/aurev` to router calls would double-prefix URLs. [Expo’s documented subpath configuration](https://docs.expo.dev/guides/publishing-websites/#github-pages).

GitHub Pages does not offer SPA rewrite rules. Its custom `404.html` serves the same app shell at a nested URL, retaining the route and query string. The browser then loads all resources from absolute `/aurev/` paths and Expo Router handles the route. **The initial HTTP response for a deep link remains 404**; this is expected, is reproduced by the preview server, and is suitable for this local-demo app rather than SEO content. Protected screens still require a locally saved demo user; opening a chat link on a fresh device does not transfer an account or match.

There are no API routes, custom domains or Netlify-specific `_redirects` files. `.nojekyll` is present in the export and included in the uploaded artifact. The Pages artifact is deployed directly by Actions without a Jekyll build.

## Reproduce repository setup

Publication approval has been granted for this repository and prototype. The following setup commands document the initial publication; do not re-create the existing repository or replace its history.

Install and sign in to the official GitHub CLI if it is not available:

```sh
brew install gh
# Complete the browser/device authentication yourself. Do not paste a token into chat.
gh auth login --hostname github.com --git-protocol https --web
gh auth status
gh api user --jq .login
```

The final command must return `skgtheking`. Check whether the repository already exists:

```sh
gh repo view skgtheking/aurev --json nameWithOwner,visibility,defaultBranchRef
```

If it is absent, create **only** the named repository, after public-publication approval:

```sh
gh repo create skgtheking/aurev --public --description "Aurev v0.1 — fictional local dating demo"
```

If it exists, inspect and preserve its contents and visibility; do not replace history or force-push. If it is private, stop and decide whether a qualifying Pages plan is already available or explicitly approve making that repository public. Do not change visibility automatically.

In this workspace, review `git status` and `git diff`, then commit the implementation. The prototype data is fictional; `.env*`, credentials, dependencies, local editor/account settings and generated bundles are ignored. Example local commit identity uses the authenticated account’s public no-reply address:

```sh
git add -A
git -c user.name=skgtheking -c user.email=58114821+skgtheking@users.noreply.github.com commit -m "Build Aurev prototype and configure GitHub Pages"
# This workspace currently has no remote; add only the Aurev project remote.
git remote add origin https://github.com/skgtheking/aurev.git
git remote -v
```

If an `origin` has appeared since this inspection, verify its exact destination before changing anything. Never point it at `skgtheking.github.io`. Before pushing to an existing repository, fetch and inspect its default branch and reconcile history normally; never force-push.

## Configure Settings > Pages > Source

In **https://github.com/skgtheking/aurev/settings/pages**:

1. Under **Build and deployment**, set **Source → GitHub Actions**.
2. Do not select “Deploy from a branch”; this workflow uploads `dist/` directly, and does not use a `gh-pages` branch.
3. Leave the custom domain empty. Enable HTTPS if that option is available.
4. In Settings → Actions → General, ensure Actions and the official `actions/*` actions are allowed. No custom secret or write-all repository token is required.
5. If the `github-pages` environment requires approval, approve its deployment when the workflow reaches that gate.

Authenticated CLI equivalent to enabling the Pages Actions source (only for `aurev`):

```sh
# If no Pages site exists yet:
gh api --method POST repos/skgtheking/aurev/pages -f build_type=workflow
# If Pages already exists, update its source instead:
gh api --method PUT repos/skgtheking/aurev/pages -f build_type=workflow
```

Use the appropriate one after checking `gh api repos/skgtheking/aurev/pages`; a 404 means no configured site or insufficient permission. Do not issue either command against the portfolio repository.

After approval and source configuration:

```sh
git push -u origin main
gh run list --repo skgtheking/aurev --workflow pages.yml
gh run watch --repo skgtheking/aurev
```

The workflow triggers on pushes to `main` and manual dispatch. It uses official Checkout 7.0.1, Setup Node 7.1.0, Upload Pages Artifact 5.0.0 and Deploy Pages 5.0.1 releases, verified against their upstream releases on 11 November 2026. Node 24 runs `npm ci`, TypeScript, lint, tests, web export, asset validation and HTTP smoke checks. Build permissions are `contents: read`; only the separate deployment job gets `pages: write` and `id-token: write`. Checkout does not persist credentials. GitHub-hosted Ubuntu runners support these actions’ Node 24 runtime. [GitHub custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Verify and share

Wait for both `build` and `deploy` jobs to succeed. Then:

```sh
curl -I https://skgtheking.github.io/aurev/
gh api repos/skgtheking/aurev/pages --jq '{url: .html_url, status: .status, source: .build_type}'
```

Confirm the home URL returns HTTP 200 and shows Aurev in a browser. Choose “Explore the fictional demo”, navigate across tabs, refresh a nested profile/chat URL, and confirm JavaScript/fonts/icons load from `/aurev/`. A nested direct request will return the custom 404 shell, as explained above; runtime interaction still needs a browser check.

Only after those checks should the site be called live. Send your co-founder **https://skgtheking.github.io/aurev/** and ask them to choose **Explore the fictional demo**. No login, subscription or app installation is required; activity is saved separately in each browser. This shares a fictional prototype, not real profiles or messages. Future pushes to `main` rebuild and redeploy automatically; no manual upload of `dist/` is needed.
