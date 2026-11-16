# Aurev Android installation and test plan

Aurev is currently a **fictional, locally persisted demo**, not a real-user dating platform. The Android APK runs independently after installation and does not need Expo Go or a running Metro server. It does **not** include real registration, a cloud backend, genuine matches, messaging between people, identity/age verification, or a live moderation service.

## Prerequisites

- An Android phone or emulator, ideally with a modern supported Android version.
- A free Expo account for cloud builds. Cloud EAS build access/quotas are subject to Expo's current plans.
- Node.js 22.18+ and dependencies installed with `npm ci`.
- Never add access tokens, signing keys, personal details or production user data to Git.

## First APK build (one-time setup)

From a terminal inside the Aurev project:

```sh
git fetch origin
git switch feature/android-installable-preview
npm ci
npm run check
npx expo export --platform android --output-dir dist-android-validation
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

EAS may ask to link the project to your Expo account and to generate an **Android signing keystore**. Use your own Expo account and approve keystore creation. **Safeguard signing credentials** for future upgrades. Do not paste the keystore or Expo tokens into chat.

When the cloud build finishes, use the real URL from the EAS dashboard to download the `.apk` to your Android phone. This app is signed and runs without a development server. Depending on Android's settings, the recipient must allow installation from the browser or file-manager app and acknowledge Play Protect warnings for an unlisted beta. Only share the build with people you trust.

To build locally instead, use `npx expo run:android --variant release` after installing and configuring Android Studio, SDK and emulator/device; local signing and artifact extraction must be verified independently.

## Android acceptance walkthrough

- Install the actual APK, launch it from the app drawer, and ensure the Aurev branding and dark splash appear.
- Enter the fictional demo and visit all five tabs.
- Open and refresh the Cosmic Chemistry flow. Confirm no crash/white screen.
- Complete 18+ onboarding with fictional details, edit the profile, choose multiple connection intentions and interests.
- Like and pass profiles; check matching, fictional replies, and ten-free-likes-per-local-day allowance; ensure a blocked profile cannot be interacted with.
- Create/edit a TripMatch plan and ensure opt-in and overlapping dates are respected.
- Force-close and reopen the app to confirm local persistence.
- Test with phone keyboard visible, Android back gesture, denied photo permission, no internet and a smaller phone display.
- Check app icon, status/nav bar contrast and any React Native logs.
- Confirm displayed warnings that profiles/messages are fictional and that no live users are contacted.

## Real-user launch blockers

Before inviting real users, implement secure authentication, verified 18+ eligibility, consent and policy flows, privacy-safe photo storage, database and per-user access rules, private matching and messaging, reports/blocks enforced on the server, operational moderation and abuse handling, deletion/export workflows, legal/privacy review and production telemetry. A Play Store release also requires developer-console enrollment and store-review compliance; do not attempt release with the current demo backend.

The optional `production` profile in `eas.json` produces an AAB for eventual Play Store testing; **do not submit this demo** as a live dating service.

## Co-founder testing

Share the resulting **actual EAS APK install link** with the co-founder only after a successful build and device smoke test. Do not share `localhost`, a Metro QR code or a GitHub Pages website in place of an APK.
