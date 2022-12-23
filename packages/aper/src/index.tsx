import { Aper as SolidAper, AperProps, Player } from "solid-aper"
import 'solid-aper/dist/style.css'
import { createSignal, Show } from "solid-js"
import { MountableElement, render } from "solid-js/web"

export type Options = {
  container: MountableElement
} & Omit<AperProps, "getPlayerInstance">

class Aper {
  player?: Player
  _destroy = createSignal(false)
  constructor(options: Options) {
    render(
      () => (
        <Show when={!this._destroy[0]()}>
          <SolidAper
            {...options}
            getPlayerInstance={(p) => {
              this.player = p
            }}
          />
        </Show>
      ),
      options.container
    )
  }
  destroy() {
    this._destroy[1](true)
  }
}

export default Aper
