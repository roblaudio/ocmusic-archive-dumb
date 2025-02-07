# Obby Creator Music Archive Dump

35k+ uploads, donations, and group dump for Obby Creator Music.

The dump draws from three sources:

* The [OCMusic/api-archive](https://github.com/OCMusic/api-archive/) repository, dumped to [`ocmusic-api-dump`](./ocmusic-api-dump)
* A scraper to download all group uploads and metadata, dumped to [`raw/ocmusic-uploads`](./raw/ocmusic-uploads)
* [A script to fetch all group members](./scripts/group-members.ts), dumped to [`raw/ocmusic-group-members`](./raw/ocmusic-group-members)

From there, [another script](./scripts/process.ts) picks what we needed the
most from all three sources to form one source of truth, dumped to
[`v2.json`](./processed/v2.json) for the current Obby Creator Music Audio
Browser and [`v3.json`](./processed/v3.json) for the upcoming Version 3 of the
Obby Creator Music Browser along with Roblaudio.

The processed dump files can then be fetched from games like the Obby Creator
Music browser. A dedicated package is planned.

## License

Licensed under BSD 3-Clause License + Old Obby Creator Music Content Disclaimer.

See [LICENSE.md](./LICENSE.md) to review the legal text.

Summary, but not a replacement for the legal text:

* You can use, modify, and share this software, but keep all copyright notices and disclaimer.
* Don’t use my name or contributors' names to promote your version without permission.
* This software is provided "as is" with no guarantees, Roblaudio is not liable for any issues or damages.
* Audio assets from Obby Creator Music is user uploaded and e make no representations or warranties regarding the copyright compliance of these files, but Roblaudio is willing to comply with copyright regulations.

<br/>

<div align="center">
    <img
        src="https://9b16f79ca967fd0708d1-2713572fef44aa49ec323e813b06d2d9.ssl.cf2.rackcdn.com/1140x_a10-7_cTC/Luigi-Mangione-1-1733780641.jpg"
        width="256px"
        alt="Luigi Mangione"
    />
    <h2>Il mio eroe 💗</h2>
</div>
