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
  class?: string
  mainColor?: string
  onPlayIndexChange?: (index: number) => void
  debug?: boolean
  defaultVolume?: number
  rememberVolume?: boolean
  getPlayerInstance?: (player: Player) => void
}

export type Store = {
  playIndex: number
  seek: number
  volume: number
  duration: number
  status: "play" | "pause" | "loading"
  loop: AperProps["loop"]
  err?: string
}

// only show interface, do not handle logic
export const Aper = (props: AperProps) => {
  let volume = props.defaultVolume ?? 0.5
  if (props.rememberVolume) {
    const v = localStorage.getItem("aper-volume")
    if (v) {
      volume = parseFloat(v)
    }
  }
  const [store, setStore] = createStore<Store>({
    playIndex: props.defaultPlayIndex ?? 0,
    seek: 0,
    duration: 0,
    status: "pause",
    volume: volume,
    loop: props.loop ?? "list",
  })
  const player = new Player({
    audios: props.audios,
    debug: props.debug,
  })
  player.volume(store.volume)
  props.getPlayerInstance?.(player)
  if (props.autoplay) {
    player.play()
  }
  player.on("play", () => {
    setStore("status", "play")
    setStore("err", undefined)
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
    if (props.rememberVolume) {
      localStorage.setItem("aper-volume", val.toString())
    }
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
  player.on("loaderror", (_, e) => {
    console.log("load error", e)
    setStore("status", "pause")
    setStore("err", "Load error")
  })
  player.on("playerror", (_, e) => {
    console.log("play error", e)
    setStore("status", "pause")
    setStore("err", "Play error")
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
    <div
      class={clsx(props.class, "aper")}
      style={{
        "--aper-color": props.mainColor ?? "#6366f1",
      }}
    >
      <div class="list-lyric">
        <div class="list">
          <List
            audios={props.audios}
            playIndex={store.playIndex}
            onPlayIndexChange={onPlayIndexChange}
          />
        </div>
        <div class="lyric">
          <Lyric
            {...props.audios[store.playIndex]}
            seek={store.seek}
            err={store.err}
          />
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
