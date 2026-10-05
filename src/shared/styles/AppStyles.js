import { StyleSheet } from 'react-native'
import { colors, typography } from './theme'

export const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  label: {
    fontSize: typography.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
    fontWeight: typography.weight.semibold,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginTop: 6,
  },
  text: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  link: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.base,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primaryInk,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.base,
  },
  buttonGhost: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonGhostText: {
    color: colors.textPrimary,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.sm,
  },
  bar: {
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.sunk,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
})
