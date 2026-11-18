'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ExternalLink, Clock, Volume2, Loader2, ShieldCheck } from 'lucide-react';
import { apiKeyHeaders, getApiKey } from '@/lib/api-keys';
import { providers } from '@/lib/providers';
import { dedupe, interleave, sortResults, type ResultSort, type TaggedResult } from '@/lib/merge-results';
import type { SoundResult } from '@/lib/providers/types';

const STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_SITE === '1';
const DEBOUNCE_MS = 300;
const CACHE_TTL_MS = 5 * 60 * 1000;
const PAGE_SIZE = 24;

type Status = 'loading' | 'done' | 'skipped';
interface SourceState {
  status: Status;
  results: SoundResult[];
  error?: string;
}

const clientCache = new Map<string, { at: number; results: SoundResult[] }>();

const initialSources = (status: Status): Record<string, SourceState> =>
  Object.fromEntries(providers.map((p) => [p.id, { status, results: [] }]));

export function LiveResults({ searchTerm }: { searchTerm: string }) {
  const [sources, setSources] = useState<Record<string, SourceState>>(() => initialSources('loading'));
  const [sort, setSort] = useState<ResultSort>('relevance');
  const [commercialOnly, setCommercialOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const term = searchTerm?.trim();
    if (!term) return;
    let cancelled = false;
    setSources(initialSources('loading'));
    setVisible(PAGE_SIZE);

    const timer = setTimeout(() => {
      providers.forEach(async (p) => {
        const cacheKey = `${p.id}|${term.toLowerCase()}`;
        const cached = clientCache.get(cacheKey);
        const set = (s: SourceState) => !cancelled && setSources((prev) => ({ ...prev, [p.id]: s }));
        if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
          set({ status: 'done', results: cached.results });
          return;
        }
        try {
          let results: SoundResult[];
          if (STATIC_SITE) {
            const key = getApiKey(p.id);
            if (p.requiresKey && !key) {
              set({ status: 'skipped', results: [], error: `${p.name} API key not configured` });
              return;
            }
            results = await p.search(term, key);
          } else {
            const res = await fetch(`/api/search/${p.id}?q=${encodeURIComponent(term)}`, { headers: apiKeyHeaders(p.id) });
            const data = await res.json();
            if (data?.error || !res.ok) {
              set({ status: 'skipped', results: [], error: data?.error });
              return;
            }
            results = data?.results ?? [];
          }
          clientCache.set(cacheKey, { at: Date.now(), results });
          set({ status: 'done', results });
        } catch {
          set({ status: 'skipped', results: [] });
        }
      });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const merged = useMemo(() => {
    const flat: TaggedResult[] = providers.flatMap((p) =>
      (sources[p.id]?.results ?? []).map((r) => ({ ...r, providerId: p.id, providerName: p.name })),
    );
    const unique = dedupe(flat);
    const grouped = providers.map((p) => unique.filter((r) => r.providerId === p.id));
    let list = interleave(grouped);
    if (commercialOnly) list = list.filter((r) => r.commercialUse === true);
    return sortResults(list, sort);
  }, [sources, sort, commercialOnly]);

  const togglePlay = (key: string, url?: string) => {
    if (!url) return;
    if (playingId === key) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(url);
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(key);
  };

  if (!searchTerm?.trim()) return null;

  const loading = providers.some((p) => sources[p.id]?.status === 'loading');
  const skipped = providers.filter((p) => sources[p.id]?.status === 'skipped');
  const missingKey = skipped.filter((p) => p.requiresKey && sources[p.id]?.error?.includes('not configured'));
  const failed = skipped.filter((p) => !missingKey.includes(p));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-card p-5 mb-6"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Volume2 className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-semibold tracking-tight">Live results</h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" aria-label="Loading" />}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={commercialOnly}
              onChange={(e) => setCommercialOnly(e.target.checked)}
            />
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Safe for commercial use
          </label>
          <label className="text-xs text-muted-foreground flex items-center gap-1.5">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as ResultSort)}
              className="rounded-md bg-secondary text-secondary-foreground text-xs px-2 py-1.5"
            >
              <option value="relevance">Relevance (mixed)</option>
              <option value="shortest">Shortest first</option>
              <option value="longest">Longest first</option>
              <option value="licence">Most permissive licence</option>
            </select>
          </label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {providers
          .filter((p) => sources[p.id]?.status === 'done')
          .map((p) => `${p.name} (${sources[p.id].results.length})`)
          .join(' · ') || (loading ? 'Waiting for sources…' : '')}
        {loading && providers.some((p) => sources[p.id]?.status === 'done') && ' · still loading others…'}
      </p>

      {!loading && merged.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {commercialOnly ? 'No results confirmed safe for commercial use.' : 'No live results found.'}
        </p>
      )}

      <div className="space-y-2">
        {merged.slice(0, visible).map((sound, i) => {
          const key = `${sound.providerId}:${sound.id}`;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-md bg-secondary/40 hover:bg-secondary/70 transition-colors"
            >
              <button
                onClick={() => togglePlay(key, sound.previewUrl)}
                disabled={!sound.previewUrl}
                className="shrink-0 w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40"
                aria-label={playingId === key ? 'Pause' : 'Play'}
              >
                {playingId === key ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{sound.title}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sound.duration.toFixed(1)}s
                  </span>
                  <span className="truncate">by {sound.author}</span>
                  <span>{sound.providerName}</span>
                  <span
                    className={
                      sound.commercialUse === true
                        ? 'text-emerald-400'
                        : sound.commercialUse === false
                          ? 'text-amber-400'
                          : ''
                    }
                  >
                    {sound.license}
                    {sound.commercialUse === false && ' · non-commercial'}
                  </span>
                </div>
              </div>
              <a
                href={sound.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                aria-label={`Open ${sound.title} on ${sound.providerName}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          );
        })}
      </div>

      {merged.length > visible && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="mt-3 text-xs text-primary hover:underline"
        >
          Show more ({merged.length - visible} left)
        </button>
      )}

      {!loading && (missingKey.length > 0 || failed.length > 0) && (
        <p className="text-xs text-muted-foreground mt-3">
          {failed.length > 0 && `${failed.map((p) => p.name).join(', ')} didn't respond and was skipped. `}
          {missingKey.length > 0 && `Add a ${missingKey.map((p) => p.name).join(' / ')} key in Settings to include it.`}
        </p>
      )}
    </motion.div>
  );
}
