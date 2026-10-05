import React, { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { WEEKS } from '../data/plan'
import { styles } from '../shared/styles/AppStyles'
import { colors } from '../shared/styles/theme'
import { copyText } from '../shared/utils/open'

function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function VocabScreen({ route }) {
  const { w } = route.params
  const week = WEEKS[w]
  const [flash, setFlash] = useState(false)
  const [order, setOrder] = useState(week.vocab)
  const [shown, setShown] = useState({})
  const revealed = Object.keys(shown).length

  function toggleFlash() {
    setFlash(!flash)
    setShown({})
  }

  function copyAnki() {
    copyText(
      week.vocab.map((v) => v[0] + '\t' + v[1]).join('\n'),
      'Vocabulário copiado',
      'Importe no Anki como texto separado por tab.',
    )
  }

  return (
    <FlatList
      data={order}
      keyExtractor={(v, i) => v[0] + i}
      contentContainerStyle={[styles.screen, { gap: 6 }]}
      ListHeaderComponent={
        <View style={{ gap: 10, marginBottom: 8 }}>
          <Text style={styles.label}>
            Semana {w + 1} · {week.s}
          </Text>
          <Text style={styles.title}>{week.vocab.length} palavras e expressões</Text>
          {flash && (
            <Text style={{ color: colors.textMuted }}>
              Toque para revelar a tradução · {revealed}/{order.length} vistas
            </Text>
          )}
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Pressable
              style={[styles.buttonGhost, flash && { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}
              onPress={toggleFlash}
            >
              <Text style={styles.buttonGhostText}>{flash ? 'Mostrar traduções' : 'Modo flashcard'}</Text>
            </Pressable>
            <Pressable
              style={styles.buttonGhost}
              onPress={() => {
                setOrder(shuffle(week.vocab))
                setShown({})
              }}
            >
              <Text style={styles.buttonGhostText}>Embaralhar</Text>
            </Pressable>
            <Pressable style={styles.buttonGhost} onPress={copyAnki}>
              <Text style={styles.buttonGhostText}>Copiar para o Anki</Text>
            </Pressable>
          </View>
        </View>
      }
      renderItem={({ item }) => {
        const visible = !flash || shown[item[0]]
        return (
          <Pressable
            disabled={!flash}
            onPress={() => setShown((s) => ({ ...s, [item[0]]: true }))}
            style={[styles.card, { padding: 12, gap: 2 }]}
          >
            <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 16 }}>{item[0]}</Text>
            <Text style={{ color: visible ? colors.textMuted : colors.line, fontSize: 14 }}>
              {visible ? item[1] : 'toque para ver'}
            </Text>
          </Pressable>
        )
      }}
    />
  )
}
