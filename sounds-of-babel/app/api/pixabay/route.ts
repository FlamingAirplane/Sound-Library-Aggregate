import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = await request.nextUrl.searchParams;
    const query = searchParams?.get?.('q') ?? '';

    if (!query?.trim()) {
      return NextResponse.json({ hits: [] });
    }

    const apiKey = process.env.PIXABAY_API_KEY ?? '';

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Pixabay API key not configured. Add PIXABAY_API_KEY to your environment variables. Get a free key at https://pixabay.com/api/docs/',
          hits: [],
        },
        { status: 200 }
      );
    }

    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&category=music&per_page=15`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json(
        { error: `Pixabay API error (${res.status}): ${text?.slice(0, 200) ?? 'Unknown error'}`, hits: [] },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ hits: data?.hits ?? [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Failed to fetch from Pixabay', hits: [] },
      { status: 200 }
    );
  }
}
