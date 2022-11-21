import { Howl } from "howler"
import { Audio } from "../types"

export interface PlayerOptions {
  audios: Audio[]
}

export class Player {
  playlist: Audio[]
  index: number = 0
  constructor(options: PlayerOptions) {
    this.playlist = options.audios
  }
  play(index: number) {
    var self = this
    let sound: Howl

    index = typeof index === "number" ? index : self.index
    var data = self.playlist[index]

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl
    } else {
      sound = data.howl = new Howl({
        src: [data.url],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onplay() {
          // Display the duration.
          const duration = self.formatTime(Math.round(sound.duration()))

          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self))
        },
        onload() {},
        onend() {},
        onpause() {},
        onstop() {},
        onseek() {
          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self))
        },
      })
    }

    // Begin playing the sound.
    sound.play()

    // Keep track of the index we are currently playing.
    self.index = index
  }

  /**
   * Pause the currently playing track.
   */
  pause() {
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
    var self = this

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl

    // Convert the percent into a seek position.
    if (sound?.playing()) {
      sound.seek(sound.duration() * per)
    }
  }

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step() {
    var self = this

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl

    // Determine our current seek position.
    var seek = sound?.seek() || 0
    const time = self.formatTime(Math.round(seek))
    const progress = (seek / (sound?.duration() ?? 0)) * 100 + "%"

    // If the sound is still playing, continue stepping.
    if (sound?.playing()) {
      requestAnimationFrame(self.step.bind(self))
    }
  }

  formatTime(secs: number) {
    var minutes = Math.floor(secs / 60) || 0
    var seconds = secs - minutes * 60 || 0

    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds
  }
}
