# Aurev v0.1

_A little chemistry. A lot of possibility._

An adults-only, India-focused dating prototype built with Expo SDK 58, React Native, TypeScript and Expo Router. Everything runs locally: 30 fictional adult profiles, original vector portraits, simulated matches and scripted chat replies. No backend, purchases, authentication service or API keys.

## Start here

Use Node **22.18+** and npm (this project uses `package-lock.json`). From this directory:

```sh
npm ci
npm run web -- --port 8088
```

Open **http://localhost:8088**. Choose **Explore the fictional demo** for Aarya’s prepared profile, or **Begin your story** for the four-step onboarding flow. The initial fixtures include six received likes and two matches with conversations. A newly onboarded user only keeps seed matches consistent with their dating preferences.

For the production web bundle:

```sh
npm run export:web
npm run test:pages
npm run preview
```

Open **http://localhost:4173/aurev/**. The dependency-free preview server mounts `dist/` at the same `/aurev/` project path as GitHub Pages and serves the SPA shell for deep links. Do not open `index.html` as a `file://` URL. If port 4173 is busy, use `PORT=4174 npm run preview` on macOS/Linux. State belongs to each origin/device; port 4173 and port 8088 have separate demo accounts.

## A five-minute co-founder walkthrough

1. Enter the fictional demo. Discover shows preference-aware introductions. Open Ananya’s story, return, and like her to trigger a simulated mutual-match celebration.
2. Open the conversation and send a message. The reply is explicitly marked **SIMULATED**. Reload and verify that the messages remain.
3. Open Profile → Aurev Privé and activate the free demonstration. Likes → For you now reveals fictional received likes. Like someone back and open the new conversation.
4. TripMatch → Plan a journey. Enter **Goa** and use the future dates suggested on the form. Save, then select Travellers to see reciprocal, opted-in people whose dates overlap. A matching city alone is insufficient for traveller results.
5. Explore Cosmic Chemistry; Vedic calculations are explicitly unavailable. Edit profile/preferences, hide or clear a conversation, and try blocking a fixture from its safety screen.
6. Profile → Settings offers sign-out, restart onboarding, reset and local account deletion with confirmations. Reset gives a clean demonstration.

These are manual acceptance steps to run before presenting; they are not a claim that browser/device interaction testing has been completed.

## iOS and Android

```sh
npm start
# or:
npm run ios
npm run android
```

Use an SDK 58-compatible Expo Go client, or a development build. All modules added for this prototype (AsyncStorage, SVG, image picker) have Expo Go support, but **the Expo Go binary must support this SDK**. The SDK 58 transition documentation currently directs physical-device Expo Go users to SDK 57; this repository intentionally preserves SDK 58. Do not downgrade it just to scan a QR code. Web is the simplest demonstration path when a matching client is unavailable. See the [Expo SDK 58 docs](https://docs.expo.dev/versions/v58.0.0/) and [SDK 58 transition note](https://docs.expo.dev/router/introduction/).

`npm run ios` needs a working Xcode/iOS Simulator installation; `npm run android` needs a configured Android emulator or device. Neither has been exercised here. Do not hand-edit generated `ios/` or `android/` directories.

For a cloud development build, when you are ready to configure an Expo project and signing:

```sh
npx expo install expo-dev-client
npx eas-cli@latest build:configure
# Configure developmentClient: true and distribution: internal in eas.json.
npx eas-cli@latest build --profile development --platform android
# For iOS, configure the Apple signing/account and registered devices first.
npx eas-cli@latest build --profile development --platform ios
npx expo start --dev-client
```

No cloud build, signing, account setup or purchase was performed. Provider quotas and iOS signing requirements may apply. Follow the [Expo build documentation](https://docs.expo.dev/build/introduction/) when configuring these services.

## Verification

```sh
npm run check           # strict TypeScript, Expo lint, domain/persistence tests
npx expo-doctor
npm run export:web
npm run export:native   # iOS + Android JS/Hermes bundles in dist-native/
```

The tests use Node’s built-in test runner and type stripping; no test service is needed. A harmless Node module-format detection warning may appear. Native bundling verifies Metro/Hermes compatibility; it does not build, sign or run an app binary. See [implementation status](docs/IMPLEMENTATION_STATUS.md) for verified results and limitations.

## GitHub Pages

The repeatable Actions deployment is implemented for **skgtheking/aurev**. Public publication has been approved; the repository and deployment workflow are configured for the target below. See [exact setup, Pages Source settings, verification and sharing steps](docs/GITHUB_PAGES.md). The portfolio repository is not used.

## Free sharing and Git collaboration

- **Same Wi-Fi:** run `npm start`, open the printed LAN web URL from the other device, or use the QR code only with a compatible Expo client. Keep the development server running and allow the local firewall connection. No data sync occurs between devices.
- **Offline handoff:** export web, zip `dist/` together with `scripts/preview.mjs`, and share privately. Your co-founder needs Node; from the extracted parent folder run `node scripts/preview.mjs`. No account data is embedded in the export.
- **Optional static hosting:** `dist/` can be uploaded to a static host with a free tier after checking its current terms. The build targets `/aurev/` and includes `404.html` for GitHub Pages deep links. The public target is https://skgtheking.github.io/aurev/; check the latest Pages workflow for deployment status.
- **Private Git:** review `git diff`, commit the source and lockfile, then push to your own private remote. Your co-founder can clone, `npm ci`, and `npm run web`. Generated bundles and dependencies are ignored. The project remote is the separate `skgtheking/aurev` repository.

## Source map

- `src/app/`: Expo Router welcome, onboarding, five tabs and secondary routes.
- `src/features/`: reusable discovery cards and onboarding/profile forms.
- `src/components/`: shared accessible controls, safe-area pages, original portrait artwork.
- `src/theme/`: obsidian/amethyst/champagne tokens and Inter/Cormorant typography.
- `src/types/`, `src/data/`: strict domain models and fictional fixtures.
- `src/store/`: centralized React context store, hydration and initial demo state.
- `src/services/`: pure reactions/blocking and versioned serialized persistence.
- `src/utils/`: age, reciprocal eligibility, calendar/overlap and zodiac helpers.
- `tests/`: deterministic domain, action and persistence tests.

## Privacy, safety and licenses

Use fictional details. AsyncStorage is unencrypted. Photo selections are stored locally as data URIs where available; large photos can exceed browser storage limits, which produces a visible save error. Up to four photos are supported. Unfinished onboarding drafts are not persisted. Sign-out keeps the local account; account deletion/reset replaces it with fresh anonymous fixture data. Blocking deletes the affected history. Reports are local records and are not sent to moderators.

Free demo: 10 total sent likes and two saved trips. Privé demo: unlimited likes/trips, received-like visibility, intention shortcut, incognito preview and additional reflection content. There is no subscription purchase. Complimentary eligibility for self-declared women is explicitly provisional pending legal and fairness review; all demo users can activate Privé free. Safety and essential messaging remain free.

Original portraits and the Aurev monogram are generated in this source tree; no private photos or stock photographs are used. Inter and Cormorant Garamond are distributed under their included SIL Open Font Licenses in `node_modules/@expo-google-fonts/`. Lucide icons use the ISC license. Preserve dependency notices when distributing the app.
