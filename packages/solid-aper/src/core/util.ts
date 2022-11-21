export function formatTime(secs: number) {
  var minutes = Math.floor(secs / 60) || 0
  var seconds = secs - minutes * 60 || 0

  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds
}
