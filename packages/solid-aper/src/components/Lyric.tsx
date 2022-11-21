import { createEffect, createSignal, For, Show } from "solid-js"
import { Audio } from "../types"
import lrcParser from "lrc-parser-ts"
import clsx from "clsx"

type Sentence = {
  start: number
  text: string
  end: number
}

type Lyrics = {
  ar: string
  ti: string
  al: string
  length: string
  scripts: Array<Sentence>
}

export const Lyric = (
  props: Pick<Audio, "lrc" | "lyric"> & { current: number }
) => {
  const [lyrics, setLyrics] = createSignal<Lyrics>()
  const init = async () => {
    setLyrics(undefined)
    let lyric = props.lyric
    if (lyric) {
      return
    }
    if (!props.lrc) {
      return
    } else {
      const res = await fetch(props.lrc)
      const text = await res.text()
      lyric = text
    }
    setLyrics(lrcParser(lyric) as Lyrics)
  }
  createEffect(() => {
    init()
  })
  createEffect(() => {
    console.log(props.current)
    const active = document.querySelector(".aper-lyric-item-active")
    if (active) {
      active.scrollIntoView({ block: "center" })
    }
  })
  return (
    <Show
      when={lyrics()}
      fallback={<div class="aper-lyric-none">No lyric yet.</div>}
    >
      <For each={lyrics()!.scripts}>
        {(item) => (
          <div
            class={clsx("aper-lyric-item", {
              "aper-lyric-item-active":
                item.start <= props.current && item.end >= props.current,
            })}
          >
            {item.text}
          </div>
        )}
      </For>
    </Show>
  )
}
