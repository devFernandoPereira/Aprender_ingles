import 'react-native-gesture-handler'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import HomeScreen, { HomeHeaderRight } from './src/screens/HomeScreen'
import WeekScreen from './src/screens/WeekScreen'
import DayScreen from './src/screens/DayScreen'
import VocabScreen from './src/screens/VocabScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import FeedbackToast from './src/shared/components/FeedbackToast'
import { ProgressProvider, useProgress } from './src/shared/context/ProgressContext'
import { styles } from './src/shared/styles/AppStyles'
import { colors } from './src/shared/styles/theme'
import { WEEKS } from './src/data/plan'

const Stack = createNativeStackNavigator()

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.line,
  },
}

function AppContent() {
  const { loading } = useProgress()

  if (loading) {
    return (
      <View style={[styles.appContainer, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Rota B1 → C2',
            headerRight: () => <HomeHeaderRight navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Week"
          component={WeekScreen}
          options={({ route }) => ({ title: `Semana ${route.params.w + 1} · ${WEEKS[route.params.w].s}` })}
        />
        <Stack.Screen
          name="Day"
          component={DayScreen}
          options={({ route }) => ({
            title: `Sem ${route.params.w + 1} · ${WEEKS[route.params.w].days[route.params.d].d}`,
          })}
        />
        <Stack.Screen name="Vocab" component={VocabScreen} options={{ title: 'Vocabulário' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <View style={styles.appContainer}>
          <StatusBar style="light" />
          <AppContent />
          <FeedbackToast />
        </View>
      </ProgressProvider>
    </SafeAreaProvider>
  )
}
