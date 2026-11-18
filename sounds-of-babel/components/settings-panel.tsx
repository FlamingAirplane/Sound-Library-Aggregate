'use client';

import { useEffect, useState } from 'react';
import { Settings, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { API_KEY_SERVICES, getApiKey, setApiKey } from '@/lib/api-keys';

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    const v: Record<string, string> = {};
    for (const s of API_KEY_SERVICES) v[s.id] = getApiKey(s.id);
    setValues(v);
    setSaved(false);
  }, [open]);

  const save = () => {
    for (const s of API_KEY_SERVICES) setApiKey(s.id, values[s.id] ?? '');
    setSaved(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" aria-hidden="true" />
          Settings
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API keys</DialogTitle>
          <DialogDescription>
            Enter your own keys to get live results from Freesound and Pixabay (Openverse needs no key). Keys are stored only in this browser&apos;s localStorage and are only sent to the service you search (directly from your browser on the static site, via this site&apos;s server otherwise).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          {API_KEY_SERVICES.map((s) => (
            <div key={s.id}>
              <label htmlFor={`key-${s.id}`} className="block text-sm font-medium mb-1.5">
                {s.name} API key
              </label>
              <div className="relative">
                <input
                  id={`key-${s.id}`}
                  type={shown[s.id] ? 'text' : 'password'}
                  value={values[s.id] ?? ''}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [s.id]: e.target.value }));
                    setSaved(false);
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-md bg-secondary text-secondary-foreground text-sm px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShown((p) => ({ ...p, [s.id]: !p[s.id] }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={shown[s.id] ? `Hide ${s.name} key` : `Show ${s.name} key`}
                >
                  {shown[s.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <a
                href={s.getKeyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5"
              >
                {s.getKeyLabel}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-muted-foreground" role="status">Saved</span>}
          <button
            type="button"
            onClick={save}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
