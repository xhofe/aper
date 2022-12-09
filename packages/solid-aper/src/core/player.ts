import { Howl, HowlCallback, HowlErrorCallback } from "howler"
import { Audio } from ".."

type StepEvent = (e: {
  seek: number
  percent: number
  playing: boolean
}) => void

const HowlEvents = [
  "load",
  "loaderror",
  "playerror",
  "play",
  "end",
  "pause",
  "stop",
  "mute",
  "volume",
  "rate",
  "seek",
  "fade",
  "unlock",
] as const

type Event = {
  // howl events
  load: () => void
  loaderror: HowlErrorCallback
  playerror: HowlErrorCallback
  play: HowlCallback
  end: HowlCallback
  pause: HowlCallback
  stop: HowlCallback
  mute: HowlCallback
  volume: HowlCallback
  rate: HowlCallback
  seek: HowlCallback
  fade: HowlCallback
  unlock: HowlCallback
  // player events
  step: StepEvent
}

type Events = {
  [K in keyof Event]: {
    callback: Event[K]
    once: boolean
  }[]
}

export interface PlayerOptions {
  audios: Audio[]
  debug?: boolean
}
export class Player {
  debug: boolean
  playlist: (Audio & { howl?: Howl })[]
  options: PlayerOptions
  events: Events = {
    load: [],
    loaderror: [],
    playerror: [],
    play: [],
    end: [],
    pause: [],
    stop: [],
    mute: [],
    volume: [],
    rate: [],
    seek: [],
    fade: [],
    unlock: [],
    step: [],
  }
  interval?: number
  timeout: number = 200
  index: number = 0
  constructor(options: PlayerOptions) {
    this.playlist = options.audios
    this.debug = options.debug ?? false
    this.options = options
  }
  play(index?: number) {
    this.debug && console.log("play", index)
    var self = this
    let sound: Howl

    index = typeof index === "number" ? index : self.index
    var data = self.playlist[index]

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl
    } else {
      self.debug && console.log("new howl")
      sound = data.howl = new Howl({
        src: [data.url],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onplay() {},
        onload() {},
        onend() {},
        onpause() {},
        onstop() {},
        onseek() {
          // Start updating the progress of the track.
          self.resetInterval()
        },
      })
      for (const key in HowlEvents) {
        const event = HowlEvents[key]
        sound.on(event, (...args: any[]) => {
          self._emit(event, ...args)
        })
      }
    }
    // Begin playing the sound.
    !sound.playing() && sound.play()
    // Keep track of the index we are currently playing.
    self.index = index
  }

  /**
   * Pause the currently playing track.
   */
  pause() {
    this.debug && console.log("pause")
    var self = this

    // Get the Howl we want to manipulate.
    const sound = self.playlist[self.index].howl!

    // Pause the sound.
    sound.pause()
  }

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip(direction: "prev" | "next") {
    this.debug && console.log("skip")
    var self = this

    // Get the next track based on the direction of the track.
    var index = 0
    if (direction === "prev") {
      index = self.index - 1
      if (index < 0) {
        index = self.playlist.length - 1
      }
    } else {
      index = self.index + 1
      if (index >= self.playlist.length) {
        index = 0
      }
    }

    self.skipTo(index)
  }

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  skipTo(index: number) {
    this.debug && console.log("skipTo", index)
    var self = this

    // Stop the current track.
    self.playlist[self.index].howl?.stop()

    // Play the new track.
    self.play(index)
  }

  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  volume(val: number) {
    this.debug && console.log("volume", val)
    var self = this

    // Update the global volume (affecting all Howls).
    Howler.volume(val)

    // Update the display on the slider.
  }

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek(per: number) {
    this.debug && console.log("seek", per)
    var self = this

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl

    // Convert the percent into a seek position.
    if (sound?.playing()) {
      sound.seek(sound.duration() * per)
    }
  }

  resetInterval() {
    var self = this
    self.interval && clearInterval(self.interval)
    self.interval = window.setInterval(() => {
      self.step()
    }, self.timeout)
  }

  step() {
    this.debug && console.log("step")
    var self = this
    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl

    // Determine our current seek position.
    var seek = sound?.seek() || 0
    // const time = self.formatTime(Math.round(seek))
    const percent = (seek / sound?.duration()!) * 100 ?? 0
    // call step events
    self._emit("step", { seek, percent, playing: sound?.playing() ?? false })
  }

  get howl() {
    return this.playlist[this.index].howl!
  }

  on(event: "load", callback: () => void): this
  on(event: "loaderror" | "playerror", callback: HowlErrorCallback): this
  on(
    event:
      | "play"
      | "end"
      | "pause"
      | "stop"
      | "mute"
      | "volume"
      | "rate"
      | "seek"
      | "fade"
      | "unlock",
    callback: HowlCallback,
    id?: number
  ): this
  on(event: "step", callback: StepEvent): this
  on(event: keyof Event, callback: Event[keyof Event]): this {
    this.debug && console.log("on", event)
    this.events[event] = {
      callback: callback,
      once: false,
    } as any
    return this
  }
  once(event: "load", callback: () => void): this
  once(event: "loaderror" | "playerror", callback: HowlErrorCallback): this
  once(
    event:
      | "play"
      | "end"
      | "pause"
      | "stop"
      | "mute"
      | "volume"
      | "rate"
      | "seek"
      | "fade"
      | "unlock",
    callback: HowlCallback
  ): this
  once(event: keyof Event, callback: Event[keyof Event]): this {
    this.debug && console.log("once", event)
    this.events[event] = {
      callback: callback,
      once: true,
    } as any
    return this
  }
  off(event: "load", callback: () => void): this
  off(event: "loaderror" | "playerror", callback: HowlErrorCallback): this
  off(
    event:
      | "play"
      | "end"
      | "pause"
      | "stop"
      | "mute"
      | "volume"
      | "rate"
      | "seek"
      | "fade"
      | "unlock",
    callback: HowlCallback
  ): this
  off(event: keyof Event, callback: Event[keyof Event]): this {
    this.debug && console.log("off", event)
    this.events[event] = (this.events[event] as any).filter((e: any) => {
      return e.callback !== callback
    })
    return this
  }
  _emit(event: keyof Event, ...args: any[]) {
    this.debug && console.log("_emit", event)
    const self = this
    const events = self.events[event]
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i]
      const fn = e.callback as any
      fn(...args)
      if (e.once) {
        self.off(event as any, e.callback as any)
      }
    }
  }
}
