# Aurev v0.1 implementation status

Updated 11 November 2026. Implemented in the existing SDK 58 workspace. Fictional local-data demonstration; GitHub Pages publication is authorized and uses the separate skgtheking/aurev repository. No paid service.

## Implemented

- Dark luxury design tokens, locally bundled Inter/Cormorant fonts, Lucide icons, original illustrated portraits and Aurev app monogram. Safe-area screens, responsive content width, keyboard-aware messaging and pressed-state feedback.
- Four-step adult onboarding: real calendar and 18th-birthday validation, identity, pronouns, orientation, reciprocal preferences, intention, India city, interests, bio, prompt, photos and optional astrology/travel discovery. Editable persisted profile and onboarding restart.
- Five Router tabs: Discover, TripMatch, Likes, Chats and Profile. Guarded secondary screens for profiles, chats, filters, trips, membership, cosmic content, safety and settings.
- 30 fictional adults across 15 Indian destinations, with biographies, interests and prompts. Age/city/gender/intention filtering, reciprocal matching, saved like/pass history, revisiting passes, empty states and blocked-person exclusions.
- Sent/received likes, seeded matches/conversations, deterministic simulated mutual matches and discovery celebration. Free total-like cap and Privé toggle. Received fixtures are clearly fictional.
- Stored messages, timestamps, visibly scripted incoming replies, automatic scroll to newest messages, hide/restore, confirmed history deletion and local block/report controls. Essential messaging and safety are free.
- Create/edit/delete journeys, date validation, upcoming trips, opted-in fictional locals/travellers, inclusive date overlap and city matching. Conversation starters require an existing mutual match. No GPS, hotel or precise-location collection.
- Optional Western zodiac derivation and entertainment copy. Vedic Rashi/Nakshatra/Kundli/Guna Milan explanations explicitly state that advanced calculations are unavailable; no fabricated charts or scores.
- Privé demonstration: unlimited likes and trips, received likes, intention shortcut, incognito preview and extra cosmic reflection. Provisional self-declared-woman eligibility and free activation without verification or payment.
- Profile, photo selection/main-photo management, privacy notices, membership, astrology and traveller opt-ins, blocked-account list, sign-out, restart, reset and local account deletion. Destructive account/history operations include confirmation.
- Versioned AsyncStorage snapshots, hydration gate, structural corruption fallback, visible storage errors and sequential writes that recover after a failed write. State updates use a current-state reference to avoid rapid-action overwrites.
- Web SPA export for GitHub Pages at `/aurev/`, identical 404 app shell, `.nojekyll`, emitted asset validation, local subpath preview and repository-scoped Actions workflow. See GITHUB_PAGES.md for publication approval/authentication prerequisites.

## Verified in this environment

| Check                               | Result                                                                                                                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                 | Passed with strict TypeScript                                                                                                                                                    |
| `npx expo lint`                     | Passed; no errors or warnings after fixes                                                                                                                                        |
| `npm test`                          | 12 tests passed                                                                                                                                                                  |
| `npx expo-doctor`                   | 20/20 checks passed                                                                                                                                                              |
| `npm run export:web`                | Passed; SPA with `/aurev/` resource paths and custom 404 app shell                                                                                                               |
| Expo export for iOS and Android     | Both Metro/Hermes bundles generated successfully                                                                                                                                 |
| Local development HTTP request      | HTTP 200 from port 8088                                                                                                                                                          |
| Browser interaction / screenshot QA | Local Brave Pages preview passed: rendered welcome, demo entry, Chats tab, nested chat route, 404-shell reload and persisted scripted conversation; welcome screenshot inspected |
| Physical devices / simulator        | Not run; available `simctl` failed, and no device runtime was used                                                                                                               |

Tests cover adult birthday boundaries, impossible dates/leap years, validity of all 30 fixtures, reciprocal preferences, filters and blocking, trip dates/overlap/opt-ins, zodiac cusps, onboarding validation, idempotent reactions, free caps, safety effects, snapshot round-tripping, corrupt/unsupported storage, queued write ordering and recovery. Persistence integration tests use an in-memory storage adapter. Actual browser reload persistence was also checked in the local Pages preview; native reload persistence still needs device testing.

## Known limitations

- No backend, real identities, authentication, verification, remote moderation, delivery, notifications, encrypted storage, cross-device synchronization or real payment. Age is self-declared. Reports are not operational moderation.
- Portraits are fictional vector illustrations with six styles. User photos are optional local assets, limited to four; local storage quota and picker permission/device behavior need runtime verification. No cloud media pipeline.
- Onboarding drafts are session-only; completed profiles and app activity persist. Corrupt/unknown storage versions fall back to a fresh demo instead of attempting a migration.
- Like/pass buttons implement the discovery actions; drag-to-swipe gestures are not implemented. Stack transitions and pressed feedback are provided; bespoke animations and haptics remain future polish.
- Free likes are a total demo cap, not a daily allowance. Incognito is a labeled preview flag because no public visibility exists. Privé’s intention filter is a shortcut over free filters, not a separate ranking model.
- City names accept free text for India-wide coverage; no geocoder verifies country/city spelling. Traveller fixtures use dates seven to fourteen days from screen initialization. Local suggestions do not require a fictional local’s travel dates; traveller suggestions do require overlapping dates and both opt-ins.
- Zodiac uses conventional fixed Western date boundaries, not birth-time/ephemeris calculations. Birth time/place are never collected. No Vedic numerical compatibility is available.
- Native bundle exports are not app binaries or proof of runtime behavior. SDK 58-compatible Expo Go availability depends on platform/client; development builds may be needed. No native folders were generated or hand-edited.
- Dependency audit reported 8 moderate findings in the Expo fingerprint / TypeScript ESLint / minimatch chain, with no high or critical findings. The suggested Expo downgrade would violate the SDK-preservation requirement; no forced audit fix was applied. Review upstream-compatible fixes before production.

## Remaining production work

Complete the remaining README acceptance walkthrough on web, iOS and Android, including screen-reader/font scaling, small-screen keyboard behavior, image permissions, storage failures and actual reloads. Add interaction/end-to-end coverage and screenshot QA after a browser/device runtime is available.

Before a real launch: implement authenticated backend APIs and protected storage, robust adult assurance, secure media processing, consent/privacy controls, operational reporting/moderation and abuse prevention, retention/deletion policies, encrypted messaging transport, reliable matching/chat synchronization, accessibility/performance testing and observability. Commission India-specific privacy, platform, fairness and membership eligibility review. Obtain an appropriate ephemeris/provider before implementing advanced astrology. Payments, signing, distribution and public hosting require a separate authorized launch workflow.

## GitHub Pages preparation

The owner approved public source and Pages publication on 11 November 2026. Deployment targets https://skgtheking.github.io/aurev/ from the separate skgtheking/aurev repository. GitHub Actions builds on pushes to main with narrowly scoped Pages permissions. Source files were scanned for sensitive filenames and common credential patterns before publication. Native source/configuration objects are unchanged; native bundle exports passed after the web hosting changes. See GITHUB_PAGES.md and the repository’s Actions tab for verification and current deployment status.
