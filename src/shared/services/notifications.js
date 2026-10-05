import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Lembrete diário local (sem servidor de push): agenda no próprio celular.
const REMINDER_KEY = '@daily_reminder' // { enabled, hour, minute }

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function getReminder() {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { enabled: false, hour: 19, minute: 0 }
}

export async function setReminder({ enabled, hour, minute }) {
  if (Platform.OS === 'web') return false
  await Notifications.cancelAllScheduledNotificationsAsync()
  if (enabled) {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') return false
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily', {
        name: 'Lembrete diário',
        importance: Notifications.AndroidImportance.HIGH,
      })
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora do inglês 🎧',
        body: 'Seus 60 minutos ativos de hoje estão esperando. Bora?',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: 'daily',
      },
    })
  }
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify({ enabled, hour, minute }))
  return true
}
