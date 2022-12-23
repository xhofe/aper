# aper

🎵 A simple music player built with [solid.js](https://solidjs.com) and [howler.js](https://howlerjs.com/).

[![release](https://github.com/Xhofe/aper/actions/workflows/release.yml/badge.svg)](https://github.com/Xhofe/solid-aper/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/dm/aper.svg)](https://www.npmjs.com/package/aper)
[![npm](https://img.shields.io/npm/v/aper.svg)](https://www.npmjs.com/package/aper)
[![license](https://img.shields.io/github/license/Xhofe/aper.svg)](https://github.com/Xhofe/solid-aper/blob/main/LICENSE)
[![sponsor](https://img.shields.io/badge/%24-sponsor-F87171.svg)](https://sp.nn.ci/)

## Installation

```bash
pnpm add aper
```

## Demo

<https://xhofe.github.io/aper/>

## Usage

```ts
import Aper from "aper"
import 'aper/dist/style.css'

const ap = new Aper({
  container: document.getElementById("root") as HTMLElement,
  audios: [
    {
      name: "name",
      url: "https://demo/name.flac",
      artist: "artist",
      lrc: "https://demo/name.lrc",
    },
    ...
  ],
})
```
