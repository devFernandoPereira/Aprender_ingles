import { emitFeedback } from './feedbackBus'

/** Mostra o FeedbackToast montado na raiz do App.js. */
export function notify(title, message) {
  emitFeedback({ title, message })
}
