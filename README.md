# Rota B1 → C2 (app)

App pessoal de Android com o plano de 12 semanas de inglês (Natural Method, 60 min ativos por dia).
Usa o mesmo motor do app da igreja em `../aplicativo` (Expo SDK 54, React Navigation, AsyncStorage,
notificações, FeedbackToast), sem Firebase, login nem pagamentos: tudo fica salvo no próprio celular.

## Rodar no celular (desenvolvimento)

```bash
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go**. Ele precisa ser a versão do SDK 54; veja a seção 1 do
`../aplicativo/BUILD.md` se aparecer "incompatible with this version of Expo Go".

## Instalar de verdade (APK, sem Expo Go)

```bash
npx eas-cli build --profile preview --platform android
```

Na primeira vez, o EAS pede login e cria o projeto (`eas init`). No fim do build, ele dá um link para
baixar o `.apk`. Abra o link no celular e instale, permitindo "instalar de fontes desconhecidas".

## Onde mexer

| O quê | Arquivo |
|---|---|
| Conteúdo das semanas (temas, gramática, vocabulário, recursos) | `src/data/plan.js` |
| Atividades de cada dia da semana (seg a dom) | `buildDays()` em `src/data/plan.js` |
| Cores | `src/shared/styles/theme.js` |
| Progresso salvo | `src/shared/context/ProgressContext.js` |
| Lembrete diário | `src/shared/services/notifications.js` |

O conteúdo foi extraído da página https://claude.ai/artifact/MZr2RdaaBRQNXPjTLuYREv. O progresso
marcado lá **não** é importado: o app começa do zero.
