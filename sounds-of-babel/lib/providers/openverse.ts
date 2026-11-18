import { ProviderError, type SoundProvider } from './types';
import { licenseFromCode } from './license';

export const openverse: SoundProvider = {
  id: 'openverse',
  name: 'Openverse',
  requiresKey: false,
  envVar: '',
  getKeyUrl: 'https://openverse.org/',
  getKeyLabel: '',
  searchPageUrl: (q) => `https://openverse.org/search/audio?q=${encodeURIComponent(q)}`,
  async search(query) {
    const url = `https://api.openverse.org/v1/audio/?q=${encodeURIComponent(query)}&page_size=15`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ProviderError(`Openverse API error (${res.status}): ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    return (data?.results ?? []).map((r: any) => ({
      id: String(r.id),
      title: r.title ?? 'Untitled',
      duration: (r.duration ?? 0) / 1000,
      tags: (r.tags ?? []).map((t: any) => t?.name).filter(Boolean),
      previewUrl: r.url,
      pageUrl: r.foreign_landing_url ?? r.url,
      author: r.creator ?? 'Unknown',
      source: r.source,
      ...licenseFromCode(r.license),
    }));
  },
};
