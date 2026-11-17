import { NextRequest, NextResponse } from 'next/server';
import { translateQuery } from '@/lib/translate';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) {
    return NextResponse.json({ error: 'Missing q' }, { status: 400 });
  }
  const translations = await translateQuery(q);
  return NextResponse.json(translations);
}
