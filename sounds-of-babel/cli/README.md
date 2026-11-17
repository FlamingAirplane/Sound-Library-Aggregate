# sob - Sounds of Babel CLI

Zero-install command line for AI agents and scripts. Needs Node 18+. Prints JSON.

```bash
node sounds-of-babel/cli/sob.mjs help
node sounds-of-babel/cli/sob.mjs search "thunderstorm" --commercial
node sounds-of-babel/cli/sob.mjs search "rain" --region JP --type SFX
node sounds-of-babel/cli/sob.mjs list --no-attribution
node sounds-of-babel/cli/sob.mjs info pixabay
node sounds-of-babel/cli/sob.mjs translate "wolf howling"
```

- `search` translates the term into EN/FR/JA and returns a ready URL per library, using the right language for each site. Libraries with `hasDeepLink: false` return their homepage instead.
- Filters: `--type`, `--region`, `--license`, `--commercial`, `--no-attribution`, `--no-translate`, `--pretty`.
- Errors go to stderr as `{"error": "..."}` with exit code 1.
- Licence fields are unverified summaries, not legal advice. Check `licenseUrl`.
- Translation uses a built-in dictionary, then the free MyMemory API (network needed for uncommon words).

After editing `lib/libraries.ts` or `lib/translate.ts`, rebuild the bundle with `npm run build:cli` and commit `cli/sob.mjs`.
