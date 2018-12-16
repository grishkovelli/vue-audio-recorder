export function calculateLineHeadPosition (ev, element) {
  const progressWidth = element.getBoundingClientRect().width
  const leftPosition = ev.target.getBoundingClientRect().left
  let pos = (ev.clientX - leftPosition) / progressWidth

  try {
    if (!ev.target.className.match(/^ar\-line\-control/)) {
      return
    }
  } catch (err) {
    return
  }

  pos = pos < 0 ? 0 : pos
  pos = pos > 1 ? 1 : pos

  return pos
}

export function convertTimeMMSS (seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5)
}
