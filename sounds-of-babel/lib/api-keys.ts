import { providers, getProvider, keyStorageKey, keyHeaderName } from '@/lib/providers';

export const API_KEY_SERVICES = providers.filter((p) => p.requiresKey).map((p) => ({
  id: p.id,
  name: p.name,
  getKeyUrl: p.getKeyUrl,
  getKeyLabel: p.getKeyLabel,
}));

export function getApiKey(id: string): string {
  try {
    return localStorage.getItem(keyStorageKey(id))?.trim() ?? '';
  } catch {
    return '';
  }
}

export function setApiKey(id: string, value: string): void {
  try {
    const v = value.trim();
    if (v) localStorage.setItem(keyStorageKey(id), v);
    else localStorage.removeItem(keyStorageKey(id));
  } catch {}
}

export function apiKeyHeaders(id: string): Record<string, string> {
  const key = getProvider(id) ? getApiKey(id) : '';
  return key ? { [keyHeaderName(id)]: key } : {};
}
