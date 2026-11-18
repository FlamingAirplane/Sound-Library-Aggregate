import type { SoundResult } from '@/lib/providers/types';

export type ResultSort = 'relevance' | 'shortest' | 'longest' | 'licence';

export type TaggedResult = SoundResult & { providerId: string; providerName: string };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\.(wav|mp3|ogg|flac|aiff?)$/i, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

export function dedupe(results: TaggedResult[]): TaggedResult[] {
  const seen = new Set<string>();
  const out: TaggedResult[] = [];
  for (const r of results) {
    const key = `${norm(r.title)}|${norm(r.author)}`;
    if (norm(r.title) && seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

export function interleave(lists: TaggedResult[][]): TaggedResult[] {
  const out: TaggedResult[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const l of lists) if (l[i]) out.push(l[i]);
  return out;
}

export function sortResults(list: TaggedResult[], sort: ResultSort): TaggedResult[] {
  if (sort === 'shortest') return [...list].sort((a, b) => a.duration - b.duration);
  if (sort === 'longest') return [...list].sort((a, b) => b.duration - a.duration);
  if (sort === 'licence') return [...list].sort((a, b) => a.licenseRank - b.licenseRank);
  return list;
}
