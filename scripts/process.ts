import { UserWithRole } from "./group-members.ts";
import { parseConfig } from "./private/config.ts";
import { parseUploads } from "./private/uploads.ts";
import { parseV2, V2 } from "./private/v2.ts";

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

const groupMembers = JSON.parse(
  await Deno.readTextFile(`${Deno.cwd()}/raw/ocmusic-group-members.json`),
) as UserWithRole[];

const {
  audios: { excludeNames, includeNames, excludeIds, includeIds },
} = await parseConfig();
const uploads = await parseUploads();
const v2 = await parseV2();

function cleanName(name: string) {
  return name.toLowerCase().replaceAll(/\W+/g, "");
}

// audio processing

const excludedUploads = uploads.filter(({ name, id }) => {
  if (includeIds.includes(id)) return false;
  if (excludeIds.includes(id)) return true;

  const cleaned = cleanName(name);

  for (const v of includeNames) {
    if (cleaned.includes(v)) {
      return false;
    }
  }

  for (const v of excludeNames) {
    if (cleaned.includes(v)) {
      return true;
    }
  }

  return false;
});

const v3Uploads = uploads.filter((v) => !excludedUploads.includes(v));
const audiosV3ToV2 = new Map(
  v3Uploads.map((v3) => {
    const found = v2.audios.find((v) => v.id === v3.id);
    if (!found) {
      throw `no matching v2 audio for v3 audio "${v3.name} (id: ${v3.id})"`;
    }
    return [v3, found];
  }),
);

const v2Uploads = v3Uploads.map((v) => audiosV3ToV2.get(v)!);

/// group processing

const groupRoles = v2.group.roles.map((v): ProcessedGroupRole => {
  delete (v as { ID?: number }).ID;
  delete (v as { memberCount?: number }).memberCount;
  return v as never;
});

const rankToGroupRole = new Map(
  groupRoles.map((v): [number, ProcessedGroupRole] => [v.rank, v]),
);

const group: ProcessedGroup = {
  members: groupMembers.map((u): ProcessedGroupMember => {
    const role = rankToGroupRole.get(u.role.rank)!;
    if (!role) throw `no role found ${u.role.rank}`;
    return {
      id: u.user.userId,
      username: u.user.username,
      role: role,
    };
  }),
  memberCount: groupMembers.length,
  roles: groupRoles,
};

const donatorToAmount = new Map<number, number>();
for (const t of v2.transactions) {
  donatorToAmount.set(
    t.user.id,
    (donatorToAmount.has(t.user.id) ? donatorToAmount.get(t.user.id)! : 0) +
      t.price,
  );
}

const v3Processed = {
  uploads: v3Uploads,
  group,
  donations: {
    funds: v2.funds,
    donatorToAmount,
  },
};

const v2Processed = {
  group: v2.group,
  auditlog: v2.auditlog,
  transactions: v2.transactions,
  game: v2.game,
  funds: v2.funds,
  audios: v2Uploads,
  // accessed is unused in the browser so it's safe to make it empty
  accessed: {},
} satisfies V2;

await Deno.writeTextFile(
  `${Deno.cwd()}/processed/v2.json`,
  JSON.stringify(v2Processed),
);
await Deno.writeTextFile(
  `${Deno.cwd()}/processed/v3.json`,
  JSON.stringify(v3Processed),
);
