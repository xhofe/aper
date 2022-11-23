import clsx from "clsx"
import { Player, Audio, Store, Slider, formatTime } from ".."
import { Match, Switch } from "solid-js"
import {
  FluentPrevious20Filled,
  FluentNext20Filled,
  FluentPlay20Filled,
  FluentPause20Filled,
} from "solid-iconify/fluent"
import { EosIconsBubbleLoading } from "solid-iconify/eos-icons"
export interface ControlProps {
  store: Store
  player: Player
  audio: Audio
  defaultCover?: string
  onPlayIndexChange?: (index: number) => void
}
export const Control = (props: ControlProps) => {
  return (
    <>
      <div class="progress">
        <div class="time">{formatTime(props.store.seek)}</div>
        <Slider
          value={(props.store.seek / props.store.duration) * 100}
          onChange={(val) => {
            props.player.seek(val / 100)
          }}
        />
        <div class="time">{formatTime(props.store.duration)}</div>
      </div>
      <div class="other">
        <div class="cover">
          <img
            class={clsx({ rotate: props.store.status === "play" })}
            src={props.audio.cover ?? props.defaultCover}
            alt="cover"
          />
        </div>
        <div class="operate">
          <button
            class="btn"
            onClick={() => props.onPlayIndexChange?.(props.store.playIndex - 1)}
          >
            <FluentPrevious20Filled size="100%" />
          </button>
          <button
            class="btn center"
            onClick={() => {
              if (props.store.status === "play") {
                props.player.pause()
              } else if (props.store.status === "pause") {
                props.player.play()
              }
            }}
          >
            <Switch>
              <Match when={props.store.status === "play"}>
                <FluentPause20Filled size="100%" />
              </Match>
              <Match when={props.store.status === "pause"}>
                <FluentPlay20Filled size="100%" />
              </Match>
              <Match when={props.store.status === "loading"}>
                <EosIconsBubbleLoading size="100%" />
              </Match>
            </Switch>
          </button>
          <button
            class="btn"
            onClick={() => props.onPlayIndexChange?.(props.store.playIndex + 1)}
          >
            <FluentNext20Filled size="100%" />
          </button>
        </div>
        <div class="settings"></div>
      </div>
    </>
  )
}
