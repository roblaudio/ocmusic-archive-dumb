// im lazy

interface User {
  name: string;
  nick: string;
  id: number;
}

interface Stats {
  favorites: number;
  plays: number;
  duration: number;
}

interface Audio {
  name: string;
  id: number;
  createdAt: string;
  user: User;
  stats: Stats;
}

interface Game {
  activeCount: number;
}

interface AuditLog {
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

interface GroupRole {
  ID: number;
  id: number;
  memberCount: number;
  name: string;
  rank: number;
}

interface Group {
  memberCount: number;
  roles: GroupRole[];
}

interface Transaction {
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

interface Data {
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
  /** @deprecated we scraped the audios on another dump file */
  audios: unknown;
  /** @deprecated this was used for the bot to give ocm browser permissions to use the audios */
  accessed: unknown;
}

interface GroupUser {
  hasVerifiedBadge: boolean;
  userId: number;
  username: string;
  displayName: string;
}

interface GroupMemberRole {
  id: number;
  name: string;
  rank: number;
}

interface GroupMember {
  user: GroupUser;
  role: GroupMemberRole;
}

const RAW_OCMUSIC_DATA = await Deno.readTextFile(
  `${Deno.cwd()}/raw/ocmusic-data`,
);
const RAW_OCMUSIC_UPLOADS = await Deno.readTextFile(
  `${Deno.cwd()}/raw/ocmusic-uploads`,
);
const RAW_OCMUSIC_GROUP_MEMBERS = await Deno.readTextFile(
  `${Deno.cwd()}/raw/ocmusic-group-members`,
);

const OCMUSIC_DATA = JSON.parse(RAW_OCMUSIC_DATA) as Data;
const OCMUSIC_UPLOADS = JSON.parse(RAW_OCMUSIC_UPLOADS) as Audio[];
const OCMUSIC_GROUP_MEMBERS = JSON.parse(
  RAW_OCMUSIC_GROUP_MEMBERS,
) as GroupMember[];

interface ProcessedUpload {
  name: string;
  id: number;
  createdAt: string;
  user: number;
}

interface ProcessedDonations {
  funds: number;
  donatorToAmount: Map<number, number>;
}

interface ProcessedGroupRole {
  id: number;
  rank: number;
  name: string;
}

interface ProcessedGroupMember {
  id: number;
  username: string;
  role: ProcessedGroupRole;
}

interface ProcessedGroup {
  members: ProcessedGroupMember[];
  memberCount: number;
  roles: ProcessedGroupRole[];
}

interface Processed {
  uploads: ProcessedUpload[];
  donations: ProcessedDonations;
  group: ProcessedGroup;
}

const groupRoles = OCMUSIC_DATA.group.roles.map((v): ProcessedGroupRole => {
  delete (v as { ID?: number }).ID;
  delete (v as { memberCount?: number }).memberCount;
  return v as never;
});

const rankToGroupRole = new Map(
  groupRoles.map((v): [number, ProcessedGroupRole] => [v.rank, v]),
);

const group: ProcessedGroup = {
  members: OCMUSIC_GROUP_MEMBERS.map((u): ProcessedGroupMember => {
    const role = rankToGroupRole.get(u.role.rank)!;
    if (!role) throw `no role found ${u.role.rank}`;
    return {
      id: u.user.userId,
      username: u.user.username,
      role: role,
    };
  }),
  memberCount: OCMUSIC_GROUP_MEMBERS.length,
  roles: groupRoles,
};

const donatorToAmount = new Map<number, number>();
for (const t of OCMUSIC_DATA.transactions) {
  donatorToAmount.set(
    t.user.id,
    (donatorToAmount.has(t.user.id) ? donatorToAmount.get(t.user.id)! : 0) +
      t.price,
  );
}

const processed: Processed = {
  uploads: OCMUSIC_UPLOADS.map(
    ({ name, user, id, createdAt }): ProcessedUpload => {
      return { name, user: user.id, id, createdAt };
    },
  ),
  group,
  donations: {
    funds: OCMUSIC_DATA.funds,
    donatorToAmount,
  },
};

await Deno.writeTextFile(`${Deno.cwd()}/dump.json`, JSON.stringify(processed));
