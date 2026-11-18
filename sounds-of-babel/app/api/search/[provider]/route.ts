import { NextRequest, NextResponse } from 'next/server';
import { getProvider, keyHeaderName } from '@/lib/providers';
import type { SoundResult } from '@/lib/providers/types';

export const dynamic = 'force-dynamic';

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX = 200;
const cache = new Map<string, { at: number; results: SoundResult[] }>();

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: id } = await params;
  const provider = getProvider(id);
  if (!provider) return NextResponse.json({ error: 'Unknown provider', results: [] }, { status: 404 });

  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!query) return NextResponse.json({ results: [] });

  const apiKey = provider.requiresKey
    ? request.headers.get(keyHeaderName(id))?.trim() || process.env[provider.envVar] || ''
    : '';
  if (provider.requiresKey && !apiKey) {
    return NextResponse.json({
      error: `${provider.name} API key not configured. Add your key in Settings. Get a free key at ${provider.getKeyUrl}`,
      results: [],
    });
  }

  const cacheKey = `${id}|${query.toLowerCase()}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return NextResponse.json({ results: hit.results });

  try {
    const results = await provider.search(query, apiKey);
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
    cache.set(cacheKey, { at: Date.now(), results });
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? `Failed to fetch from ${provider.name}`, results: [] });
  }
}
