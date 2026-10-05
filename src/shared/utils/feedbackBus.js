let listener = null

export function setFeedbackListener(fn) {
  listener = fn
}

export function emitFeedback(payload) {
  if (listener) listener(payload)
}
