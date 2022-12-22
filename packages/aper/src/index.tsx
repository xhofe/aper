import { Aper as SolidAper, Audio, Player } from "solid-aper"
import { MountableElement, render } from "solid-js/web"

export interface Options {
  container: MountableElement
  audios: Audio[]
}

class Aper {
  player?: Player
  constructor(options: Options) {
    render(() => <SolidAper audios={options.audios} />, options.container)
  }
  destroy() {}
}

export default Aper
