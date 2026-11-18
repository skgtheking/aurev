# Aurev v0.2 — Co-founder feedback implementation

## Added in this feature branch

- Searchable, themed interest suggestions with café hopping, matcha, Pilates, venting, and numerous travel/culture/fitness options. Featured interests no longer include nightlife or dancing; older selections still survive in saved profiles.
- Custom interest entry with length validation and duplicate prevention.
- **My Type** checklist in onboarding and a dedicated editable screen under Profile/Settings. Users can select qualities, mark some as personal non-negotiables, and control visibility; sensitive choices and all dealbreakers are hidden from publicly displayable summaries. These preferences never automatically exclude or score other people.
- Original, quiet web-only opening chime with persisted opt-in control and manual preview. No unsolicited autoplay. Native app opening sound remains unimplemented pending installation of a supported Expo audio library.
- Additional deterministic tests for curated interests, checklist normalization/privacy, and persistence. A pull request CI workflow checks TypeScript, lint, tests, and GitHub Pages web export.

## Already present in the baseline

- Relationship intention multiselect, daily 10-like cap for free demo users, and refreshed playful Cosmic Chemistry. TripMatch and the five-tab structure are retained.

## Important limitations

This is a **fictional local demo**. User preferences are stored in unencrypted device/browser storage and do not sync or drive real-world matching. The checklist's visible option controls public presentation intent only; no actual profile broadcasts exist. The web sound only runs within a user gesture. Native launch audio and any real ad SDK/payments remain future work. Actual web/native runtime visual QA and CI are required before merging to main and publishing.
