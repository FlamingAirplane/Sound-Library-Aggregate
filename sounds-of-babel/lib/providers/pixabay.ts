import { ProviderError, type SoundProvider } from './types';

export const pixabay: SoundProvider = {
  id: 'pixabay',
  name: 'Pixabay',
  envVar: 'PIXABAY_API_KEY',
  getKeyUrl: 'https://pixabay.com/api/docs/',
  getKeyLabel: 'Get your Pixabay API key',
  searchPageUrl: (q) => `https://pixabay.com/sound-effects/search/${encodeURIComponent(q)}/`,
  async search(query, apiKey) {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&category=music&per_page=15`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ProviderError(`Pixabay API error (${res.status}): ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    return (data?.hits ?? []).map((h: any) => ({
      id: String(h.id),
      title: h.title ?? 'Untitled',
      duration: h.duration ?? 0,
      tags: typeof h.tags === 'string' ? h.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      previewUrl: h.audio_url,
      pageUrl: h.pageURL,
      author: h.user ?? 'Unknown',
    }));
  },
};
