import { Howl } from "howler"
export interface Audio {
  name: string
  url: string
  artist: string
  cover?: string
  lyric?: string
  lrc?: string
  howl?: Howl
}
