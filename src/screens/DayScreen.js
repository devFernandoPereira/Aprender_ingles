import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { WEEKS, CORRECT_PROMPT, rpPrompt } from '../data/plan'
import { useProgress } from '../shared/context/ProgressContext'
import { styles } from '../shared/styles/AppStyles'
import { colors } from '../shared/styles/theme'
import { copyText, openUrl } from '../shared/utils/open'
import { notify } from '../shared/utils/alert'

const mono = { fontFamily: 'monospace' }

function Extra({ week, day }) {
  if (day.x === 'chorus' || day.x === 'talk') {
    const chorus = day.x === 'chorus'
    const items = chorus ? week.ch : week.talk
    return (
      <View style={styles.card}>
        <Text style={styles.label}>{chorus ? 'Frases para chorusing · toque para ouvir no YouGlish' : 'Perguntas para a conversa'}</Text>
        {items.map((c, i) => (
          <Pressable
            key={i}
            disabled={!chorus}
            onPress={() => openUrl('https://youglish.com/pronounce/' + encodeURIComponent(c) + '/english')}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
              {i + 1}. {c}
              {chorus ? <Text style={{ color: colors.primary }}>  ↗</Text> : null}
            </Text>
          </Pressable>
        ))}
      </View>
    )
  }
  if (day.x === 'prompt' || day.x === 'correct') {
    const txt = day.x === 'prompt' ? rpPrompt(week) : CORRECT_PROMPT
    return (
      <View style={styles.card}>
        <Text style={styles.label}>{day.x === 'prompt' ? 'Prompt do roleplay' : 'Prompt de correção'}</Text>
        <Text
          selectable
          style={[mono, { color: colors.textSecondary, fontSize: 12.5, backgroundColor: colors.sunk, padding: 10, borderRadius: 8 }]}
        >
          {txt}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            style={[styles.buttonGhost, { flex: 1 }]}
            onPress={() => copyText(txt, 'Prompt copiado', 'Cole no Claude ou no ChatGPT.')}
          >
            <Text style={styles.buttonGhostText}>Copiar prompt</Text>
          </Pressable>
          <Pressable style={[styles.buttonGhost, { flex: 1 }]} onPress={() => openUrl('https://claude.ai')}>
            <Text style={styles.buttonGhostText}>Abrir Claude ↗</Text>
          </Pressable>
        </View>
      </View>
    )
  }
  return null
}

export default function DayScreen({ route, navigation }) {
  const { w, d } = route.params
  const week = WEEKS[w]
  const day = week.days[d]
  const p = useProgress()
  const isDone = p.isDone(w, d)
  const total = day.t.reduce((a, t) => a + t[0], 0)

  async function toggle() {
    const weekBefore = p.weekDone(w)
    const nowDone = await p.toggleDay(w, d)
    if (!nowDone) return
    notify(weekBefore + 1 === 7 ? `Semana ${w + 1} concluída!` : 'Dia concluído', 'Bom trabalho!')
    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={{ gap: 4 }}>
        <Text style={styles.label}>
          Semana {w + 1} · {week.s}
        </Text>
        <Text style={styles.title}>{day.f}</Text>
        <Text style={{ color: colors.textMuted }}>Total: {total} min ativos</Text>
      </View>

      {day.t.map((t, i) => (
        <View key={i} style={[styles.card, { flexDirection: 'row', gap: 12 }]}>
          <Text
            style={[
              mono,
              {
                fontWeight: '700',
                color: colors.textPrimary,
                backgroundColor: colors.primarySoft,
                borderRadius: 6,
                paddingVertical: 4,
                width: 62,
                textAlign: 'center',
                alignSelf: 'flex-start',
                overflow: 'hidden',
              },
            ]}
          >
            {t[0]} min
          </Text>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.text, { color: colors.textPrimary }]}>{t[1]}</Text>
            {t[3] ? (
              <Pressable onPress={() => openUrl(t[3])}>
                <Text style={[styles.link, { fontSize: 13 }]}>{t[2]} ↗</Text>
              </Pressable>
            ) : (
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>Recurso: {t[2]}</Text>
            )}
          </View>
        </View>
      ))}

      <Extra week={week} day={day} />

      <Pressable
        onPress={toggle}
        style={[
          styles.button,
          { flexDirection: 'row', justifyContent: 'center', gap: 8 },
          isDone && { backgroundColor: colors.successSoft, borderWidth: 1, borderColor: colors.success },
        ]}
      >
        <Ionicons
          name={isDone ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={20}
          color={isDone ? colors.success : colors.primaryInk}
        />
        <Text style={[styles.buttonText, isDone && { color: colors.success }]}>
          {isDone ? 'Feito · toque para desmarcar' : 'Marcar dia como feito'}
        </Text>
      </Pressable>
    </ScrollView>
  )
}
