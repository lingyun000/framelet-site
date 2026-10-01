# Framelet public website

Public product overview, bilingual usage guide, support, privacy, terms and WebM third-party source/license information. This repository is separate from the private application source. GitHub Pages serves the root of `main`; no build step, framework, external font or analytics script is required.

## Pages

- `index.html`: product overview and bilingual component examples.
- `guide.html`: permissions, capture, hover detection, annotation, pinning, scrolling, recording, trimming, OCR/translation, settings and shortcuts.
- `support.html`: FAQ, safe public feedback and Apple purchase/support links.
- `privacy.html`, `terms.html`: existing substantive policies with consistent bilingual navigation.
- `third-party-sources.html`, `third-party-licenses/`: upstream source links, hashes, build information and licenses.

`language.js` follows supported browser-language order, falls back to Chinese and remembers explicit choices. Every page supports `?lang=zh` / `?lang=en`; old `#english` links still work. Navigation carries the language even when storage is blocked. Without JavaScript both complete language versions remain readable. No network request is made by the language script.

## Images and scope

The icon is Framelet’s own asset. Eight bilingual guide PNGs are offscreen renderings of the app’s production components using fictional demo content, visually reviewed on 2026-10-01. They are explicitly labeled as component examples, not full live app screenshots, store screenshots or a real Mac demonstration video. No private captures, logs or application source files are included.

The Mac App Store release is still in preparation. Do not add a download or store badge until a real distribution is available. Purchases/quotas are currently disabled in the normal app; do not advertise a test price or free trial. Website completion does not establish sandbox or App Review acceptance.

## Validation

```sh
python3 scripts/check_site.py
node scripts/check_language.cjs
```

Check both languages visually on desktop and narrow screens, keyboard focus, FAQ expansion and legacy/deep links before publishing. Images have native PNG signatures, explicit dimensions and alt text. Only reviewed public files should be committed and pushed to this repository.
