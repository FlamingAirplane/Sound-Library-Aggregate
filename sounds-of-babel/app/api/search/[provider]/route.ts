import { NextRequest, NextResponse } from 'next/server';
import { getProvider, keyHeaderName } from '@/lib/providers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: id } = await params;
  const provider = getProvider(id);
  if (!provider) return NextResponse.json({ error: 'Unknown provider', results: [] }, { status: 404 });

  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!query) return NextResponse.json({ results: [] });

  const apiKey = request.headers.get(keyHeaderName(id))?.trim() || process.env[provider.envVar] || '';
  if (!apiKey) {
    return NextResponse.json({
      error: `${provider.name} API key not configured. Add your key in Settings. Get a free key at ${provider.getKeyUrl}`,
      results: [],
    });
  }

  try {
    return NextResponse.json({ results: await provider.search(query, apiKey) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? `Failed to fetch from ${provider.name}`, results: [] });
  }
}
