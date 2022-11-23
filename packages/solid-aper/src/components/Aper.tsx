import "./style.scss"
import { createStore } from "solid-js/store"
import clsx from "clsx"
import { Audio } from ".."
import { Control, List, Lyric } from "."
import { Player } from ".."

export interface AperProps {
  audios: Audio[]
  defaultPlayIndex?: number
  defaultCover?: string
  loop?: "list" | "random" | "one"
  autoplay?: boolean
  defaultVolume?: number
  class?: string
  mainColor?: string
  onPlayIndexChange?: (index: number) => void
  debug?: boolean
  initialVolume?: number
}

export type Store = {
  playIndex: number
  seek: number
  volume: number
  duration: number
  status: "play" | "pause" | "loading"
}

// only show interface, do not handle logic
export const Aper = (props: AperProps) => {
  const [store, setStore] = createStore<Store>({
    playIndex: props.defaultPlayIndex ?? 0,
    seek: 0,
    duration: 0,
    status: "pause",
    volume: props.initialVolume ?? 0.5,
  })
  const player = new Player({
    audios: props.audios,
    debug: props.debug,
    onPlay: ({ howl }) => {
      setStore("duration", howl.duration())
      setStore("status", "play")
    },
  })
  const onPlayIndexChange = (index: number) => {
    index = (index + props.audios.length) % props.audios.length
    setStore("playIndex", index)
    setStore("status", "loading")
    player.skipTo(index)
    props.onPlayIndexChange?.(index)
  }
  player.onStep((e) => {
    setStore("seek", e.seek)
    if (e.playing) {
      setStore("status", "play")
    }
  })
  player.on("pause", () => {
    setStore("status", "pause")
  })
  player.on("load", () => {
    console.log("load")
  })
  player.on("seek", () => {
    setStore("status", "loading")
  })
  player.on("end", () => {
    switch (props.loop) {
      case "list":
        onPlayIndexChange(store.playIndex + 1)
        break
      case "random":
        onPlayIndexChange(Math.floor(Math.random() * props.audios.length))
        break
      case "one":
        onPlayIndexChange(store.playIndex)
    }
  })
  return (
    <div class={clsx(props.class, "aper")}>
      <div class="list-lyric">
        <div class="list">
          <List
            audios={props.audios}
            playIndex={store.playIndex}
            onPlayIndexChange={onPlayIndexChange}
          />
        </div>
        <div class="lyric">
          <Lyric {...props.audios[store.playIndex]} seek={store.seek} />
        </div>
      </div>
      <div class="control">
        <Control
          defaultCover={props.defaultCover}
          audio={props.audios[store.playIndex]}
          onPlayIndexChange={onPlayIndexChange}
          player={player}
          store={store}
        />
      </div>
    </div>
  )
}
