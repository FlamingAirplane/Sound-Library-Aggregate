# Sounds of Babel

Search the world's free sound effect (SFX) and music (MX) libraries in one place.

Type a keyword and Sounds of Babel shows live, playable results from **Freesound** and **Pixabay**, plus one-click pre-filled searches on 14 more libraries in English, French and Japanese (BBC Sound Effects, ZapSplat, 99Sounds, SoundBible, LaSonothèque, Sound Effect Lab, OtoLogic and more). Filter by type (SFX / Music), region (EN / FR / JP) and licence (CC0 / Attribution / Mixed).

> Always check the licence terms on each library's site before using a sound in professional or commercial projects.

## Getting started

Requires Node.js 20+ and Yarn.

```bash
yarn install
cp .env.example .env    # optional: add your free API keys
yarn dev                # http://localhost:3000
```

Production build: `yarn build && yarn start`

## API keys (optional)

| Variable | Where to get it |
| --- | --- |
| `FREESOUND_API_KEY` | https://freesound.org/apiv2/apply |
| `PIXABAY_API_KEY` | https://pixabay.com/api/docs/ |

Keys are only used server-side (`app/api/search/[provider]`). Never commit your `.env`.

## Project structure

- `lib/libraries.ts` — metadata and search URL patterns for all libraries (add new ones here)
- `components/search-hub.tsx` — search bar, filters and results
- `lib/providers/` — one adapter per live-search service (Freesound, Pixabay) behind a common `SoundProvider` interface; register new ones in `lib/providers/index.ts`
- `components/provider-results.tsx` — generic live results with audio previews for any provider
- `components/library-card.tsx` — deep-link cards
- `app/about/` — About page and library directory

## Deploying

Works out of the box on Vercel: import the repo and add the two environment variables (optional).
