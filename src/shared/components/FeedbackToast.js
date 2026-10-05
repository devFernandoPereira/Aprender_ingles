import React, { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, Text, View, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { setFeedbackListener } from '../utils/feedbackBus'

const TYPES = {
  success: {
    icon: 'checkmark-circle',
    color: '#4CC995',
  },
  warning: {
    icon: 'alert-circle',
    color: '#fbbf24',
  },
  error: {
    icon: 'close-circle',
    color: '#f87171',
  },
}

function getType(title) {
  const t = (title || '').toLowerCase()
  if (t.includes('erro')) return 'error'
  if (t.includes('atenção') || t.includes('sem ação') || t.includes('recusado')) {
    return 'warning'
  }
  return 'success'
}

export default function FeedbackToast() {
  const [feedback, setFeedback] = useState(null)
  const translateY = useRef(new Animated.Value(-140)).current
  const opacity = useRef(new Animated.Value(0)).current
  const dismissTimer = useRef(null)

  useEffect(() => {
    setFeedbackListener(({ title, message }) => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      setFeedback({ title, message, type: getType(title) })
    })
    return () => setFeedbackListener(null)
  }, [])

  useEffect(() => {
    if (!feedback) return
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()

    dismissTimer.current = setTimeout(dismiss, 3200)
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback])

  function dismiss() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -140,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setFeedback(null))
  }

  if (!feedback) return null

  const style = TYPES[feedback.type]
  const topOffset = Platform.OS === 'ios' ? 56 : 32

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 999,
        paddingTop: topOffset,
        paddingHorizontal: 16,
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          width: '100%',
          maxWidth: 480,
        }}
      >
        <Pressable
          onPress={dismiss}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#191C27',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: style.color,
            paddingHorizontal: 16,
            paddingVertical: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Ionicons name={style.icon} size={26} color={style.color} />
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: '#E8EAF3', fontWeight: '700', fontSize: 15 }}
            >
              {feedback.title}
            </Text>
            {!!feedback.message && (
              <Text
                style={{
                  color: '#9BA1B8',
                  fontSize: 13,
                  marginTop: 2,
                  lineHeight: 18,
                }}
              >
                {feedback.message}
              </Text>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  )
}
