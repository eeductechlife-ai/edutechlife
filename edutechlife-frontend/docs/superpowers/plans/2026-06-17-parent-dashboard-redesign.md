# Parent Dashboard Redesign Implementation Plan

## Goal
Transform the 282-line parent dashboard into a rich, real-time monitoring tool with live presence tracking, activity feed, smart alerts, and international-standard UX.

## Approach A (Hybrid): localStorage polling + Supabase Realtime

## Files to modify
1. `src/components/kids-dashboard/SmartBoardKidsDashboard.jsx` — add ~10 lines (activeTab localStorage tracker)
2. `src/components/pages/SmartBoardParentDashboard.jsx` — full rewrite (~450-500 lines)
3. `src/i18n/es.json` — add ~15 new translation keys
4. `src/i18n/en.json` — add ~15 new translation keys

## Changes

### 1. SmartBoardKidsDashboard.jsx: Track current tab + last activity

After line 807 (`const [activeTab, setActiveTab] = useState('inicio');`), add:
```jsx
useEffect(() => {
  try {
    localStorage.setItem('edutechlife_current_tab', activeTab);
    localStorage.setItem('edutechlife_last_activity', new Date().toISOString());
  } catch {}
}, [activeTab]);
```

### 2. SmartBoardParentDashboard.jsx: Full rewrite

Structure:
```
Layout: min-h-screen bg-[#F8FAFC] max-w-6xl mx-auto p-4 md:p-8
├── Header: Back button + title + subtitle
├── Section 1: Live Presence Hero
│   ├── Connection status (🟢/⚪) calculated from last activity < 10min
│   ├── Current activity: reads edutechlife_current_tab from localStorage
│   ├── Today stats: sessions count, active minutes, streak
│   └── Timeline: visual bar of today's sessions
├── Section 2: KPI Grid (6 cards in 2x3 or 3x2)
│   ├── Points + Level emoji
│   ├── Missions (completed/total)
│   ├── Active time today
│   ├── Average progress %
│   ├── Current streak 🔥
│   └── Subjects with progress > 0%
├── Section 3: Live Activity Feed
│   ├── Reads localStorage points_history
│   ├── Shows last 20 entries with reason, points, timestamp
│   └── Auto-updates every 5 seconds
├── Section 4: Two-column Analytics
│   ├── Left: Points chart (14 days bar chart)
│   ├── Right: Subject progress bars
│   └── VAK profile (if available)
├── Section 5: Smart Alerts
│   ├── if streak > 0 → congratulate
│   ├── if no activity today → "no activity yet"
│   ├── if subjects with 0% → suggest exploration
│   └── if many points today → celebrate
└── Footer: auto-update note
```

### 3. New translation keys

es.json additions (insert after `smartboard.connected_ialab` at line 1870):
```json
"smartboard.parent_online": "🟢 Conectado ahora",
"smartboard.parent_offline": "⚪ Desconectado",
"smartboard.parent_last_active": "Última actividad: {time}",
"smartboard.parent_current_tab": "Actividad actual",
"smartboard.parent_today_sessions": "Sesiones hoy",
"smartboard.parent_active_minutes": "Minutos activos",
"smartboard.parent_streak_days": "Racha de {days} días",
"smartboard.parent_no_activity_today": "Sin actividad hoy",
"smartboard.parent_congrats_streak": "¡{days} días seguidos! Sigue así 🔥",
"smartboard.parent_try_subjects": "Explorar nuevas materias",
"smartboard.parent_sessions_today": "Sesiones de hoy",
"smartboard.parent_no_sessions": "No hay sesiones registradas hoy",
"smartboard.parent_alert_title": "Alertas Inteligentes",
"smartboard.parent_alert_streak": "Racha activa de {days} días!",
"smartboard.parent_alert_inactive": "Hoy no ha registrado actividad todavía",
"smartboard.parent_alert_points": "Hoy ha ganado {points} puntos!",
"smartboard.parent_alert_explore": "Tiene materias sin explorar"
```

en.json additions:
```json
"smartboard.parent_online": "🟢 Connected now",
"smartboard.parent_offline": "⚪ Offline",
"smartboard.parent_last_active": "Last activity: {time}",
"smartboard.parent_current_tab": "Current activity",
"smartboard.parent_today_sessions": "Sessions today",
"smartboard.parent_active_minutes": "Active minutes",
"smartboard.parent_streak_days": "{days}-day streak",
"smartboard.parent_no_activity_today": "No activity today",
"smartboard.parent_congrats_streak": "{days} day streak! Keep it up 🔥",
"smartboard.parent_try_subjects": "Explore new subjects",
"smartboard.parent_sessions_today": "Today's sessions",
"smartboard.parent_no_sessions": "No sessions recorded today",
"smartboard.parent_alert_title": "Smart Alerts",
"smartboard.parent_alert_streak": "Active {days}-day streak!",
"smartboard.parent_alert_inactive": "No activity recorded today yet",
"smartboard.parent_alert_points": "Earned {points} points today!",
"smartboard.parent_alert_explore": "Has unexplored subjects"
```

### 4. Verify build

Run: `npx vite build` from edutechlife-frontend directory.
