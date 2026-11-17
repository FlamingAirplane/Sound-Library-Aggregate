'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Volume2, Music, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import { libraries, regionNative, licenseColors, typeColors, type SoundLibrary } from '@/lib/libraries';

export function AboutContent() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            About <span className="text-primary">Sounds of Babel</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            A free search hub that aggregates the world&apos;s best sound effect and music libraries.
            Find the perfect sound across multiple platforms without visiting each one individually.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            How it works
          </h2>
          <div className="rounded-lg bg-card p-6 space-y-3" style={{ boxShadow: 'var(--shadow-md)' }}>
            <p className="text-sm text-card-foreground">
              Type a search term and Sounds of Babel will:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Query APIs with live results from <strong className="text-card-foreground">Freesound</strong> and <strong className="text-card-foreground">Pixabay</strong> (with audio previews)</li>
              <li>Generate deep-search links for all other libraries so you can search them in one click</li>
              <li><strong className="text-card-foreground">Translate</strong> your search into French and Japanese so it reaches libraries in their own language</li>
              <li>Let you filter by <strong className="text-card-foreground">type</strong>, <strong className="text-card-foreground">site language</strong> and <strong className="text-card-foreground">licence</strong></li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-semibold tracking-tight mb-4">Who runs this and how libraries are chosen</h2>
          <div className="rounded-lg bg-card p-6 space-y-3 text-sm text-muted-foreground" style={{ boxShadow: 'var(--shadow-md)' }}>
            <p>Sounds of Babel is an independent project. Libraries are included when they offer sounds that are free to download, are reachable from a plain search link, and publish their licence terms.</p>
            <p>Licence labels are a summary, not legal advice. Each card links to the library&apos;s own licence page, which is the source of truth. A card without a &ldquo;Checked&rdquo; date has not yet been re-verified.</p>
            <p>Know a library that belongs here? Tell the site owner so it can be reviewed and added.</p>
          </div>
        </motion.section>

        {/* API keys */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            API Keys
          </h2>
          <div className="rounded-lg bg-card p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <p className="text-sm text-muted-foreground mb-3">
              Live search results from Freesound and Pixabay require free API keys:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                <strong className="text-card-foreground">Freesound:</strong>{' '}
                <a href="https://freesound.org/apiv2/apply/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Get a free API key →
                </a>
              </li>
              <li>
                <strong className="text-card-foreground">Pixabay:</strong>{' '}
                <a href="https://pixabay.com/api/docs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Get a free API key →
                </a>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Deep-link search cards work without any API keys.
            </p>
          </div>
        </motion.section>

        {/* All libraries */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display text-xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Included Libraries ({libraries?.length ?? 0})
          </h2>
          <div className="space-y-3">
            {(libraries ?? []).map((lib: SoundLibrary, i: number) => (
              <motion.div
                key={lib?.id ?? i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.03 }}
                className="rounded-lg bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{regionNative[lib.region]}</span>
                    <h3 className="font-medium text-card-foreground">{lib?.name ?? 'Unknown'}</h3>
                    {lib?.hasApi && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary">
                        LIVE API
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{lib?.description ?? ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${licenseColors?.[lib?.license] ?? ''}`}>
                    {lib.licenseName}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColors?.[lib?.type] ?? ''}`}>
                    {lib?.type ?? ''}
                  </span>
                  <a
                    href={lib?.homepage ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Visit ${lib?.name ?? 'library'}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            ⚠️ Always check the licence terms on each library&apos;s site before use in commercial or professional projects.
          </p>
        </div>
      </footer>
    </div>
  );
}
