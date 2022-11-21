import "./style.scss"
import clsx from "clsx"
import { Audio } from "../types"
import { List } from "./List"
import { createEffect, createSignal } from "solid-js"
import { Lyric } from "./Lyric"
import { Player } from "../core/player"

export interface AperProps {
  audios: Audio[]
  defaultPlayIndex?: number
  defaultCover?: string
  loop?: "all" | "one" | "none"
  order?: "list" | "random"
  autoplay?: boolean
  defaultVolume?: number
  class?: string
  mainColor?: string
  onPlayIndexChange?: (index: number) => void
  debug?: boolean
}

export const Aper = (props: AperProps) => {
  const player = new Player({
    audios: props.audios,
    debug: props.debug,
  })
  const [playIndex, setPlayIndex] = createSignal(props.defaultPlayIndex ?? 0)
  const onPlayIndexChange = (index: number) => {
    setPlayIndex(index)
    player.skipTo(index)
    props.onPlayIndexChange?.(index)
  }
  const [seek, setSeek] = createSignal(0)
  player.onStep((e) => {
    setSeek(e.seek)
  })
  createEffect(() => {
    console.log(seek())
  })
  return (
    <div class={clsx(props.class, "aper")}>
      <div class="aper-list-lyric">
        <div class="aper-list">
          <List
            audios={props.audios}
            playIndex={playIndex()}
            onPlayIndexChange={onPlayIndexChange}
          />
        </div>
        <div class="aper-lyric">
          <Lyric {...props.audios[playIndex()]} seek={seek()} />
        </div>
      </div>
      <div class="aper-control">
        <button
          onClick={() => {
            console.log(seek())
          }}
        >
          {seek()}
        </button>
        <button
          onClick={() => {
            player.play()
          }}
        >
          play
        </button>
      </div>
    </div>
  )
}
