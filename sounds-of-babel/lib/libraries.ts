export type LibraryRegion = 'EN' | 'FR' | 'JP';
export type LibraryLicense = 'CC0' | 'Attribution' | 'Mixed';
export type LibraryType = 'SFX' | 'Music' | 'Both';

export interface SoundLibrary {
  id: string;
  name: string;
  region: LibraryRegion;
  license: LibraryLicense;
  type: LibraryType;
  description: string;
  searchUrl: (term: string) => string;
  hasDeepLink: boolean;
  hasApi: boolean;
  homepage: string;
}

export const libraries: SoundLibrary[] = [
  {
    id: 'freesound',
    name: 'Freesound',
    region: 'EN',
    license: 'Mixed',
    type: 'Both',
    description: 'Collaborative database of Creative Commons licensed sounds. Huge community-contributed library.',
    searchUrl: (term: string) => `https://freesound.org/search/?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: true,
    homepage: 'https://freesound.org/',
  },
  {
    id: 'pixabay',
    name: 'Pixabay Audio',
    region: 'EN',
    license: 'CC0',
    type: 'Both',
    description: 'Royalty-free sound effects and music tracks. Part of the Pixabay creative commons media platform.',
    searchUrl: (term: string) => `https://pixabay.com/sound-effects/search/${encodeURIComponent(term)}/`,
    hasDeepLink: true,
    hasApi: true,
    homepage: 'https://pixabay.com/sound-effects/',
  },
  {
    id: 'bbc',
    name: 'BBC Sound Effects',
    region: 'EN',
    license: 'Attribution',
    type: 'SFX',
    description: 'Over 33,000 sound effects from the BBC archive. Free for personal, educational, and research use.',
    searchUrl: (term: string) => `https://sound-effects.bbcrewind.co.uk/search?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://sound-effects.bbcrewind.co.uk/',
  },
  {
    id: 'zapsplat',
    name: 'ZapSplat',
    region: 'EN',
    license: 'Attribution',
    type: 'Both',
    description: 'Over 150,000 free sound effects and royalty-free music. Free with attribution or premium plan.',
    searchUrl: (term: string) => `https://www.zapsplat.com/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://www.zapsplat.com/',
  },
  {
    id: '99sounds',
    name: '99Sounds',
    region: 'EN',
    license: 'CC0',
    type: 'SFX',
    description: 'Curated free sound effect packs. High-quality downloadable sample packs for producers.',
    searchUrl: (term: string) => `https://99sounds.org/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://99sounds.org/',
  },
  {
    id: 'soundbible',
    name: 'SoundBible',
    region: 'EN',
    license: 'Mixed',
    type: 'SFX',
    description: 'Free sound clips and effects. Includes both CC and public domain sounds.',
    searchUrl: (term: string) => `http://soundbible.com/search.php?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'http://soundbible.com/',
  },
  {
    id: 'orangefreesounds',
    name: 'Orange Free Sounds',
    region: 'EN',
    license: 'Attribution',
    type: 'Both',
    description: 'Free sound effects, music loops, and music tracks. All free to use with attribution.',
    searchUrl: (term: string) => `https://www.orangefreesounds.com/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://www.orangefreesounds.com/',
  },
  {
    id: 'freetousesounds',
    name: 'Free To Use Sounds',
    region: 'EN',
    license: 'Attribution',
    type: 'SFX',
    description: 'Field recordings and sound effects from around the world. Unique location-based sounds.',
    searchUrl: (term: string) => `https://freetousesounds.com/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://freetousesounds.com/',
  },
  {
    id: 'soundly',
    name: 'Soundly',
    region: 'EN',
    license: 'Mixed',
    type: 'SFX',
    description: 'Cloud-based sound effects platform with a free tier. Desktop app for browsing and previewing.',
    searchUrl: () => `https://getsoundly.com/`,
    hasDeepLink: false,
    hasApi: false,
    homepage: 'https://getsoundly.com/',
  },
  {
    id: 'lasonotheque',
    name: 'La Sonothèque',
    region: 'FR',
    license: 'CC0',
    type: 'SFX',
    description: 'Banque de sons gratuits, bruitages et musiques libres de droits. French free sound library.',
    searchUrl: (term: string) => `https://lasonotheque.org/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://lasonotheque.org/',
  },
  {
    id: 'soundfishing',
    name: 'Sound Fishing',
    region: 'FR',
    license: 'Mixed',
    type: 'SFX',
    description: 'French sound effects library. Bruitages et sons gratuits pour vos projets.',
    searchUrl: (term: string) => `https://www.sound-fishing.net/recherche/${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://www.sound-fishing.net/',
  },
  {
    id: 'soundeffectlab',
    name: 'Sound Effect Lab',
    region: 'JP',
    license: 'CC0',
    type: 'SFX',
    description: 'Japanese free sound effects library (効果音ラボ). Extensive categorized SFX collection.',
    searchUrl: (term: string) => `https://soundeffect-lab.info/search/?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://soundeffect-lab.info/',
  },
  {
    id: 'otologic',
    name: 'OtoLogic',
    region: 'JP',
    license: 'Attribution',
    type: 'Both',
    description: 'Japanese BGM and sound effects. Free music and SFX for videos, games, and apps.',
    searchUrl: (term: string) => `https://otologic.jp/free/se/search.html?q=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://otologic.jp/',
  },
  {
    id: 'tairakomori',
    name: 'Taira Komori',
    region: 'JP',
    license: 'CC0',
    type: 'SFX',
    description: 'Japanese field recording artist offering free sounds (小森平). Unique natural and everyday sounds.',
    searchUrl: () => `https://taira-komori.jpn.org/freesoundindex.html`,
    hasDeepLink: false,
    hasApi: false,
    homepage: 'https://taira-komori.jpn.org/freesoundindex.html',
  },
  {
    id: 'sounddictionary',
    name: 'Sound Dictionary',
    region: 'JP',
    license: 'CC0',
    type: 'SFX',
    description: 'Japanese sound dictionary (音の辞典). Categorized everyday sounds and effects.',
    searchUrl: (term: string) => `https://sounddictionary.info/search/?s=${encodeURIComponent(term)}`,
    hasDeepLink: true,
    hasApi: false,
    homepage: 'https://sounddictionary.info/',
  },
  {
    id: 'springin',
    name: "Springin' Sound Stock",
    region: 'JP',
    license: 'CC0',
    type: 'Both',
    description: 'Free sound effects and music from the Springin\' creative platform. Japanese creative commons audio.',
    searchUrl: () => `https://www.springin.org/sound-stock/`,
    hasDeepLink: false,
    hasApi: false,
    homepage: 'https://www.springin.org/sound-stock/',
  },
];

export const regionLabels: Record<LibraryRegion, string> = {
  EN: 'English',
  FR: 'French',
  JP: 'Japanese',
};

export const regionFlags: Record<LibraryRegion, string> = {
  EN: '🇬🇧',
  FR: '🇫🇷',
  JP: '🇯🇵',
};

export const licenseColors: Record<LibraryLicense, string> = {
  CC0: 'bg-emerald-500/20 text-emerald-400',
  Attribution: 'bg-amber-500/20 text-amber-400',
  Mixed: 'bg-purple-500/20 text-purple-400',
};

export const typeColors: Record<LibraryType, string> = {
  SFX: 'bg-cyan-500/20 text-cyan-400',
  Music: 'bg-pink-500/20 text-pink-400',
  Both: 'bg-indigo-500/20 text-indigo-400',
};
