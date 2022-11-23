import "./style.scss"
import { createStore } from "solid-js/store"
import clsx from "clsx"
import { Audio } from ".."
import { List, Lyric } from "."
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

type Store = {
  playIndex: number
  seek: number
  volume: number
  duration: number
  status: "play" | "pause" | "loading"
}

// only show interface, do not handle logic
export const Aper = (props: AperProps) => {
  const player = new Player({
    audios: props.audios,
    debug: props.debug,
  })
  const [store, setStore] = createStore<Store>({
    playIndex: props.defaultPlayIndex ?? 0,
    seek: 0,
    duration: 0,
    status: "loading",
    volume: props.initialVolume ?? 0.5,
  })
  const onPlayIndexChange = (index: number) => {
    setStore("playIndex", index)
    player.skipTo(index, ({ howl }) => {
      setStore("duration", howl.duration())
    })
    props.onPlayIndexChange?.(index)
  }
  player.onStep((e) => {
    setStore("seek", e.seek)
  })
  player.on("play", () => {
    console.log("play")
    setStore("status", "play")
  })
  player.on("pause", () => {
    setStore("status", "pause")
  })
  player.on("load", () => {
    console.log("load")
  })
  player.on("end", () => {
    switch (props.loop) {
      case "list":
        onPlayIndexChange((store.playIndex + 1) % props.audios.length)
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
      <div class="aper-list-lyric">
        <div class="aper-list">
          <List
            audios={props.audios}
            playIndex={store.playIndex}
            onPlayIndexChange={onPlayIndexChange}
          />
        </div>
        <div class="aper-lyric">
          <Lyric {...props.audios[store.playIndex]} seek={store.seek} />
        </div>
      </div>
      <div class="aper-control">
        <button
          onClick={() => {
            console.log(store.seek)
          }}
        >
          {store.seek}
        </button>
        <button
          onClick={() => {
            if (store.status === "play") {
              player.pause()
            } else {
              player.play()
            }
          }}
        >
          {store.status}
        </button>
      </div>
    </div>
  )
}
