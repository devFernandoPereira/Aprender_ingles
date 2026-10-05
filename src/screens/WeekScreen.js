import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { WEEKS, yt } from '../data/plan'
import { useProgress } from '../shared/context/ProgressContext'
import ProgressBar from '../shared/components/ProgressBar'
import { styles } from '../shared/styles/AppStyles'
import { colors } from '../shared/styles/theme'
import { openUrl } from '../shared/utils/open'
import { notify } from '../shared/utils/alert'

function LinkRow({ tag, title, sub, url }) {
  return (
    <Pressable
      onPress={() => openUrl(url)}
      style={{ flexDirection: 'row', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.line }}
    >
      <Text style={[styles.label, { width: 82, paddingTop: 3 }]}>{tag}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.link}>{title} ↗</Text>
        {!!sub && <Text style={{ color: colors.textMuted, fontSize: 13 }}>{sub}</Text>}
      </View>
    </Pressable>
  )
}

export default function WeekScreen({ route, navigation }) {
  const { w } = route.params
  const week = WEEKS[w]
  const p = useProgress()
  const n = p.weekDone(w)

  async function toggle(d) {
    const nowDone = await p.toggleDay(w, d)
    if (nowDone) notify(n + 1 === 7 ? `Semana ${w + 1} concluída!` : 'Dia concluído')
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={{ gap: 6 }}>
        <Text style={styles.label}>
          Semana {w + 1} de {WEEKS.length}
        </Text>
        <Text style={styles.title}>{week.t}</Text>
        <Text style={styles.text}>{week.pt}</Text>
        <View style={[styles.card, { padding: 12, gap: 4 }]}>
          <Text style={styles.label}>Meta</Text>
          <Text style={[styles.text, { color: colors.textPrimary }]}>{week.goal}</Text>
        </View>
        <Text style={styles.label}>{n} de 7 dias concluídos</Text>
        <ProgressBar value={n / 7} color={colors.success} height={6} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          style={[styles.card, { flex: 1, padding: 12, gap: 4, backgroundColor: colors.sunk }]}
          onPress={() => openUrl(week.passive[1])}
        >
          <Text style={styles.label}>Passivo todo dia</Text>
          <Text style={[styles.link, { fontSize: 13 }]}>{week.passive[0]} ↗</Text>
        </Pressable>
        <View style={[styles.card, { flex: 1, padding: 12, gap: 4, backgroundColor: colors.sunk }]}>
          <Text style={styles.label}>Micro-hábito</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{week.micro}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Dias</Text>
      <View style={{ gap: 8 }}>
        {week.days.map((day, d) => {
          const isDone = p.isDone(w, d)
          const mins = day.t.reduce((a, t) => a + t[0], 0)
          return (
            <View
              key={d}
              style={[
                styles.card,
                { padding: 0, flexDirection: 'row', overflow: 'hidden', borderColor: isDone ? colors.success : colors.line },
              ]}
            >
              <Pressable
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}
                onPress={() => navigation.navigate('Day', { w, d })}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '800', fontSize: 16, width: 40 }}>{day.d}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{day.f}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{mins} min ativos</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
              <Pressable
                onPress={() => toggle(d)}
                hitSlop={6}
                accessibilityLabel={`Marcar ${day.d} como feito`}
                style={{
                  width: 64,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeftWidth: 1,
                  borderLeftColor: colors.line,
                  backgroundColor: isDone ? colors.successSoft : 'transparent',
                }}
              >
                <Ionicons
                  name={isDone ? 'checkbox' : 'square-outline'}
                  size={26}
                  color={isDone ? colors.success : colors.textMuted}
                />
              </Pressable>
            </View>
          )
        })}
      </View>

      <Pressable
        style={[styles.button, { flexDirection: 'row', justifyContent: 'center', gap: 8 }]}
        onPress={() => navigation.navigate('Vocab', { w })}
      >
        <Ionicons name="albums-outline" size={18} color={colors.primaryInk} />
        <Text style={styles.buttonText}>Vocabulário · {week.vocab.length} palavras</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.label}>Gramática da semana</Text>
        <Text style={styles.cardTitle}>{week.g.t}</Text>
        <Text style={styles.text}>{week.g.x}</Text>
        <View style={{ gap: 6 }}>
          {week.g.ex.map((e, i) => (
            <Text
              key={i}
              style={{ color: colors.textPrimary, borderLeftWidth: 3, borderLeftColor: colors.primary, paddingLeft: 10 }}
            >
              {e}
            </Text>
          ))}
        </View>
        <Pressable onPress={() => openUrl(yt(week.g.q + ' BBC Learning English'))}>
          <Text style={styles.link}>Vídeos sobre o tópico ↗</Text>
        </Pressable>
      </View>

      <View style={[styles.card, { gap: 0 }]}>
        <Text style={[styles.label, { marginBottom: 6 }]}>Recursos recomendados</Text>
        {week.res.map((r, i) => (
          <LinkRow key={i} tag={r[0]} title={r[1]} sub={r[3]} url={r[2]} />
        ))}
      </View>

      <View style={[styles.card, { gap: 0 }]}>
        <Text style={[styles.label, { marginBottom: 6 }]}>Conteúdos da semana</Text>
        <LinkRow tag="Shadowing" title={week.shadow[0]} url={week.shadow[1]} />
        <LinkRow tag="Mining" title={week.mine[0]} url={week.mine[1]} />
        <LinkRow tag="Leitura" title={week.read[0]} url={week.read[1]} />
      </View>
    </ScrollView>
  )
}
