'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Volume2, Music, Globe } from 'lucide-react';
import type { SoundLibrary } from '@/lib/libraries';
import { regionFlags, licenseColors, typeColors } from '@/lib/libraries';

interface LibraryCardProps {
  library: SoundLibrary;
  searchTerm: string;
  index: number;
}

export function LibraryCard({ library, searchTerm, index }: LibraryCardProps) {
  const url = searchTerm
    ? library?.searchUrl?.(searchTerm) ?? library?.homepage ?? '#'
    : library?.homepage ?? '#';

  const typeIcon = library?.type === 'Music' ? Music : library?.type === 'SFX' ? Volume2 : Globe;
  const TypeIcon = typeIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-lg bg-card p-5 transition-all duration-300 hover:bg-secondary/60"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <TypeIcon className="w-5 h-5 text-primary shrink-0" />
          <h3 className="font-display text-lg font-semibold text-card-foreground tracking-tight">
            {library?.name ?? 'Unknown'}
          </h3>
        </div>
        <span className="text-xl shrink-0" aria-label={library?.region ?? ''}>
          {regionFlags?.[library?.region] ?? ''}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {library?.description ?? ''}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${licenseColors?.[library?.license] ?? ''}`}>
          {library?.license ?? 'Unknown'}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors?.[library?.type] ?? ''}`}>
          {library?.type ?? 'Unknown'}
        </span>
        {!library?.hasDeepLink && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            No deep link
          </span>
        )}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium transition-all hover:bg-primary/20 hover:gap-3"
      >
        {searchTerm
          ? <>Search &lsquo;{searchTerm}&rsquo; on {library?.name ?? 'site'}</>
          : <>Visit {library?.name ?? 'site'}</>
        }
        <ExternalLink className="w-4 h-4" />
      </a>
    </motion.div>
  );
}
