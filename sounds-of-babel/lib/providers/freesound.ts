import { ProviderError, type SoundProvider } from './types';

export const freesound: SoundProvider = {
  id: 'freesound',
  name: 'Freesound',
  envVar: 'FREESOUND_API_KEY',
  getKeyUrl: 'https://freesound.org/apiv2/apply/',
  getKeyLabel: 'Apply for a free Freesound API key',
  searchPageUrl: (q) => `https://freesound.org/search/?q=${encodeURIComponent(q)}`,
  async search(query, apiKey) {
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&fields=id,name,duration,tags,previews,url,username&page_size=15&token=${apiKey}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ProviderError(`Freesound API error (${res.status}): ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    return (data?.results ?? []).map((r: any) => ({
      id: String(r.id),
      title: r.name ?? 'Untitled',
      duration: r.duration ?? 0,
      tags: r.tags ?? [],
      previewUrl: r.previews?.['preview-lq-mp3'] ?? r.previews?.['preview-hq-mp3'],
      pageUrl: r.url,
      author: r.username ?? 'Unknown',
    }));
  },
};
