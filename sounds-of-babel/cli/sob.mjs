#!/usr/bin/env node

// lib/libraries.ts
var libraries = [
  {
    id: "freesound",
    name: "Freesound",
    region: "EN",
    license: "Mixed",
    type: "Both",
    description: "Collaborative database of Creative Commons licensed sounds. Huge community-contributed library.",
    searchUrl: (term) => `https://freesound.org/search/?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: true,
    homepage: "https://freesound.org/",
    licenseName: "Per-sound: CC0, CC BY or CC BY-NC",
    licenseSummary: "Each sound has its own Creative Commons licence. Check the badge on the sound before using it commercially.",
    licenseUrl: "https://freesound.org/help/faq/#licenses",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Field recordings and community SFX",
    accountRequired: true,
    formats: "Original upload (WAV, FLAC, MP3...)"
  },
  {
    id: "pixabay",
    name: "Pixabay Audio",
    region: "EN",
    license: "Custom",
    type: "Both",
    description: "Royalty-free sound effects and music tracks. Part of the Pixabay creative commons media platform.",
    searchUrl: (term) => `https://pixabay.com/sound-effects/search/${encodeURIComponent(term)}/`,
    hasDeepLink: true,
    hasApi: true,
    homepage: "https://pixabay.com/sound-effects/",
    licenseName: "Pixabay Content License",
    licenseSummary: "Free for commercial use, attribution not required. You may not resell the sounds as-is. This is not CC0.",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    commercialUse: "yes",
    attribution: "not-required",
    bestFor: "Royalty-free SFX and music tracks",
    formats: "MP3"
  },
  {
    id: "bbc",
    name: "BBC Sound Effects",
    region: "EN",
    license: "Custom",
    type: "SFX",
    description: "Over 33,000 sound effects from the BBC archive. Free for personal, educational, and research use.",
    searchUrl: (term) => `https://sound-effects.bbcrewind.co.uk/search?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://sound-effects.bbcrewind.co.uk/",
    licenseName: "BBC RemArc licence",
    licenseSummary: "Personal, educational and research use only. Not for commercial projects.",
    licenseUrl: "https://sound-effects.bbcrewind.co.uk/licensing",
    commercialUse: "no",
    attribution: "required",
    bestFor: "Archive ambience and broadcast-quality SFX",
    formats: "WAV"
  },
  {
    id: "zapsplat",
    name: "ZapSplat",
    region: "EN",
    license: "Attribution",
    type: "Both",
    description: "Over 150,000 free sound effects and royalty-free music. Free with attribution or premium plan.",
    searchUrl: (term) => `https://www.zapsplat.com/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://www.zapsplat.com/",
    licenseName: "ZapSplat Standard License",
    licenseSummary: "Free tier requires credit to ZapSplat and allows commercial use. Paid Gold plan removes attribution.",
    licenseUrl: "https://www.zapsplat.com/license-type/standard-license/",
    commercialUse: "yes",
    attribution: "required",
    bestFor: "Game and video SFX in volume",
    accountRequired: true,
    formats: "MP3 (WAV on paid plan)"
  },
  {
    id: "99sounds",
    name: "99Sounds",
    region: "EN",
    license: "Custom",
    type: "SFX",
    description: "Curated free sound effect packs. High-quality downloadable sample packs for producers.",
    searchUrl: (term) => `https://99sounds.org/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://99sounds.org/",
    licenseName: "99Sounds free licence",
    licenseSummary: "Free sample packs for use in your projects. Terms are site-specific, so this is not CC0.",
    licenseUrl: "https://99sounds.org/",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Producer sample packs and SFX packs",
    formats: "WAV"
  },
  {
    id: "soundbible",
    name: "SoundBible",
    region: "EN",
    license: "Mixed",
    type: "SFX",
    description: "Free sound clips and effects. Includes both CC and public domain sounds.",
    searchUrl: (term) => `http://soundbible.com/search.php?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "http://soundbible.com/",
    licenseName: "Per-sound: CC BY 3.0 or public domain",
    licenseSummary: "Licence differs per clip and is shown on each sound's page.",
    licenseUrl: "http://soundbible.com/",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Short clips and quick effects",
    formats: "MP3, WAV"
  },
  {
    id: "orangefreesounds",
    name: "Orange Free Sounds",
    region: "EN",
    license: "Attribution",
    type: "Both",
    description: "Free sound effects, music loops, and music tracks. All free to use with attribution.",
    searchUrl: (term) => `https://www.orangefreesounds.com/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://www.orangefreesounds.com/",
    licenseName: "Per-sound licence (often CC BY-NC)",
    licenseSummary: "Many tracks are Creative Commons with attribution and may be non-commercial. Check each page.",
    licenseUrl: "https://www.orangefreesounds.com/",
    commercialUse: "varies",
    attribution: "required",
    bestFor: "Loops, ambience and music beds",
    formats: "MP3, WAV"
  },
  {
    id: "freetousesounds",
    name: "Free To Use Sounds",
    region: "EN",
    license: "Custom",
    type: "SFX",
    description: "Field recordings and sound effects from around the world. Unique location-based sounds.",
    searchUrl: (term) => `https://freetousesounds.com/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://freetousesounds.com/",
    licenseName: "Site-specific free licence",
    licenseSummary: "Free to use under the site's own terms. Read the licence page before commercial use.",
    licenseUrl: "https://freetousesounds.com/",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Location-based field recordings",
    formats: "WAV"
  },
  {
    id: "soundly",
    name: "Soundly",
    region: "EN",
    license: "Custom",
    type: "SFX",
    description: "Cloud-based sound effects platform with a free tier. Desktop app for browsing and previewing.",
    searchUrl: () => `https://getsoundly.com/`,
    hasDeepLink: false,
    hasApi: false,
    homepage: "https://getsoundly.com/",
    licenseName: "Soundly free-tier terms",
    licenseSummary: "Free tier has its own terms and limits. Licence is not CC0.",
    licenseUrl: "https://getsoundly.com/",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Browsing and previewing SFX in the Soundly app",
    accountRequired: true,
    formats: "App-based"
  },
  {
    id: "lasonotheque",
    name: "La Sonoth\xE8que",
    region: "FR",
    license: "Attribution",
    type: "SFX",
    description: "Banque de sons gratuits, bruitages et musiques libres de droits. French free sound library.",
    searchUrl: (term) => `https://lasonotheque.org/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://lasonotheque.org/",
    licenseName: "Creative Commons Attribution (per site)",
    licenseSummary: "Credit the author when you use a sound. The site's licence page is the source of truth.",
    licenseUrl: "https://lasonotheque.org/",
    commercialUse: "yes",
    attribution: "required",
    bestFor: "French ambience, nature and everyday sounds",
    formats: "MP3, WAV"
  },
  {
    id: "soundfishing",
    name: "Sound Fishing",
    region: "FR",
    license: "Mixed",
    type: "SFX",
    description: "French sound effects library. Bruitages et sons gratuits pour vos projets.",
    searchUrl: (term) => `https://www.sound-fishing.net/recherche/${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://www.sound-fishing.net/",
    licenseName: "Site-specific licence",
    licenseSummary: "Terms differ per sound. Check the licence on the page you download from.",
    licenseUrl: "https://www.sound-fishing.net/",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "French SFX and bruitages",
    formats: "MP3"
  },
  {
    id: "soundeffectlab",
    name: "Sound Effect Lab",
    region: "JP",
    license: "Custom",
    type: "SFX",
    description: "Japanese free sound effects library (\u52B9\u679C\u97F3\u30E9\u30DC). Extensive categorized SFX collection.",
    searchUrl: (term) => `https://soundeffect-lab.info/search/?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://soundeffect-lab.info/",
    licenseName: "Sound Effect Lab terms of use",
    licenseSummary: "Free for commercial use under the site's own terms, without credit. These are custom terms, not CC0.",
    licenseUrl: "https://soundeffect-lab.info/agreement/",
    commercialUse: "yes",
    attribution: "not-required",
    bestFor: "Japanese game and anime-style SFX",
    formats: "MP3"
  },
  {
    id: "otologic",
    name: "OtoLogic",
    region: "JP",
    license: "Attribution",
    type: "Both",
    description: "Japanese BGM and sound effects. Free music and SFX for videos, games, and apps.",
    searchUrl: (term) => `https://otologic.jp/free/se/search.html?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://otologic.jp/",
    licenseName: "OtoLogic licence (CC BY 4.0)",
    licenseSummary: "Credit OtoLogic. Commercial use is allowed.",
    licenseUrl: "https://otologic.jp/free/license.html",
    commercialUse: "yes",
    attribution: "required",
    bestFor: "Clean UI sounds and game SFX",
    formats: "MP3, WAV"
  },
  {
    id: "tairakomori",
    name: "Taira Komori",
    region: "JP",
    license: "Custom",
    type: "SFX",
    description: "Japanese field recording artist offering free sounds (\u5C0F\u68EE\u5E73). Unique natural and everyday sounds.",
    searchUrl: () => `https://taira-komori.jpn.org/freesoundindex.html`,
    hasDeepLink: false,
    hasApi: false,
    homepage: "https://taira-komori.jpn.org/freesoundindex.html",
    licenseName: "Site-specific terms",
    licenseSummary: "Free sounds under the artist's own conditions. Read the site's notes before commercial use.",
    licenseUrl: "https://taira-komori.jpn.org/freesoundindex.html",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Natural and everyday field recordings",
    formats: "MP3"
  },
  {
    id: "sounddictionary",
    name: "Sound Dictionary",
    region: "JP",
    license: "Custom",
    type: "SFX",
    description: "Japanese sound dictionary (\u97F3\u306E\u8F9E\u5178). Categorized everyday sounds and effects.",
    searchUrl: (term) => `https://sounddictionary.info/search/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://sounddictionary.info/",
    licenseName: "Site-specific terms",
    licenseSummary: "Terms are set by the site. Check before commercial use.",
    licenseUrl: "https://sounddictionary.info/",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Categorized everyday sounds",
    formats: "MP3"
  },
  {
    id: "springin",
    name: "Springin' Sound Stock",
    region: "JP",
    license: "Custom",
    type: "Both",
    description: "Free sound effects and music from the Springin' creative platform. Japanese creative commons audio.",
    searchUrl: () => `https://www.springin.org/sound-stock/`,
    hasDeepLink: false,
    hasApi: false,
    homepage: "https://www.springin.org/sound-stock/",
    licenseName: "Springin' Sound Stock terms",
    licenseSummary: "Custom terms for the sound stock. Check the licence page before use.",
    licenseUrl: "https://www.springin.org/sound-stock/",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Japanese SFX and short music",
    formats: "MP3"
  },
  {
    id: "openverse",
    name: "Openverse",
    region: "EN",
    license: "Mixed",
    type: "Both",
    description: "Search engine for openly licensed audio, aggregating many Creative Commons sources.",
    searchUrl: (term) => `https://openverse.org/search/audio?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://openverse.org/search/audio",
    licenseName: "Per-sound: CC0, CC BY, CC BY-SA and more",
    licenseSummary: "Every result shows its own Creative Commons licence. Filter by licence on Openverse itself.",
    licenseUrl: "https://openverse.org/about",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Finding CC audio from many sources at once",
    formats: "Varies by source"
  },
  {
    id: "internetarchive",
    name: "Internet Archive Audio",
    region: "EN",
    license: "Mixed",
    type: "Both",
    description: "Huge archive of public domain and openly licensed recordings, music and spoken word.",
    searchUrl: (term) => `https://archive.org/search?query=${encodeURIComponent(term)}&and%5B%5D=mediatype%3A%22audio%22`,
    hasDeepLink: true,
    hasApi: false,
    homepage: "https://archive.org/details/audio",
    licenseName: "Per-item: public domain or Creative Commons",
    licenseSummary: "Rights vary item by item. Read the licence shown on each item page.",
    licenseUrl: "https://archive.org/about/terms.php",
    commercialUse: "varies",
    attribution: "varies",
    bestFor: "Historic recordings and rare audio",
    formats: "MP3, FLAC, OGG"
  }
];

// lib/translate.ts
var DICTIONARY = {
  thunder: { fr: "tonnerre", ja: "\u96F7" },
  thunderstorm: { fr: "orage", ja: "\u96F7\u96E8" },
  rain: { fr: "pluie", ja: "\u96E8" },
  wind: { fr: "vent", ja: "\u98A8" },
  fire: { fr: "feu", ja: "\u706B" },
  water: { fr: "eau", ja: "\u6C34" },
  ocean: { fr: "oc\xE9an", ja: "\u6D77" },
  waves: { fr: "vagues", ja: "\u6CE2" },
  river: { fr: "rivi\xE8re", ja: "\u5DDD" },
  footsteps: { fr: "pas", ja: "\u8DB3\u97F3" },
  door: { fr: "porte", ja: "\u30C9\u30A2" },
  explosion: { fr: "explosion", ja: "\u7206\u767A" },
  piano: { fr: "piano", ja: "\u30D4\u30A2\u30CE" },
  guitar: { fr: "guitare", ja: "\u30AE\u30BF\u30FC" },
  bird: { fr: "oiseau", ja: "\u9CE5" },
  birds: { fr: "oiseaux", ja: "\u9CE5" },
  dog: { fr: "chien", ja: "\u72AC" },
  cat: { fr: "chat", ja: "\u732B" },
  car: { fr: "voiture", ja: "\u8ECA" },
  train: { fr: "train", ja: "\u96FB\u8ECA" },
  bell: { fr: "cloche", ja: "\u9418" },
  clock: { fr: "horloge", ja: "\u6642\u8A08" },
  crowd: { fr: "foule", ja: "\u7FA4\u8846" },
  applause: { fr: "applaudissements", ja: "\u62CD\u624B" },
  laughter: { fr: "rire", ja: "\u7B11\u3044\u58F0" },
  forest: { fr: "for\xEAt", ja: "\u68EE" },
  city: { fr: "ville", ja: "\u8857" },
  night: { fr: "nuit", ja: "\u591C" },
  sword: { fr: "\xE9p\xE9e", ja: "\u5263" },
  gunshot: { fr: "coup de feu", ja: "\u9283\u58F0" },
  engine: { fr: "moteur", ja: "\u30A8\u30F3\u30B8\u30F3" },
  glass: { fr: "verre", ja: "\u30AC\u30E9\u30B9" },
  keyboard: { fr: "clavier", ja: "\u30AD\u30FC\u30DC\u30FC\u30C9" },
  coin: { fr: "pi\xE8ce", ja: "\u30B3\u30A4\u30F3" },
  click: { fr: "clic", ja: "\u30AF\u30EA\u30C3\u30AF" },
  whoosh: { fr: "souffle", ja: "\u30B7\u30E5\u30C3" },
  heartbeat: { fr: "battement de coeur", ja: "\u5FC3\u81D3\u306E\u9F13\u52D5" },
  snow: { fr: "neige", ja: "\u96EA" },
  cricket: { fr: "grillon", ja: "\u30B3\u30AA\u30ED\u30AE" },
  frog: { fr: "grenouille", ja: "\u30AB\u30A8\u30EB" },
  cicada: { fr: "cigale", ja: "\u8749" }
};
var REVERSE = {};
for (const [en, t] of Object.entries(DICTIONARY)) {
  REVERSE[t.fr.toLowerCase()] ??= en;
  REVERSE[t.ja] ??= en;
}
function containsJapanese(text) {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
}
function dictionaryTranslate(query) {
  const key = query.trim().toLowerCase();
  const en = DICTIONARY[key] ? key : REVERSE[key];
  if (!en) return null;
  const t = DICTIONARY[en];
  return { en, fr: t.fr, ja: t.ja, source: "dictionary" };
}
async function myMemory(text, from, to) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6e3) });
    if (!res.ok) return null;
    const data = await res.json();
    const out2 = data?.responseData?.translatedText;
    if (typeof out2 !== "string" || !out2.trim() || data?.responseStatus !== 200) return null;
    return out2.trim();
  } catch {
    return null;
  }
}
async function translateQuery(query) {
  const q = query.trim().slice(0, 100);
  const hit = dictionaryTranslate(q);
  if (hit) return hit;
  const from = containsJapanese(q) ? "ja" : "en";
  const en = from === "en" ? q : await myMemory(q, from, "en") ?? q;
  const [fr, ja] = await Promise.all([
    myMemory(en, "en", "fr"),
    from === "ja" ? q : myMemory(en, "en", "ja")
  ]);
  const jaOk = ja && containsJapanese(ja) ? ja : null;
  return {
    en,
    fr: fr ?? en,
    ja: jaOk ?? en,
    source: fr || jaOk ? "online" : "none"
  };
}
function termForRegion(t, region, fallback) {
  if (!t) return fallback;
  if (region === "FR") return t.fr || fallback;
  if (region === "JP") return t.ja || fallback;
  return t.en || fallback;
}

// cli/sob.ts
var HELP = `sob - Sounds of Babel CLI. Finds free sound libraries and builds search links. Output is JSON.

Usage:
  sob search <term> [filters]   Translate <term> and return a search URL per library
  sob list [filters]            List libraries
  sob info <id>                 Full details for one library
  sob translate <term>          Translate a term into EN/FR/JA
  sob help                      Show this help

Filters (search and list):
  --type SFX|Music|Both         SFX also matches Both; Music also matches Both
  --region EN|FR|JP             Site language
  --license CC0|Attribution|Mixed|Custom
  --commercial                  Only libraries that allow commercial use ("yes")
  --no-attribution              Only libraries that do not require credit
  --no-translate                search: use <term> as-is for every library
  --pretty                      Indented JSON

Notes for agents:
  Licence fields are summaries, not legal advice. Always check licenceUrl.
  A library with hasDeepLink=false returns its homepage as url, not a search.
  Exit code 0 on success, 1 on usage error. Errors print JSON {"error": "..."} to stderr.
`;
var FLAGS_WITH_VALUE = /* @__PURE__ */ new Set(["type", "region", "license"]);
function parse(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (FLAGS_WITH_VALUE.has(key)) {
        const v = argv[++i];
        if (!v) fail(`--${key} needs a value`);
        flags[key] = v;
      } else {
        flags[key] = true;
      }
    } else positional.push(a);
  }
  return { positional, flags };
}
function fail(message) {
  console.error(JSON.stringify({ error: message }));
  process.exit(1);
}
function out(data, pretty) {
  console.log(JSON.stringify(data, null, pretty ? 2 : 0));
}
function filter(flags) {
  const type = flags.type;
  const region = flags.region?.toUpperCase();
  const license = flags.license;
  if (type && !["SFX", "Music", "Both"].includes(type)) fail("--type must be SFX, Music or Both");
  if (region && !["EN", "FR", "JP"].includes(region)) fail("--region must be EN, FR or JP");
  if (license && !["CC0", "Attribution", "Mixed", "Custom"].includes(license)) fail("--license must be CC0, Attribution, Mixed or Custom");
  return libraries.filter((l) => {
    if (type === "SFX" && l.type === "Music") return false;
    if (type === "Music" && l.type === "SFX") return false;
    if (type === "Both" && l.type !== "Both") return false;
    if (region && l.region !== region) return false;
    if (license && l.license !== license) return false;
    if (flags.commercial && l.commercialUse !== "yes") return false;
    if (flags["no-attribution"] && l.attribution !== "not-required") return false;
    return true;
  });
}
function summary(l) {
  return {
    id: l.id,
    name: l.name,
    region: l.region,
    type: l.type,
    license: l.license,
    licenseName: l.licenseName,
    commercialUse: l.commercialUse,
    attribution: l.attribution,
    hasDeepLink: l.hasDeepLink,
    homepage: l.homepage
  };
}
function detail(l) {
  const { searchUrl: _s, ...rest } = l;
  return rest;
}
async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const { positional, flags } = parse(rest);
  const pretty = Boolean(flags.pretty);
  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    console.log(HELP);
    return;
  }
  if (cmd === "list") {
    const list = filter(flags);
    out({ count: list.length, libraries: list.map(summary) }, pretty);
  } else if (cmd === "info") {
    const id = positional[0];
    if (!id) fail("usage: sob info <id>");
    const lib = libraries.find((l) => l.id === id.toLowerCase());
    if (!lib) fail(`unknown library "${id}". Run "sob list" for ids.`);
    out(detail(lib), pretty);
  } else if (cmd === "translate") {
    const term = positional.join(" ").trim();
    if (!term) fail("usage: sob translate <term>");
    out(await translateQuery(term), pretty);
  } else if (cmd === "search") {
    const term = positional.join(" ").trim();
    if (!term) fail("usage: sob search <term>");
    const list = filter(flags);
    const t = flags["no-translate"] ? null : await translateQuery(term);
    const results = list.map((l) => {
      const q = termForRegion(t, l.region, term);
      return {
        ...summary(l),
        searchTerm: q,
        url: l.hasDeepLink ? l.searchUrl(q) : l.homepage,
        licenseUrl: l.licenseUrl,
        licenseSummary: l.licenseSummary
      };
    });
    out(
      {
        query: term,
        translations: t ? { en: t.en, fr: t.fr, ja: t.ja, source: t.source } : null,
        count: results.length,
        results,
        warning: "Licence info is a summary, not legal advice. Check licenseUrl before using any sound commercially."
      },
      pretty
    );
  } else {
    fail(`unknown command "${cmd}". Run "sob help".`);
  }
}
main().catch((e) => fail(e?.message ?? String(e)));
