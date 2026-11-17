export type QueryLang = 'en' | 'fr' | 'ja';

export interface Translations {
  en: string;
  fr: string;
  ja: string;
  source: 'dictionary' | 'online' | 'none';
}

const DICTIONARY: Record<string, { fr: string; ja: string }> = {
  thunder: { fr: 'tonnerre', ja: '雷' },
  thunderstorm: { fr: 'orage', ja: '雷雨' },
  rain: { fr: 'pluie', ja: '雨' },
  wind: { fr: 'vent', ja: '風' },
  fire: { fr: 'feu', ja: '火' },
  water: { fr: 'eau', ja: '水' },
  ocean: { fr: 'océan', ja: '海' },
  waves: { fr: 'vagues', ja: '波' },
  river: { fr: 'rivière', ja: '川' },
  footsteps: { fr: 'pas', ja: '足音' },
  door: { fr: 'porte', ja: 'ドア' },
  explosion: { fr: 'explosion', ja: '爆発' },
  piano: { fr: 'piano', ja: 'ピアノ' },
  guitar: { fr: 'guitare', ja: 'ギター' },
  bird: { fr: 'oiseau', ja: '鳥' },
  birds: { fr: 'oiseaux', ja: '鳥' },
  dog: { fr: 'chien', ja: '犬' },
  cat: { fr: 'chat', ja: '猫' },
  car: { fr: 'voiture', ja: '車' },
  train: { fr: 'train', ja: '電車' },
  bell: { fr: 'cloche', ja: '鐘' },
  clock: { fr: 'horloge', ja: '時計' },
  crowd: { fr: 'foule', ja: '群衆' },
  applause: { fr: 'applaudissements', ja: '拍手' },
  laughter: { fr: 'rire', ja: '笑い声' },
  forest: { fr: 'forêt', ja: '森' },
  city: { fr: 'ville', ja: '街' },
  night: { fr: 'nuit', ja: '夜' },
  sword: { fr: 'épée', ja: '剣' },
  gunshot: { fr: 'coup de feu', ja: '銃声' },
  engine: { fr: 'moteur', ja: 'エンジン' },
  glass: { fr: 'verre', ja: 'ガラス' },
  keyboard: { fr: 'clavier', ja: 'キーボード' },
  coin: { fr: 'pièce', ja: 'コイン' },
  click: { fr: 'clic', ja: 'クリック' },
  whoosh: { fr: 'souffle', ja: 'シュッ' },
  heartbeat: { fr: 'battement de coeur', ja: '心臓の鼓動' },
  snow: { fr: 'neige', ja: '雪' },
  cricket: { fr: 'grillon', ja: 'コオロギ' },
  frog: { fr: 'grenouille', ja: 'カエル' },
  cicada: { fr: 'cigale', ja: '蝉' },
};

const REVERSE: Record<string, string> = {};
for (const [en, t] of Object.entries(DICTIONARY)) {
  REVERSE[t.fr.toLowerCase()] ??= en;
  REVERSE[t.ja] ??= en;
}

export function containsJapanese(text: string): boolean {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
}

export function dictionaryTranslate(query: string): Translations | null {
  const key = query.trim().toLowerCase();
  const en = DICTIONARY[key] ? key : REVERSE[key];
  if (!en) return null;
  const t = DICTIONARY[en];
  return { en, fr: t.fr, ja: t.ja, source: 'dictionary' };
}

async function myMemory(text: string, from: QueryLang, to: QueryLang): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json();
    const out = data?.responseData?.translatedText;
    if (typeof out !== 'string' || !out.trim() || data?.responseStatus !== 200) return null;
    return out.trim();
  } catch {
    return null;
  }
}

export async function translateQuery(query: string): Promise<Translations> {
  const q = query.trim().slice(0, 100);
  const hit = dictionaryTranslate(q);
  if (hit) return hit;

  const from: QueryLang = containsJapanese(q) ? 'ja' : 'en';
  const en = from === 'en' ? q : (await myMemory(q, from, 'en')) ?? q;
  const [fr, ja] = await Promise.all([
    myMemory(en, 'en', 'fr'),
    from === 'ja' ? q : myMemory(en, 'en', 'ja'),
  ]);
  const jaOk = ja && containsJapanese(ja) ? ja : null;
  return {
    en,
    fr: fr ?? en,
    ja: jaOk ?? en,
    source: fr || jaOk ? 'online' : 'none',
  };
}

export function termForRegion(t: Translations | null, region: 'EN' | 'FR' | 'JP', fallback: string): string {
  if (!t) return fallback;
  if (region === 'FR') return t.fr || fallback;
  if (region === 'JP') return t.ja || fallback;
  return t.en || fallback;
}
