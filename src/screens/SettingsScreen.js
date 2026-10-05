import React, { useEffect, useState } from 'react'
import { Alert, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { useProgress } from '../shared/context/ProgressContext'
import { getReminder, setReminder } from '../shared/services/notifications'
import { styles } from '../shared/styles/AppStyles'
import { colors } from '../shared/styles/theme'
import { notify } from '../shared/utils/alert'

const pad = (n) => String(n).padStart(2, '0')

export default function SettingsScreen() {
  const p = useProgress()
  const [rem, setRem] = useState(null)

  useEffect(() => {
    getReminder().then(setRem)
  }, [])

  async function apply(next) {
    setRem(next)
    const ok = await setReminder(next)
    if (next.enabled && !ok) {
      setRem({ ...next, enabled: false })
      notify(
        'Atenção',
        Platform.OS === 'web'
          ? 'O lembrete só funciona no celular.'
          : 'Permita notificações para este app nas configurações do Android.',
      )
    } else if (next.enabled) {
      notify('Lembrete ativado', `Todo dia às ${pad(next.hour)}:${pad(next.minute)}.`)
    }
  }

  function shift(mins) {
    const t = (rem.hour * 60 + rem.minute + mins + 1440) % 1440
    apply({ ...rem, hour: Math.floor(t / 60), minute: t % 60 })
  }

  function reset() {
    const run = () => {
      p.resetAll()
      notify('Progresso zerado')
    }
    if (Platform.OS === 'web') {
      if (window.confirm('Zerar progresso?')) run()
      return
    }
    Alert.alert('Zerar progresso?', 'Todos os dias marcados como feitos voltam a ficar pendentes.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Zerar', style: 'destructive', onPress: run },
    ])
  }

  if (!rem) return null

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Lembrete diário</Text>
            <Text style={{ color: colors.textMuted }}>Uma notificação para fazer os 60 minutos.</Text>
          </View>
          <Switch
            value={rem.enabled}
            onValueChange={(v) => apply({ ...rem, enabled: v })}
            trackColor={{ true: colors.primary, false: colors.line }}
            thumbColor={colors.textPrimary}
          />
        </View>
        {rem.enabled && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <Pressable style={styles.buttonGhost} onPress={() => shift(-30)}>
              <Text style={styles.buttonGhostText}>−30 min</Text>
            </Pressable>
            <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: '800', fontFamily: 'monospace' }}>
              {pad(rem.hour)}:{pad(rem.minute)}
            </Text>
            <Pressable style={styles.buttonGhost} onPress={() => shift(30)}>
              <Text style={styles.buttonGhostText}>+30 min</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progresso</Text>
        <Text style={{ color: colors.textMuted }}>
          {p.totalDone} de {p.total} dias feitos. Fica salvo só neste celular.
        </Text>
        <Pressable style={[styles.buttonGhost, { borderColor: colors.danger }]} onPress={reset}>
          <Text style={[styles.buttonGhostText, { color: colors.danger }]}>Zerar progresso</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}
