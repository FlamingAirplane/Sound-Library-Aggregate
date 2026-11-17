import { libraries, type SoundLibrary } from '../lib/libraries';
import { translateQuery, termForRegion } from '../lib/translate';

const HELP = `sob - Sounds of Babel CLI. Finds free sound libraries and builds search links. Output is JSON.

Usage:
  sob search <term> [filters]   Translate <term> and return a search URL per library
  sob list [filters]            List libraries
  sob info <id>                 Full details for one library
  sob translate <term>          Translate a term into EN/FR/JA
  sob help                      Show this help

Filters (search and list):
  --type SFX|Music|Both         SFX also matches Both; Music also matches Both
  --region EN|FR|JP             Site language
  --license CC0|Attribution|Mixed|Custom
  --commercial                  Only libraries that allow commercial use ("yes")
  --no-attribution              Only libraries that do not require credit
  --no-translate                search: use <term> as-is for every library
  --pretty                      Indented JSON

Notes for agents:
  Licence fields are summaries, not legal advice. Always check licenceUrl.
  A library with hasDeepLink=false returns its homepage as url, not a search.
  Exit code 0 on success, 1 on usage error. Errors print JSON {"error": "..."} to stderr.
`;

const FLAGS_WITH_VALUE = new Set(['type', 'region', 'license']);

function parse(argv: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      if (FLAGS_WITH_VALUE.has(key)) {
        const v = argv[++i];
        if (!v) fail(`--${key} needs a value`);
        flags[key] = v;
      } else {
        flags[key] = true;
      }
    } else positional.push(a);
  }
  return { positional, flags };
}

function fail(message: string): never {
  console.error(JSON.stringify({ error: message }));
  process.exit(1);
}

function out(data: unknown, pretty: boolean) {
  console.log(JSON.stringify(data, null, pretty ? 2 : 0));
}

function filter(flags: Record<string, string | boolean>): SoundLibrary[] {
  const type = flags.type as string | undefined;
  const region = (flags.region as string | undefined)?.toUpperCase();
  const license = flags.license as string | undefined;
  if (type && !['SFX', 'Music', 'Both'].includes(type)) fail('--type must be SFX, Music or Both');
  if (region && !['EN', 'FR', 'JP'].includes(region)) fail('--region must be EN, FR or JP');
  if (license && !['CC0', 'Attribution', 'Mixed', 'Custom'].includes(license)) fail('--license must be CC0, Attribution, Mixed or Custom');
  return libraries.filter((l) => {
    if (type === 'SFX' && l.type === 'Music') return false;
    if (type === 'Music' && l.type === 'SFX') return false;
    if (type === 'Both' && l.type !== 'Both') return false;
    if (region && l.region !== region) return false;
    if (license && l.license !== license) return false;
    if (flags.commercial && l.commercialUse !== 'yes') return false;
    if (flags['no-attribution'] && l.attribution !== 'not-required') return false;
    return true;
  });
}

function summary(l: SoundLibrary) {
  return {
    id: l.id,
    name: l.name,
    region: l.region,
    type: l.type,
    license: l.license,
    licenseName: l.licenseName,
    commercialUse: l.commercialUse,
    attribution: l.attribution,
    hasDeepLink: l.hasDeepLink,
    homepage: l.homepage,
  };
}

function detail(l: SoundLibrary) {
  const { searchUrl: _s, ...rest } = l;
  return rest;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const { positional, flags } = parse(rest);
  const pretty = Boolean(flags.pretty);

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    console.log(HELP);
    return;
  }

  if (cmd === 'list') {
    const list = filter(flags);
    out({ count: list.length, libraries: list.map(summary) }, pretty);
  } else if (cmd === 'info') {
    const id = positional[0];
    if (!id) fail('usage: sob info <id>');
    const lib = libraries.find((l) => l.id === id.toLowerCase());
    if (!lib) fail(`unknown library "${id}". Run "sob list" for ids.`);
    out(detail(lib), pretty);
  } else if (cmd === 'translate') {
    const term = positional.join(' ').trim();
    if (!term) fail('usage: sob translate <term>');
    out(await translateQuery(term), pretty);
  } else if (cmd === 'search') {
    const term = positional.join(' ').trim();
    if (!term) fail('usage: sob search <term>');
    const list = filter(flags);
    const t = flags['no-translate'] ? null : await translateQuery(term);
    const results = list.map((l) => {
      const q = termForRegion(t, l.region, term);
      return {
        ...summary(l),
        searchTerm: q,
        url: l.hasDeepLink ? l.searchUrl(q) : l.homepage,
        licenseUrl: l.licenseUrl,
        licenseSummary: l.licenseSummary,
      };
    });
    out(
      {
        query: term,
        translations: t ? { en: t.en, fr: t.fr, ja: t.ja, source: t.source } : null,
        count: results.length,
        results,
        warning: 'Licence info is a summary, not legal advice. Check licenseUrl before using any sound commercially.',
      },
      pretty,
    );
  } else {
    fail(`unknown command "${cmd}". Run "sob help".`);
  }
}

main().catch((e) => fail(e?.message ?? String(e)));
