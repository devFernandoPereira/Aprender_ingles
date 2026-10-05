import React from 'react'
import { View } from 'react-native'
import { styles } from '../styles/AppStyles'
import { colors } from '../styles/theme'

export default function ProgressBar({ value, color = colors.primary, height = 8 }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <View style={[styles.bar, { height }]}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: 99 }} />
    </View>
  )
}
