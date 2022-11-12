<p>
  <img width="100%" src="https://assets.solidjs.com/banner?project=solid-aper" alt="solid-named-router">
</p>

# solid-aper

🎵 A beautiful music player built with [solid.js](https://solidjs.com) and [howler.js](https://howlerjs.com/).

[![release](https://github.com/Xhofe/solid-aper/actions/workflows/release.yml/badge.svg)](https://github.com/Xhofe/solid-aper/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/dm/solid-aper.svg)](https://www.npmjs.com/package/solid-aper)
[![npm](https://img.shields.io/npm/v/solid-aper.svg)](https://www.npmjs.com/package/solid-aper)
[![license](https://img.shields.io/github/license/Xhofe/solid-aper.svg)](https://github.com/Xhofe/solid-aper/blob/main/LICENSE)
[![sponsor](https://img.shields.io/badge/%24-sponsor-F87171.svg)](https://sp.nn.ci/)

## Installation

```bash
pnpm add solid-aper
```

## Demo

<https://xhofe.github.io/solid-aper/>

## Usage

```tsx
import { Component } from "solid-aper";

const App = () => {
  const [shown, setShown] = createSignal(true);
  return (
    <div>
      <Component />
    </div>
  );
};
export default App;
```
