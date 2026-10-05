import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { WEEKS } from '../data/plan'
import { useProgress } from '../shared/context/ProgressContext'
import ProgressBar from '../shared/components/ProgressBar'
import { styles } from '../shared/styles/AppStyles'
import { colors } from '../shared/styles/theme'
import { notify } from '../shared/utils/alert'

export default function HomeScreen({ navigation }) {
  const p = useProgress()
  const pct = Math.round((p.totalDone / p.total) * 100)
  const next = p.nextPending()

  function handleContinue() {
    if (!next) return notify('Ciclo concluído!', 'Recomece com conteúdos mais difíceis do barril.')
    p.rememberWeek(next.w)
    navigation.navigate('Week', { w: next.w })
    navigation.navigate('Day', { w: next.w, d: next.d })
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={[styles.card, { gap: 12 }]}>
        <Text style={styles.label}>Natural Method · 60 min ativos por dia</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={{ fontSize: 40, fontWeight: '800', color: colors.textPrimary }}>{pct}%</Text>
          <Text style={{ color: colors.textMuted }}>
            {p.totalDone}/{p.total} dias
          </Text>
        </View>
        <ProgressBar value={p.totalDone / p.total} height={10} />
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>
            {next
              ? `Continuar → Semana ${next.w + 1}, ${WEEKS[next.w].days[next.d].d}`
              : 'Ciclo concluído ✓'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Semanas</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {WEEKS.map((w, i) => {
          const n = p.weekDone(i)
          const complete = n === 7
          const current = i === p.lastWeek
          return (
            <Pressable
              key={i}
              onPress={() => {
                p.rememberWeek(i)
                navigation.navigate('Week', { w: i })
              }}
              style={[
                styles.card,
                {
                  width: '47%',
                  flexGrow: 1,
                  padding: 12,
                  gap: 6,
                  borderColor: current ? colors.primary : colors.line,
                  backgroundColor: current ? colors.primarySoft : colors.surface,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.label, complete && { color: colors.success }]}>Sem {i + 1}</Text>
                <Text style={[styles.label, complete && { color: colors.success }]}>
                  {complete ? '✓ ' : ''}
                  {n}/7
                </Text>
              </View>
              <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 16 }}>{w.s}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }} numberOfLines={1}>
                {w.t}
              </Text>
              <ProgressBar value={n / 7} color={colors.success} height={6} />
            </Pressable>
          )
        })}
      </View>

      <Text style={[styles.text, { color: colors.textMuted, fontSize: 13, marginTop: 8 }]}>
        Marque um dia como feito só quando fizer os 60 minutos ativos. O passivo (podcasts, séries,
        jogos em inglês) e os micro-hábitos rodam todo dia, por fora do bloco.
      </Text>
    </ScrollView>
  )
}

export function HomeHeaderRight({ navigation }) {
  return (
    <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10}>
      <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
    </Pressable>
  )
}
