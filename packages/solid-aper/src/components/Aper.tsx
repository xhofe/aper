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
  loop?: "list" | "random" | "single"
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
  loop: AperProps["loop"]
}

// only show interface, do not handle logic
export const Aper = (props: AperProps) => {
  const [store, setStore] = createStore<Store>({
    playIndex: props.defaultPlayIndex ?? 0,
    seek: 0,
    duration: 0,
    status: "pause",
    volume: props.initialVolume ?? 0.5,
    loop: props.loop ?? "list",
  })
  const player = new Player({
    audios: props.audios,
    debug: props.debug,
  })
  player.on("play", () => {
    console.log("---------Aper play")
    setStore("status", "play")
    setStore("duration", player.howl.duration())
  })
  player.on("step", (e) => {
    setStore("seek", e.seek)
    if (e.playing) {
      setStore("status", "play")
    }
  })
  const onPlayIndexChange = (index: number) => {
    index = (index + props.audios.length) % props.audios.length
    setStore("playIndex", index)
    setStore("status", "loading")
    player.skipTo(index)
    props.onPlayIndexChange?.(index)
  }
  const onVolumeChange = (val: number) => {
    player.volume(val)
    setStore("volume", val)
  }
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
    switch (store.loop) {
      case "list":
        onPlayIndexChange(store.playIndex + 1)
        break
      case "random":
        onPlayIndexChange(Math.floor(Math.random() * props.audios.length))
        break
      case "single":
        onPlayIndexChange(store.playIndex)
    }
  })
  player.on("loaderror", (id, err) => {
    console.error(err)
    onPlayIndexChange(store.playIndex + 1)
  })
  player.on("playerror", (id, err) => {
    console.error(err)
    onPlayIndexChange(store.playIndex + 1)
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
          onVolumeChange={onVolumeChange}
          player={player}
          store={store}
          setStore={setStore}
        />
      </div>
    </div>
  )
}
