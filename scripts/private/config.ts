import { parse } from "@std/toml";

interface RawConfig {
  audios: {
    exclude_names: string[];
    include_names: string[];
    exclude_ids: number[];
    include_ids: number[];
  };
}

export interface Config {
  audios: {
    excludeNames: string[];
    includeNames: string[];
    excludeIds: number[];
    includeIds: number[];
  };
}

const CONFIG_PATH = `${Deno.cwd()}/dump.toml`;

let cachedConfig: undefined | Config;

export async function parseConfig(): Promise<Config> {
  if (cachedConfig) return cachedConfig;

  const {
    audios: { exclude_names, include_names, exclude_ids, include_ids },
  } = parse(await Deno.readTextFile(CONFIG_PATH)) as unknown as RawConfig;

  const config = {
    audios: {
      excludeNames: exclude_names,
      includeNames: include_names,
      excludeIds: exclude_ids,
      includeIds: include_ids,
    },
  } satisfies Config;

  cachedConfig = config;
  return config;
}
