# Obby Creator Music Audio Dump

35k+ uploads, donations, and group dump for Obby Creator Music.

The dump draws from three sources:

* The [OCMusic/api-archive](https://github.com/OCMusic/api-archive/) repository, dumped to [`raw/ocmusic-data`](./raw/ocmusic-data)
* A scraper to download all group uploads and metadata, dumped to [`raw/ocmusic-uploads`](./raw/ocmusic-uploads)
* [A script to fetch all group members](./scripts/group-members.ts), dumped to [`raw/ocmusic-group-members`](./raw/ocmusic-group-members)

From there, [another script](./scripts/process-raw.ts) picks what we needed the
most from all three sources to form one source of truth, dumped to
[`dump.json`](./dump.json). This can then be fetched from games like the Obby
Creator Music browser.

> [!WARNING]
> The code is bad. It was written in less than an hour.

Decicated to the_xj 💘

## Exports

```ts
// uploads
export interface DumpUpload {
  name: string;
  id: number;
  createdAt: string;
  user: number;
}

// donations
export interface DumpDonations {
  funds: number;
  donatorToAmount: Map<number, number>;
}

// groups
export interface DumpGroupRole {
  id: number;
  rank: number;
  name: string;
}

export interface DumpGroupMember {
  id: number;
  username: string;
  role: DumpGroupRole;
}

export interface DumpGroup {
  members: DumpGroupMember[];
  memberCount: number;
  roles: DumpGroupRole[];
}

// dump
export interface Dump {
  uploads: DumpUpload[];
  donations: DumpDonations;
  group: DumpGroup;
}
```

## License

Licensed under the [Do What The F\*ck You Want To Public License](./LICENSE.md).

<br/>

<div align="center">
    <img
        src="https://9b16f79ca967fd0708d1-2713572fef44aa49ec323e813b06d2d9.ssl.cf2.rackcdn.com/1140x_a10-7_cTC/Luigi-Mangione-1-1733780641.jpg"
        width="256px"
        alt="Luigi Mangione"
    />
    <h2>Il mio eroe 💗</h2>
</div>
