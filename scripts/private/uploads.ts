export interface User {
  name: string;
  nick: string;
  id: number;
}

export interface Stats {
  favorites: number;
  plays: number;
  duration: number;
}

export interface Audio {
  name: string;
  id: number;
  createdAt: string;
  user: User;
  stats: Stats;
}

const UPLOADS_PATH = `${Deno.cwd()}/raw/ocmusic-uploads.json`;

let cachedUploads: undefined | Audio[];

export async function parseUploads(): Promise<Audio[]> {
  if (cachedUploads) return cachedUploads;
  const uploads = JSON.parse(await Deno.readTextFile(UPLOADS_PATH)) as Audio[];
  cachedUploads = uploads;
  return uploads;
}
