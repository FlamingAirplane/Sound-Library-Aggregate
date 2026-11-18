import { freesound } from './freesound';
import { pixabay } from './pixabay';
import { openverse } from './openverse';
import type { SoundProvider } from './types';

export const providers: SoundProvider[] = [freesound, pixabay, openverse];

export const getProvider = (id: string): SoundProvider | undefined => providers.find((p) => p.id === id);

export const keyStorageKey = (id: string) => `sob-key-${id}`;
export const keyHeaderName = (id: string) => `x-${id}-key`;
