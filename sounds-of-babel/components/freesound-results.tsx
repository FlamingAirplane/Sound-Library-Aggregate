'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ExternalLink, Clock, Tag, Volume2, AlertCircle, Loader2 } from 'lucide-react';

interface FreesoundResult {
  id: number;
  name: string;
  duration: number;
  tags: string[];
  previews?: Record<string, string>;
  url: string;
  username: string;
}

interface FreesoundResultsProps {
  searchTerm: string;
}

export function FreesoundResults({ searchTerm }: FreesoundResultsProps) {
  const [results, setResults] = useState<FreesoundResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const search = async (term: string) => {
    if (!term?.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(`/api/freesound?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Failed to fetch from Freesound');
        setResults([]);
      } else {
        setResults(data?.results ?? []);
      }
    } catch {
      setError('Network error — could not reach Freesound API');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when searchTerm changes
  const lastSearchRef = useRef('');
  if (searchTerm && searchTerm !== lastSearchRef.current) {
    lastSearchRef.current = searchTerm;
    search(searchTerm);
  }

  const togglePlay = (sound: FreesoundResult) => {
    const previewUrl = sound?.previews?.['preview-lq-mp3'] ?? sound?.previews?.['preview-hq-mp3'];
    if (!previewUrl) return;

    if (playingId === sound?.id) {
      audioRef.current?.pause?.();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(previewUrl);
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(sound?.id ?? null);
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
        <h3 className="font-display text-lg font-semibold tracking-tight">Freesound Results</h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 rounded-md p-3 mb-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && searched && (results?.length ?? 0) === 0 && !error && (
        <p className="text-sm text-muted-foreground">No results found on Freesound.</p>
      )}

      <AnimatePresence>
        <div className="space-y-2">
          {(results ?? []).slice(0, 8).map((sound: FreesoundResult, i: number) => (
            <motion.div
              key={sound?.id ?? i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-md bg-secondary/40 hover:bg-secondary/70 transition-colors"
            >
              <button
                onClick={() => togglePlay(sound)}
                className="shrink-0 w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors"
                aria-label={playingId === sound?.id ? 'Pause' : 'Play'}
              >
                {playingId === sound?.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{sound?.name ?? 'Untitled'}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {(sound?.duration ?? 0)?.toFixed?.(1) ?? '0.0'}s
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {(sound?.tags ?? []).slice(0, 3).join(', ') || 'No tags'}
                  </span>
                </div>
              </div>
              <a
                href={sound?.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Open on Freesound"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {(results?.length ?? 0) > 8 && (
        <p className="text-xs text-muted-foreground mt-3">
          Showing 8 of {results?.length ?? 0} results.
          <a
            href={`https://freesound.org/search/?q=${encodeURIComponent(searchTerm ?? '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary ml-1 hover:underline"
          >
            View all on Freesound →
          </a>
        </p>
      )}
    </motion.div>
  );
}
