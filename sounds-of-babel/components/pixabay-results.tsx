'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ExternalLink, Clock, Music, AlertCircle, Loader2, Download } from 'lucide-react';

interface PixabayResult {
  id: number;
  title: string;
  duration: number;
  tags: string;
  audio_url?: string;
  pageURL: string;
  user: string;
}

interface PixabayResultsProps {
  searchTerm: string;
}

export function PixabayResults({ searchTerm }: PixabayResultsProps) {
  const [results, setResults] = useState<PixabayResult[]>([]);
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
      const res = await fetch(`/api/pixabay?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Failed to fetch from Pixabay');
        setResults([]);
      } else {
        setResults(data?.hits ?? []);
      }
    } catch {
      setError('Network error — could not reach Pixabay API');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const lastSearchRef = useRef('');
  if (searchTerm && searchTerm !== lastSearchRef.current) {
    lastSearchRef.current = searchTerm;
    search(searchTerm);
  }

  const togglePlay = (sound: PixabayResult) => {
    const audioUrl = sound?.audio_url;
    if (!audioUrl) return;

    if (playingId === sound?.id) {
      audioRef.current?.pause?.();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioUrl);
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
        <Music className="w-5 h-5 text-accent" />
        <h3 className="font-display text-lg font-semibold tracking-tight">Pixabay Audio Results</h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 rounded-md p-3 mb-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && searched && (results?.length ?? 0) === 0 && !error && (
        <p className="text-sm text-muted-foreground">No results found on Pixabay.</p>
      )}

      <AnimatePresence>
        <div className="space-y-2">
          {(results ?? []).slice(0, 8).map((sound: PixabayResult, i: number) => (
            <motion.div
              key={sound?.id ?? i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-md bg-secondary/40 hover:bg-secondary/70 transition-colors"
            >
              <button
                onClick={() => togglePlay(sound)}
                className="shrink-0 w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center hover:bg-accent/30 transition-colors"
                aria-label={playingId === sound?.id ? 'Pause' : 'Play'}
                disabled={!sound?.audio_url}
              >
                {playingId === sound?.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{sound?.title ?? 'Untitled'}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sound?.duration ?? 0}s
                  </span>
                  <span className="truncate">
                    by {sound?.user ?? 'Unknown'}
                  </span>
                </div>
              </div>
              <a
                href={sound?.pageURL ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-muted-foreground hover:text-accent transition-colors"
                aria-label="Open on Pixabay"
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
            href={`https://pixabay.com/sound-effects/search/${encodeURIComponent(searchTerm ?? '')}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent ml-1 hover:underline"
          >
            View all on Pixabay →
          </a>
        </p>
      )}
    </motion.div>
  );
}
