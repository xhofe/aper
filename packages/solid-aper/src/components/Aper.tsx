import "./style.scss"
import clsx from "clsx"
import { Audio } from "../types"
import { List } from "./List"
import { createSignal } from "solid-js"
import { Lyric } from "./Lyric"

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
}

export const Aper = (props: AperProps) => {
  const [playIndex, setPlayIndex] = createSignal(props.defaultPlayIndex ?? 0)
  const onPlayIndexChange = (index: number) => {
    setPlayIndex(index)
    props.onPlayIndexChange?.(index)
  }
  const [current, setCurrent] = createSignal(50)
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
          <Lyric {...props.audios[playIndex()]} current={current()} />
        </div>
      </div>
      <div class="aper-control"></div>
    </div>
  )
}
