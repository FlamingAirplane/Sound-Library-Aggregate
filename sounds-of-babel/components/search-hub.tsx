'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Languages, ExternalLink, Star, AlertTriangle, Loader2 } from 'lucide-react';
import { WaveformHero } from '@/components/waveform-hero';
import { LibraryCard } from '@/components/library-card';
import { FreesoundResults } from '@/components/freesound-results';
import { PixabayResults } from '@/components/pixabay-results';
import { libraries, regionNative, type SoundLibrary, type LibraryRegion, type LibraryLicense, type LibraryType } from '@/lib/libraries';
import { termForRegion, type Translations } from '@/lib/translate';

type TypeFilter = LibraryType | 'All';
type RegionFilter = LibraryRegion | 'All';
type LicenseFilter = LibraryLicense | 'All';
type SortKey = 'default' | 'name' | 'permissive';

const FAVORITES_KEY = 'sob-favorites';

const permissiveRank = (lib: SoundLibrary): number => {
  const c = lib.commercialUse === 'yes' ? 0 : lib.commercialUse === 'varies' ? 1 : 2;
  const a = lib.attribution === 'not-required' ? 0 : lib.attribution === 'varies' ? 1 : 2;
  return c * 3 + a;
};


export function SearchHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [translating, setTranslating] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('All');
  const [licenseFilter, setLicenseFilter] = useState<LicenseFilter>('All');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleSearch = useCallback(async () => {
    const term = searchTerm.trim();
    setSubmittedTerm(term);
    setTranslations(null);
    if (!term) return;
    setTranslating(true);
    try {
      const res = await fetch(`/api/translate?q=${encodeURIComponent(term)}`);
      if (res.ok) setTranslations((await res.json()) as Translations);
    } catch {
    } finally {
      setTranslating(false);
    }
  }, [searchTerm]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  }, [handleSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSubmittedTerm('');
    setTranslations(null);
  }, []);

  const resetFilters = useCallback(() => {
    setTypeFilter('All');
    setRegionFilter('All');
    setLicenseFilter('All');
    setOnlyFavorites(false);
  }, []);

  const filteredLibraries = useMemo(() => {
    const list = libraries.filter((lib: SoundLibrary) => {
      if (typeFilter === 'SFX' && lib.type === 'Music') return false;
      if (typeFilter === 'Music' && lib.type === 'SFX') return false;
      if (regionFilter !== 'All' && lib.region !== regionFilter) return false;
      if (licenseFilter !== 'All' && lib.license !== licenseFilter) return false;
      if (onlyFavorites && !favorites.includes(lib.id)) return false;
      return true;
    });
    if (sortKey === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === 'permissive') return [...list].sort((a, b) => permissiveRank(a) - permissiveRank(b));
    return list;
  }, [typeFilter, regionFilter, licenseFilter, onlyFavorites, favorites, sortKey]);

  const activeFilterCount =
    (typeFilter !== 'All' ? 1 : 0) +
    (regionFilter !== 'All' ? 1 : 0) +
    (licenseFilter !== 'All' ? 1 : 0) +
    (onlyFavorites ? 1 : 0);

  const openAll = useCallback(() => {
    const targets = filteredLibraries.filter((l) => l.hasDeepLink);
    for (const lib of targets) {
      window.open(lib.searchUrl(termForRegion(translations, lib.region, submittedTerm)), '_blank', 'noopener,noreferrer');
    }
  }, [filteredLibraries, translations, submittedTerm]);

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    }`;

  const filterGroup = <T extends string>(
    label: string,
    options: { value: T; label: string }[],
    value: T,
    onChange: (v: T) => void,
  ) => (
    <fieldset className="flex flex-col items-center gap-1.5">
      <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</legend>
      <div className="flex flex-wrap justify-center gap-1" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={chipClass(value === o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );

  const apiLibrariesVisible = regionFilter === 'All' || regionFilter === 'EN';
  const showTranslationPanel = Boolean(submittedTerm) && (translating || translations);

  return (
    <div className="min-h-screen">
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
            <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-3">
              Search the world&apos;s free sound libraries in one place, in their own languages
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-10">
              Type a sound once. We translate it for French and Japanese libraries, show live previews from Freesound and Pixabay, and open the rest as ready-made searches.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search for sounds"
                placeholder="Search for sounds... e.g. thunderstorm, piano, footsteps"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-5"
          >
            {filterGroup<TypeFilter>('Sound type', [
              { value: 'All', label: 'All' },
              { value: 'SFX', label: 'Sound effects' },
              { value: 'Music', label: 'Music' },
            ], typeFilter, setTypeFilter)}
            {filterGroup<RegionFilter>('Site language', [
              { value: 'All', label: 'All' },
              { value: 'EN', label: regionNative.EN },
              { value: 'FR', label: regionNative.FR },
              { value: 'JP', label: regionNative.JP },
            ], regionFilter, setRegionFilter)}
            {filterGroup<LicenseFilter>('Licence', [
              { value: 'All', label: 'All' },
              { value: 'CC0', label: 'CC0' },
              { value: 'Attribution', label: 'Credit required' },
              { value: 'Mixed', label: 'Per sound' },
              { value: 'Custom', label: 'Site terms' },
            ], licenseFilter, setLicenseFilter)}
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        {submittedTerm && (
          <div
            role="note"
            className="mb-6 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <p>
              Licences differ by library and often by sound. Check the licence on each result before using it commercially.
            </p>
          </div>
        )}

        {showTranslationPanel && (
          <div className="mb-8 rounded-lg bg-card p-4" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-card-foreground">
              <Languages className="w-4 h-4 text-primary" aria-hidden="true" />
              Searching across languages
              {translating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" aria-label="Translating" />}
            </div>
            {translations && (
              <>
                <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div className="flex gap-2"><dt className="text-muted-foreground">{regionNative.EN}</dt><dd className="font-medium text-card-foreground">{translations.en}</dd></div>
                  <div className="flex gap-2"><dt className="text-muted-foreground">{regionNative.FR}</dt><dd className="font-medium text-card-foreground">{translations.fr}</dd></div>
                  <div className="flex gap-2"><dt className="text-muted-foreground">{regionNative.JP}</dt><dd className="font-medium text-card-foreground" lang="ja">{translations.ja}</dd></div>
                </dl>
                <p className="text-xs text-muted-foreground mt-2">
                  {translations.source === 'none'
                    ? 'Translation was unavailable, so every library is searched with your original words.'
                    : translations.source === 'online'
                      ? 'Machine translation. Results on French and Japanese sites may be off if a word has several meanings.'
                      : 'Translated with our built-in sound dictionary.'}
                </p>
              </>
            )}
          </div>
        )}

        {submittedTerm && apiLibrariesVisible && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Live results with in-page previews come from Freesound and Pixabay. Everything else opens on the library&apos;s own site.
            </p>
            <FreesoundResults searchTerm={translations?.en || submittedTerm} />
            <PixabayResults searchTerm={translations?.en || submittedTerm} />
          </>
        )}

        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold tracking-tight mb-1">
            {submittedTerm ? 'Search the other libraries' : 'Browse all libraries'}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {submittedTerm
              ? 'Each card opens that library in a new tab with your search ready, where the site allows it.'
              : 'Pick a library to visit, or search above to get ready-made searches.'}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-card-foreground" aria-live="polite">
              Showing {filteredLibraries.length} of {libraries.length} libraries
              {activeFilterCount > 0 && (
                <span className="text-muted-foreground"> ({activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'} on)</span>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterCount > 0 && (
                <button type="button" onClick={resetFilters} className="text-xs text-primary hover:underline">
                  Reset filters
                </button>
              )}
              <button
                type="button"
                aria-pressed={onlyFavorites}
                onClick={() => setOnlyFavorites((v) => !v)}
                className={chipClass(onlyFavorites)}
              >
                <Star className="w-3 h-3 inline -mt-0.5 mr-1" aria-hidden="true" />
                Shortlist ({favorites.length})
              </button>
              <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                Sort
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="rounded-md bg-secondary text-secondary-foreground text-xs px-2 py-1.5"
                >
                  <option value="default">Default</option>
                  <option value="name">Name</option>
                  <option value="permissive">Most permissive licence</option>
                </select>
              </label>
              {submittedTerm && (
                <button
                  type="button"
                  onClick={openAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
                >
                  Open all in tabs
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          {submittedTerm && (
            <p className="text-xs text-muted-foreground mt-2">
              &ldquo;Open all in tabs&rdquo; opens one tab per library shown that supports searching. Your browser may ask you to allow pop-ups.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLibraries.map((lib: SoundLibrary, i: number) => {
            const saved = favorites.includes(lib.id);
            return (
              <div key={lib.id} className="relative">
                <button
                  type="button"
                  onClick={() => toggleFavorite(lib.id)}
                  aria-pressed={saved}
                  aria-label={`${saved ? 'Remove' : 'Add'} ${lib.name} ${saved ? 'from' : 'to'} shortlist`}
                  className="absolute right-3 z-10 p-1 rounded text-muted-foreground hover:text-amber-400"
                  style={{ top: '3.25rem' }}
                >
                  <Star className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
                <LibraryCard
                  library={lib}
                  searchTerm={submittedTerm}
                  localizedTerm={termForRegion(translations, lib.region, submittedTerm)}
                  index={i}
                />
              </div>
            );
          })}
        </div>

        {filteredLibraries.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-card-foreground font-medium mb-1">No libraries match these filters.</p>
            <p className="text-sm text-muted-foreground mb-4">
              {onlyFavorites && favorites.length === 0
                ? 'Your shortlist is empty. Use the star on a card to add libraries.'
                : 'Try a different licence or language, or clear the filters.'}
            </p>
            <button type="button" onClick={resetFilters} className={chipClass(true)}>
              Reset filters
            </button>
          </motion.div>
        )}
      </section>

      <footer className="border-t border-border bg-card/50 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Always check the licence terms on each library&apos;s site before use in commercial or professional projects.
          </p>
          <a href="/about" className="text-xs text-primary hover:underline shrink-0">
            About Sounds of Babel
          </a>
        </div>
      </footer>
    </div>
  );
}
