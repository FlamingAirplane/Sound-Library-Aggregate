'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ExternalLink, Clock, Tag, Volume2, AlertCircle, Loader2 } from 'lucide-react';
import { apiKeyHeaders } from '@/lib/api-keys';
import type { SoundProvider, SoundResult } from '@/lib/providers/types';

interface ProviderResultsProps {
  provider: Pick<SoundProvider, 'id' | 'name' | 'searchPageUrl'>;
  searchTerm: string;
}

export function ProviderResults({ provider, searchTerm }: ProviderResultsProps) {
  const [results, setResults] = useState<SoundResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!searchTerm?.trim()) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSearched(true);
    fetch(`/api/search/${provider.id}?q=${encodeURIComponent(searchTerm)}`, { headers: apiKeyHeaders(provider.id) })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        setError(data?.error ?? null);
        setResults(data?.results ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setError(`Network error — could not reach ${provider.name} API`);
        setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchTerm, provider.id, provider.name]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const togglePlay = (sound: SoundResult) => {
    if (!sound.previewUrl) return;
    if (playingId === sound.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(sound.previewUrl);
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(sound.id);
  };

  if (!searched && !searchTerm) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-card p-5 mb-6"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-semibold tracking-tight">{provider.name} Results</h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 rounded-md p-3 mb-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No results found on {provider.name}.</p>
      )}

      <div className="space-y-2">
        {results.slice(0, 8).map((sound, i) => (
          <motion.div
            key={sound.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-md bg-secondary/40 hover:bg-secondary/70 transition-colors"
          >
            <button
              onClick={() => togglePlay(sound)}
              disabled={!sound.previewUrl}
              className="shrink-0 w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40"
              aria-label={playingId === sound.id ? 'Pause' : 'Play'}
            >
              {playingId === sound.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{sound.title}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {sound.duration.toFixed(1)}s
                </span>
                <span className="flex items-center gap-1 truncate">
                  <Tag className="w-3 h-3 shrink-0" />
                  {sound.tags.slice(0, 3).join(', ') || `by ${sound.author}`}
                </span>
              </div>
            </div>
            <a
              href={sound.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Open on ${provider.name}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>

      {results.length > 8 && (
        <p className="text-xs text-muted-foreground mt-3">
          Showing 8 of {results.length} results.
          <a href={provider.searchPageUrl(searchTerm)} target="_blank" rel="noopener noreferrer" className="text-primary ml-1 hover:underline">
            View all on {provider.name} →
          </a>
        </p>
      )}
    </motion.div>
  );
}
