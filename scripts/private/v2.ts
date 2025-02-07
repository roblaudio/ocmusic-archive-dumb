export interface Game {
  activeCount: number;
}

export interface AuditLog {
  asset: {
    id: string;
    name: string;
    when: string;
  };
  user: {
    displayname: string;
    id: number;
    name: string;
    role: string;
    verified: boolean;
  };
}

export interface GroupRole {
  ID: number;
  id: number;
  memberCount: number;
  name: string;
  rank: number;
}

export interface Group {
  memberCount: number;
  roles: GroupRole[];
}

export interface Transaction {
  asset: {
    id: number;
    name: string;
  };
  id: number;
  price: number;
  user: {
    displayname: string;
    id: number;
  };
}

export interface Audio {
  name: string;
  id: number;
}

export interface V2 {
  /// The Obby Creator Music group
  group: Group;
  /// Logs
  auditlog: AuditLog[];
  /// Donation transactions
  transactions: Transaction[];
  /// Game information
  game: Game;
  /// Total donation funds collected
  funds: number;
  /// Audios
  audios: Audio[];
  /** @deprecated this was used for the bot to give ocm browser permissions to use the audios */
  accessed: unknown;
}

const V2_API_DUMP_PATH = `${Deno.cwd()}/ocmusic-api-dump/data-archive.txt`;

let cachedV2: undefined | V2;

export async function parseV2(): Promise<V2> {
  if (cachedV2) return cachedV2;
  const v2Dump = JSON.parse(await Deno.readTextFile(V2_API_DUMP_PATH)) as V2;
  cachedV2 = v2Dump;
  return v2Dump;
}
