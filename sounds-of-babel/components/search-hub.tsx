'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Volume2, Music, Globe, Filter } from 'lucide-react';
import { WaveformHero } from '@/components/waveform-hero';
import { LibraryCard } from '@/components/library-card';
import { FreesoundResults } from '@/components/freesound-results';
import { PixabayResults } from '@/components/pixabay-results';
import { libraries, type SoundLibrary, type LibraryRegion, type LibraryLicense, type LibraryType } from '@/lib/libraries';

type TypeFilter = LibraryType | 'All';
type RegionFilter = LibraryRegion | 'All';
type LicenseFilter = LibraryLicense | 'All';

export function SearchHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('All');
  const [licenseFilter, setLicenseFilter] = useState<LicenseFilter>('All');

  const handleSearch = useCallback(() => {
    setSubmittedTerm(searchTerm?.trim() ?? '');
  }, [searchTerm]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSubmittedTerm('');
  }, []);

  const filteredLibraries = (libraries ?? []).filter((lib: SoundLibrary) => {
    if (typeFilter !== 'All') {
      const t = typeFilter as string;
      const lt = (lib?.type ?? '') as string;
      if (t === 'SFX' && lt !== 'SFX' && lt !== 'Both') return false;
      if (t === 'Music' && lt !== 'Music' && lt !== 'Both') return false;
    }
    if (regionFilter !== 'All' && lib?.region !== regionFilter) return false;
    if (licenseFilter !== 'All' && lib?.license !== licenseFilter) return false;
    return true;
  });

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    }`;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <WaveformHero />
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mt-6 mb-4">
              Sounds of <span className="text-primary">Babel</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-10">
              Search the world&apos;s free sound libraries in one place
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e?.target?.value ?? '')}
                onKeyDown={handleKeyDown}
                placeholder="Search for sounds… e.g. thunder, piano, footsteps"
                className="w-full pl-12 pr-24 py-4 rounded-xl bg-card text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                style={{ boxShadow: 'var(--shadow-lg)' }}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-20 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="absolute right-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex flex-wrap justify-center gap-6"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(['All', 'SFX', 'Music'] as TypeFilter[]).map((t: TypeFilter) => (
                  <button key={t} onClick={() => setTypeFilter(t)} className={chipClass(typeFilter === t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(['All', 'EN', 'FR', 'JP'] as RegionFilter[]).map((r: RegionFilter) => (
                  <button key={r} onClick={() => setRegionFilter(r)} className={chipClass(regionFilter === r)}>
                    {r === 'All' ? 'All' : r === 'EN' ? '🇬🇧 EN' : r === 'FR' ? '🇫🇷 FR' : '🇯🇵 JP'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(['All', 'CC0', 'Attribution', 'Mixed'] as LicenseFilter[]).map((l: LicenseFilter) => (
                  <button key={l} onClick={() => setLicenseFilter(l)} className={chipClass(licenseFilter === l)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {submittedTerm && (
            <motion.div
              key="api-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {(regionFilter === 'All' || regionFilter === 'EN') && (
                <>
                  <FreesoundResults searchTerm={submittedTerm} />
                  <PixabayResults searchTerm={submittedTerm} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Library cards */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold tracking-tight mb-1">
            {submittedTerm ? 'Search Libraries' : 'Browse All Libraries'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {submittedTerm
              ? `Click any card to search for "${submittedTerm}" on that library\'s site.`
              : `${filteredLibraries?.length ?? 0} free sound libraries from around the world.`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(filteredLibraries ?? []).map((lib: SoundLibrary, i: number) => (
            <LibraryCard
              key={lib?.id ?? i}
              library={lib}
              searchTerm={submittedTerm}
              index={i}
            />
          ))}
        </div>

        {(filteredLibraries?.length ?? 0) === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No libraries match the current filters.</p>
          </motion.div>
        )}
      </section>

      {/* License reminder */}
      <footer className="border-t border-border bg-card/50 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            ⚠️ Always check the licence terms on each library&apos;s site before use in commercial or professional projects.
          </p>
          <a
            href="/about"
            className="text-xs text-primary hover:underline shrink-0"
          >
            About Sounds of Babel
          </a>
        </div>
      </footer>
    </div>
  );
}
