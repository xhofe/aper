import { Aper as SolidAper, Audio } from "solid-aper"
import { MountableElement, render } from "solid-js/web"

export interface Options {
  container: MountableElement
  audios: Audio[]
}

class Aper {
  constructor(options: Options) {
    render(() => <SolidAper audios={options.audios} />, options.container)
  }
  destroy() {}
}

export default Aper
