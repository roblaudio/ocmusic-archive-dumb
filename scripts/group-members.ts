// shit code but who cares it worked first try

const GROUP_ID = 14517832;

interface User {
  hasVerifiedBadge: boolean;
  userId: number;
  username: string;
  displayName: string;
}

interface Role {
  id: number;
  name: string;
  rank: number;
}

interface UserWithRole {
  user: User;
  role: Role;
}

interface GroupMemberResponse {
  previousPageCursor?: string;
  nextPageCursor?: string;
  data: UserWithRole[];
}

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const users: UserWithRole[] = [];
let batch = 1;

async function fetchGroupMembers(
  nextCursor?: string,
): Promise<GroupMemberResponse> {
  console.log(`fetching batch ${batch}`);
  const response = await fetch(
    `https://groups.roblox.com/v1/groups/${GROUP_ID}/users?sortOrder=Asc&limit=100${nextCursor ? `&cursor=${nextCursor}` : ""}`,
  );

  const groupMembers = (await response.json()) as GroupMemberResponse;
  console.log(groupMembers);

  for (const user of groupMembers.data) {
    users.push(user);
  }

  return groupMembers;
}

const firstResponse = await fetchGroupMembers();
let cursor: string | undefined = firstResponse.nextPageCursor;
while (cursor) {
  batch++;
  const response = await fetchGroupMembers(cursor).catch(console.error);
  if (!response) throw "we fucked up";
  cursor = response.nextPageCursor;
  sleep(3000);
}

console.log("writing");
await Deno.writeTextFile("./users", JSON.stringify(users));
console.log("DONE!!");
