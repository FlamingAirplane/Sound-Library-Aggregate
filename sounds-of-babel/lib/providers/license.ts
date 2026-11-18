export interface LicenseInfo {
  license: string;
  commercialUse: boolean | null;
  licenseRank: number;
}

const UNKNOWN: LicenseInfo = { license: 'Unknown licence', commercialUse: null, licenseRank: 9 };

export function licenseFromCode(raw: string | undefined | null): LicenseInfo {
  const code = (raw ?? '').toLowerCase().trim();
  if (!code) return UNKNOWN;
  if (code === 'cc0' || code === 'zero') return { license: 'CC0', commercialUse: true, licenseRank: 0 };
  if (code === 'pdm' || code === 'publicdomain') return { license: 'Public domain', commercialUse: true, licenseRank: 0 };
  if (code.includes('sampling')) return UNKNOWN;
  const m = code.match(/^by((?:-(?:nc|sa|nd))*)$/);
  if (!m) return UNKNOWN;
  const parts = m[1].split('-').filter(Boolean);
  const label = ['CC BY', ...parts.map((p) => p.toUpperCase())].join('-').replace('CC BY-', 'CC BY-');
  const nc = parts.includes('nc');
  const nd = parts.includes('nd');
  const rank = nc ? 5 + (nd ? 1 : 0) : nd ? 3 : parts.includes('sa') ? 2 : 1;
  return { license: label, commercialUse: !nc, licenseRank: rank };
}

export function licenseFromUrl(url: string | undefined | null): LicenseInfo {
  const u = (url ?? '').toLowerCase();
  if (u.includes('/zero/') || u.includes('publicdomain')) return licenseFromCode('cc0');
  const m = u.match(/\/licenses\/([a-z+-]+)\//);
  return m ? licenseFromCode(m[1]) : UNKNOWN;
}
