<p>
  <img width="100%" src="https://assets.solidjs.com/banner?project=solid-aper" alt="solid-aper">
</p>

# aper

🎵 A beautiful music player built with [solid.js](https://solidjs.com) and [howler.js](https://howlerjs.com/).

[![release](https://github.com/Xhofe/aper/actions/workflows/release.yml/badge.svg)](https://github.com/Xhofe/solid-aper/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/dm/aper.svg)](https://www.npmjs.com/package/solid-aper)
[![npm](https://img.shields.io/npm/v/aper.svg)](https://www.npmjs.com/package/solid-aper)
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

const ap = new Aper({
  container: document.getElementById("root") as HTMLElement,
  audios: [
    {
      name: "少女",
      url: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E5%B0%91%E5%A5%B3.flac",
      artist: "赵雷",
      lrc: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E5%B0%91%E5%A5%B3.lrc",
    },
    {
      name: "我记得",
      url: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E6%88%91%E8%AE%B0%E5%BE%97.flac",
      artist: "赵雷",
      lrc: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E6%88%91%E8%AE%B0%E5%BE%97.lrc",
    },
  ],
})
```
