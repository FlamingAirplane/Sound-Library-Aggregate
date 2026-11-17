import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = await request.nextUrl.searchParams;
    const query = searchParams?.get?.('q') ?? '';

    if (!query?.trim()) {
      return NextResponse.json({ results: [] });
    }

    const apiKey = process.env.FREESOUND_API_KEY ?? '';

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Freesound API key not configured. Add FREESOUND_API_KEY to your environment variables. Get a free key at https://freesound.org/apiv2/apply/',
          results: [],
        },
        { status: 200 }
      );
    }

    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&fields=id,name,duration,tags,previews,url,username&page_size=15&token=${apiKey}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json(
        { error: `Freesound API error (${res.status}): ${text?.slice(0, 200) ?? 'Unknown error'}`, results: [] },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ results: data?.results ?? [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Failed to fetch from Freesound', results: [] },
      { status: 200 }
    );
  }
}
