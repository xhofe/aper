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
import {
  MingcuteVolumeMuteFill,
  MingcuteVolumeFill,
} from "solid-iconify/mingcute"
import { MdiPlaylistMusicOutline } from "solid-iconify/mdi"
import { PepiconsMusicNoteSingle } from "solid-iconify/pepicons"
import { GameIconsPerspectiveDiceSixFacesRandom } from "solid-iconify/game-icons"

import { Dynamic } from "solid-js/web"
import { SetStoreFunction } from "solid-js/store"

let lastVolume = 0.5
const loop = ["list", "single", "random"] as const
export interface ControlProps {
  store: Store
  setStore: SetStoreFunction<Store>
  player: Player
  audio: Audio
  defaultCover?: string
  onPlayIndexChange?: (index: number) => void
  onVolumeChange?: (val: number) => void
}
export const Control = (props: ControlProps) => {
  return (
    <>
      <div class="progress">
        <div class="time">{formatTime(props.store.seek)}</div>
        <Slider
          value={props.store.seek}
          max={props.store.duration}
          onChange={(val) => {
            props.player.seek(val / props.store.duration)
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
                props.setStore("status", "loading")
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
        <div class="settings">
          <div class="volume">
            <button
              class="btn"
              onClick={() => {
                if (props.store.volume === 0) {
                  props.onVolumeChange?.(lastVolume)
                } else {
                  lastVolume = props.store.volume
                  props.onVolumeChange?.(0)
                }
              }}
            >
              <Dynamic
                component={
                  props.store.volume === 0
                    ? MingcuteVolumeMuteFill
                    : MingcuteVolumeFill
                }
                size="100%"
              />
            </button>
            <Slider
              value={props.store.volume * 100}
              onChange={(val) => {
                props.onVolumeChange?.(val / 100)
              }}
            />
          </div>
          <div class="loop">
            <button
              class="btn"
              onClick={() => {
                const index = loop.indexOf(props.store.loop!)
                const next = loop[(index + 1) % loop.length]
                props.setStore("loop", next)
              }}
            >
              <Dynamic
                component={
                  props.store.loop === "list"
                    ? MdiPlaylistMusicOutline
                    : props.store.loop === "random"
                    ? GameIconsPerspectiveDiceSixFacesRandom
                    : PepiconsMusicNoteSingle
                }
                size="100%"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
