'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Volume2, Music, Globe, Info, UserRound, FileAudio } from 'lucide-react';
import type { SoundLibrary } from '@/lib/libraries';
import {
  regionNative,
  licenseColors,
  licenseSymbols,
  typeColors,
  commercialLabels,
  attributionLabels,
} from '@/lib/libraries';

interface LibraryCardProps {
  library: SoundLibrary;
  searchTerm: string;
  localizedTerm?: string;
  index: number;
}

export function LibraryCard({ library, searchTerm, localizedTerm, index }: LibraryCardProps) {
  const term = localizedTerm || searchTerm;
  const searchable = Boolean(searchTerm) && library.hasDeepLink;
  const url = searchable ? library.searchUrl(term) : library.homepage;

  const TypeIcon = library.type === 'Music' ? Music : library.type === 'SFX' ? Volume2 : Globe;
  const translated = Boolean(searchTerm) && localizedTerm && localizedTerm !== searchTerm;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05 }}
      className="group relative rounded-lg bg-card p-5 transition-all duration-300 hover:bg-secondary/60 flex flex-col"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <TypeIcon className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-card-foreground tracking-tight">
            {library.name}
          </h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground shrink-0 rounded-full bg-muted px-2 py-0.5">
          {regionNative[library.region]}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{library.description}</p>
      <p className="text-xs text-card-foreground mb-3">
        <span className="text-muted-foreground">Best for:</span> {library.bestFor}
      </p>

      <div className="rounded-md bg-background/50 p-3 mb-3 text-xs space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${licenseColors[library.license]}`}>
            <span aria-hidden="true">{licenseSymbols[library.license]}</span>
            {library.licenseName}
          </span>
        </div>
        <p className="text-muted-foreground">{library.licenseSummary}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-card-foreground">
          <span>{commercialLabels[library.commercialUse]}</span>
          <span>{attributionLabels[library.attribution]}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <a
            href={library.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Read the licence
          </a>
          <span className="text-muted-foreground">
            {library.lastVerified ? `Checked ${library.lastVerified}` : 'Licence not yet re-verified'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${typeColors[library.type]}`}>
          {library.type}
        </span>
        {library.formats && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            <FileAudio className="w-3 h-3" aria-hidden="true" />
            {library.formats}
          </span>
        )}
        {library.accountRequired && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            <UserRound className="w-3 h-3" aria-hidden="true" />
            Account required
          </span>
        )}
      </div>

      <div className="mt-auto">
        {searchTerm && !library.hasDeepLink && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
            This site can&apos;t take a search from us, so the link opens its homepage. Type your search there.
          </p>
        )}
        {translated && library.hasDeepLink && (
          <p className="text-xs text-muted-foreground mb-2">
            Searching in {regionNative[library.region]}: <strong className="text-card-foreground">{term}</strong>
          </p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium transition-all hover:bg-primary/20 hover:gap-3"
        >
          {searchable ? <>Search &lsquo;{term}&rsquo; on {library.name}</> : <>Visit {library.name}</>}
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </motion.div>
  );
}
