import { Howl, HowlCallback, HowlErrorCallback } from "howler"
import { Audio } from ".."
import { formatTime } from ".."

export interface PlayerOptions {
  audios: Audio[]
  debug?: boolean
}

type StepEvent = (e: { seek: number; percent: number }) => void

export class Player {
  debug: boolean
  playlist: Audio[]
  stepEvents: StepEvent[] = []
  howlEvents: {
    [event: string]: {
      callback: HowlCallback | HowlErrorCallback
      once: boolean
      id?: number
    }[]
  } = {}
  interval?: number
  timeout: number = 1000
  index: number = 0
  constructor(options: PlayerOptions) {
    this.playlist = options.audios
    this.debug = options.debug ?? false
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
        onplay() {
          // Display the duration.
          const duration = formatTime(Math.round(sound.duration()))

          // Start updating the progress of the track.
          self.resetInterval()
        },
        onload() {},
        onend() {},
        onpause() {},
        onstop() {},
        onseek() {
          // Start updating the progress of the track.
          self.resetInterval()
        },
      })
      for (const event in self.howlEvents) {
        self.howlEvents[event].forEach((e) => {
          if (e.once) {
            sound.once(event, e.callback, e.id)
          } else {
            sound.on(event, e.callback, e.id)
          }
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
    this.debug && console.log("skip", direction)
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

    // Reset progress.

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
    clearInterval(self.interval)
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
    self.stepEvents.forEach((e) => e({ seek, percent }))
    // If the sound is still playing, continue stepping.
    if (!sound?.playing()) {
      // requestAnimationFrame(self.step.bind(self))
      clearInterval(self.interval)
    }
  }

  onStep(e: StepEvent) {
    this.stepEvents.push(e)
  }
  offStep(e: StepEvent) {
    this.stepEvents = this.stepEvents.filter((f) => f !== e)
  }
  on(event: "load", callback: () => void, id?: number): this
  on(
    event: "loaderror" | "playerror",
    callback: HowlErrorCallback,
    id?: number
  ): this
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
  on(
    event: string,
    callback: HowlCallback | HowlErrorCallback,
    id?: number
  ): this
  on(
    event: string,
    callback: HowlCallback | HowlErrorCallback,
    id?: number
  ): this {
    this.debug && console.log("on", event)
    var self = this
    self.playlist[self.index].howl?.on(event, callback, id)
    if (!self.howlEvents[event]) {
      self.howlEvents[event] = []
    }
    self.howlEvents[event].push({
      callback,
      id,
      once: false,
    })
    return self
  }
  once(event: "load", callback: () => void, id?: number): this
  once(
    event: "loaderror" | "playerror",
    callback: HowlErrorCallback,
    id?: number
  ): this
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
    callback: HowlCallback,
    id?: number
  ): this
  once(
    event: string,
    callback: HowlCallback | HowlErrorCallback,
    id?: number
  ): this
  once(
    event: string,
    callback: HowlCallback | HowlErrorCallback,
    id?: number
  ): this {
    this.debug && console.log("once", event)
    var self = this
    self.playlist[self.index].howl?.once(event, callback, id)
    if (!self.howlEvents[event]) {
      self.howlEvents[event] = []
    }
    self.howlEvents[event].push({
      callback,
      id,
      once: true,
    })
    return self
  }
  off(event: "load", callback?: () => void, id?: number): this
  off(
    event: "loaderror" | "playerror",
    callback?: HowlErrorCallback,
    id?: number
  ): this
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
    callback?: HowlCallback,
    id?: number
  ): this
  off(
    event?: string,
    callback?: HowlCallback | HowlErrorCallback,
    id?: number
  ): this
  off(
    event?: string,
    callback?: HowlCallback | HowlErrorCallback,
    id?: number
  ): this {
    this.debug && console.log("off", event)
    var self = this
    self.playlist[self.index].howl?.off(event, callback, id)
    if (event) {
      self.howlEvents[event] = self.howlEvents[event].filter((e) => {
        return e.callback !== callback && e.id !== id
      })
    }
    return self
  }
}
