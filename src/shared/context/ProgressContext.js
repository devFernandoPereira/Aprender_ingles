import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { WEEKS, TOTAL, dayKey } from '../../data/plan'

// Mesmas chaves da versão web, pra facilitar uma migração futura.
const PROGRESS_KEY = 'rota-b1-c2-progress-v1'
const WEEK_KEY = 'rota-b1-c2-week'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [done, setDone] = useState({})
  const [lastWeek, setLastWeek] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const [p, w] = await AsyncStorage.multiGet([PROGRESS_KEY, WEEK_KEY])
        if (p[1]) setDone(JSON.parse(p[1]) || {})
        const n = parseInt(w[1], 10)
        if (n >= 0 && n < WEEKS.length) setLastWeek(n)
      } catch {
        // progresso corrompido ou indisponível: começa do zero
      }
      setLoading(false)
    })()
  }, [])

  const value = useMemo(() => {
    const isDone = (w, d) => !!done[dayKey(w, d)]
    const weekDone = (w) => WEEKS[w].days.filter((_, d) => done[dayKey(w, d)]).length
    const totalDone = Object.keys(done).filter((k) => done[k]).length

    async function toggleDay(w, d) {
      const k = dayKey(w, d)
      const next = { ...done }
      if (next[k]) delete next[k]
      else next[k] = true
      setDone(next)
      try {
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(next))
      } catch {}
      return !!next[k]
    }

    async function rememberWeek(w) {
      setLastWeek(w)
      try {
        await AsyncStorage.setItem(WEEK_KEY, String(w))
      } catch {}
    }

    function nextPending() {
      for (let w = 0; w < WEEKS.length; w++)
        for (let d = 0; d < 7; d++) if (!done[dayKey(w, d)]) return { w, d }
      return null
    }

    async function resetAll() {
      setDone({})
      try {
        await AsyncStorage.removeItem(PROGRESS_KEY)
      } catch {}
    }

    return {
      loading,
      lastWeek,
      totalDone,
      total: TOTAL,
      isDone,
      weekDone,
      toggleDay,
      rememberWeek,
      nextPending,
      resetAll,
    }
  }, [done, lastWeek, loading])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export const useProgress = () => useContext(ProgressContext)
