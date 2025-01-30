# Obby Creator Music Audio Dump

35k+ metadata dump for every Obby Creator Music upload.

Decicated to the_xj 💘

## Exports

```ts
export interface DumpUser {
    name: string,
    nick: string,
    id: number,
}

export interface DumpStats {
    favorites: number,
    plays: number,
    duration: number,
}

export interface DumpAudio {
    name: string,
    id: number,
    createdAt: string,
    user: DumpUser,
    stats: DumpStats,
}

export = DumpAudio[]
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
