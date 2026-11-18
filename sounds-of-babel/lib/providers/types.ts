export interface SoundResult {
  id: string;
  title: string;
  duration: number;
  tags: string[];
  previewUrl?: string;
  pageUrl: string;
  author: string;
}

export interface SoundProvider {
  id: string;
  name: string;
  envVar: string;
  getKeyUrl: string;
  getKeyLabel: string;
  searchPageUrl: (query: string) => string;
  search: (query: string, apiKey: string) => Promise<SoundResult[]>;
}

export class ProviderError extends Error {}
