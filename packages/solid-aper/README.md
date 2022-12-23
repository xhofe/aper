<p>
  <img width="100%" src="https://assets.solidjs.com/banner?project=solid-aper" alt="solid-aper">
</p>

# solid-aper

🎵 A simple music player built with [solid.js](https://solidjs.com) and [howler.js](https://howlerjs.com/).

[![release](https://github.com/Xhofe/aper/actions/workflows/release.yml/badge.svg)](https://github.com/Xhofe/solid-aper/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/dm/solid-aper.svg)](https://www.npmjs.com/package/solid-aper)
[![npm](https://img.shields.io/npm/v/solid-aper.svg)](https://www.npmjs.com/package/solid-aper)
[![license](https://img.shields.io/github/license/Xhofe/aper.svg)](https://github.com/Xhofe/aper/blob/main/LICENSE)
[![sponsor](https://img.shields.io/badge/%24-sponsor-F87171.svg)](https://sp.nn.ci/)

## Installation

```bash
pnpm add solid-aper
```

## Demo

<https://xhofe.github.io/aper/>

## Usage

```ts
import type { Component } from "solid-js"
import { Aper } from "solid-aper"
import "solid-aper/dist/style.css"

const App: Component = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        padding: "20px",
        "box-sizing": "border-box",
      }}
    >
      <Aper
        debug
        rememberVolume
        mainColor="#ADDDA9"
        defaultCover="https://jsd.nn.ci/gh/Xhofe/Xhofe/avatar/avatar.svg"
        audios={[
          {
            name: "name",
            url: "https://demo/name.flac",
            artist: "artist",
            lrc: "https://demo/name.lrc",
          },
          ...
        ]}
      />
    </div>
  )
}

export default App
```
