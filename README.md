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

```tsx
import Aper from "aper"

const ap = new Aper({
  audios: [],
  container: document.getElementById("root") as HTMLElement,
})
```
