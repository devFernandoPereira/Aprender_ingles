import { Linking } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { notify } from './alert'

export async function openUrl(url) {
  if (!url) return
  try {
    await Linking.openURL(url)
  } catch {
    notify('Erro ao abrir link', url)
  }
}

export async function copyText(text, title, message) {
  try {
    await Clipboard.setStringAsync(text)
    notify(title, message)
  } catch {
    notify('Erro ao copiar')
  }
}
