const GROUP_ID = 14517832;

export interface User {
  hasVerifiedBadge: boolean;
  userId: number;
  username: string;
  displayName: string;
}

export interface Role {
  id: number;
  name: string;
  rank: number;
}

export interface UserWithRole {
  user: User;
  role: Role;
}

export interface GroupMemberResponse {
  previousPageCursor?: string;
  nextPageCursor?: string;
  data: UserWithRole[];
}

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function fetchGroupMembers(
  batch: number,
  nextCursor?: string,
): Promise<GroupMemberResponse> {
  console.log(`fetching batch ${batch}`);

  const response = await fetch(
    `https://groups.roblox.com/v1/groups/${GROUP_ID}/users?sortOrder=Asc&limit=100${nextCursor ? `&cursor=${nextCursor}` : ""}`,
  );

  const groupMembers = (await response.json()) as GroupMemberResponse;

  return groupMembers;
}

let cached: undefined | UserWithRole[];
export async function groupMembers(): Promise<UserWithRole[]> {
  if (cached) return cached;

  const users: UserWithRole[] = [];
  let batch = 1;

  const firstResponse = await fetchGroupMembers(batch);
  for (const u of firstResponse.data) users.push(u);
  let cursor: string | undefined = firstResponse.nextPageCursor;
  while (cursor) {
    batch++;
    const response = await fetchGroupMembers(batch, cursor).catch((e) =>
      console.error(`failed to fetch group members: ${e}`),
    );
    if (!response) throw `failed to fetch group members at batch #${batch}`;
    cursor = response.nextPageCursor;
    sleep(3000);
  }

  cached = users;
  return users;
}

if (import.meta.main) {
  console.log("now fetching group members");
  await Deno.writeTextFile(
    `${Deno.cwd()}/raw/ocmusic-group-members.json`,
    JSON.stringify(await groupMembers()),
  );
  console.log("all done");
}
