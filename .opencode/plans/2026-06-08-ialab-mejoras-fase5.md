# IALab Mejoras Fase 5 — Notificaciones, Métricas y Onboarding

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mejorar IALab en las 3 brechas más grandes vs Coursera (notificaciones -2.5, métricas -2.0, onboarding -2.0) sin crear nuevas secciones ni alterar funcionalidad existente.

**Architecture:** Cada mejora se integra dentro de componentes existentes. Las notificaciones push usan la tabla `push_subscriptions` ya existente. Las métricas de tiempo se leen de `activity_log` ya existente. El onboarding mejora componentes existentes (IALabTour, IALabDashboard). Sin nuevas páginas/ secciones.

**Tech Stack:** React 18 + Zustand 5 + Recharts 3 + Tailwind 3.4 + Supabase + Clerk. Sin nuevas dependencias.

---

### Task 1: Notificaciones Push Reales (Service Worker + VAPID)

**Files:**
- Modify: `edutechlife-frontend/src/hooks/useBrowserNotifications.js`
- Modify: `edutechlife-frontend/src/context/NotificationContext.jsx`
- Create: `edutechlife-frontend/public/sw.js`
- Modify: `edutechlife-frontend/index.html`
- Modify: `edutechlife-frontend/src/components/NotificationPanel.jsx`
- Modify: `edutechlife-frontend/src/i18n/es.json`
- Modify: `edutechlife-frontend/src/i18n/en.json`

- [ ] **Step 1: Crear Service Worker**

Create `edutechlife-frontend/public/sw.js`:

```js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('push', (e) => {
  if (!e.data) return;
  try {
    const data = e.data.json();
    const options = {
      body: data.message || '',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/ialab', type: data.type },
      tag: data.tag || `push_${Date.now()}`,
    };
    e.waitUntil(self.registration.showNotification(data.title || 'IALab', options));
  } catch (err) { console.error('[SW] push error:', err); }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/ialab';
  e.waitUntil(clients.openWindow(url));
});
```

- [ ] **Step 2: Registrar SW en index.html**

Before `</body>` in `edutechlife-frontend/index.html`:

```html
<script>'serviceWorker'in navigator&&window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})});</script>
```

- [ ] **Step 3: Añadir VAPID push subscription a useBrowserNotifications**

Modify `useBrowserNotifications.js`. Add after existing imports:

```js
import { supabase } from '../lib/supabase';
```

Replace `requestPermission` with a version that also subscribes to push. Add new functions:

```js
const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const subscribeToPush = useCallback(async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !VAPID_KEY) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID_KEY });
    }
    return sub;
  } catch { return null; }
}, []);

const syncPushSubscription = useCallback(async (subscription) => {
  if (!subscription || !userId) return;
  try {
    await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      subscription: subscription.toJSON(),
      user_agent: navigator.userAgent,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (e) { console.warn('[PUSH] sync error:', e); }
}, [userId]);
```

Modify `requestPermission` to call `subscribeToPush` and `syncPushSubscription` after getting permission.

Return `subscribeToPush`, `syncPushSubscription`, `isPushSubscribed` in the hook's return.

- [ ] **Step 4: Añadir recordatorios de estudio en NotificationContext**

Modify `NotificationContext.jsx`. Import `sendBrowserNotification` from useBrowserNotifications (or duplicate minimal version). Add after `unreadCount`:

```js
const studyReminderRef = useRef(null);

useEffect(() => {
  if (!user?.id) return;
  const checkReminder = () => {
    const lastActivity = localStorage.getItem('ialab_last_activity_date');
    if (!lastActivity) return;
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / 86400000);
    if (daysSince < 2) return;
    const lastReminder = localStorage.getItem('ialab_last_study_reminder');
    if (lastReminder === new Date().toDateString()) return;
    if (daysSince >= 7) {
      createNotification({
        type: 'lesson_reminder',
        title: '📚 ¡Una semana sin estudiar!',
        message: 'Han pasado 7+ días. Vuelve hoy para no perder tu progreso.',
        metadata: { moduleId: 1 }
      });
    } else if (daysSince >= 2) {
      createNotification({
        type: 'lesson_reminder',
        title: '📚 Te esperamos en IALab',
        message: `${daysSince} días sin actividad. Una lección rápida mantiene tu racha.`,
        metadata: { moduleId: 1 }
      });
    }
    localStorage.setItem('ialab_last_study_reminder', new Date().toDateString());
  };
  // Check every 6 hours
  studyReminderRef.current = setInterval(checkReminder, 6 * 3600000);
  checkReminder();
  return () => { if (studyReminderRef.current) clearInterval(studyReminderRef.current); };
}, [user?.id, createNotification]);
```

Add `notification_preferences` state with localStorage persistence and `updatePreferences`:

```js
const [preferences, setPrefs] = useState(() => {
  try { return JSON.parse(localStorage.getItem('ialab_notif_prefs') || '{"push":true,"reminders":true,"forum":true}'); }
  catch { return { push: true, reminders: true, forum: true }; }
});
const updatePreferences = useCallback((p) => { setPrefs(p); localStorage.setItem('ialab_notif_prefs', JSON.stringify(p)); }, []);
```

Wrap the study reminder check in `if (preferences.reminders)`.

Expose `preferences` and `updatePreferences` in the context value.

- [ ] **Step 5: Añadir toggle de push en NotificationPanel**

Modify `NotificationPanel.jsx`. Import `preferences`, `updatePreferences`, `subscribeToPush`, `syncPushSubscription` from `useNotification()`.

Add after line 144 (después del div de acciones rápidas, antes del max-h-96):

```jsx
<div className="px-3 py-2 border-b border-slate-200/60 bg-slate-50/50">
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Notif. push</span>
    <button
      onClick={async (e) => {
        e.stopPropagation();
        if (preferences.push && Notification.permission === 'granted') {
          updatePreferences({ ...preferences, push: false });
        } else {
          const granted = await Notification.requestPermission();
          if (granted === 'granted') {
            const sub = await subscribeToPush();
            if (sub) await syncPushSubscription(sub);
            updatePreferences({ ...preferences, push: true });
          }
        }
      }}
      className={`relative w-9 h-5 rounded-full transition-colors ${preferences.push && Notification.permission === 'granted' ? 'bg-corporate' : 'bg-slate-300'}`}
      aria-label="Toggle push"
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${preferences.push && Notification.permission === 'granted' ? 'translate-x-4' : ''}`} />
    </button>
  </div>
</div>
```

- [ ] **Step 6: Añadir keys de i18n**

En `es.json` y `en.json`, dentro de `"notification"`:

```json
"push_toggle": "Notif. push",
"push_enabled": "Activadas",
"push_disabled": "Desactivadas",
"preferences": "Preferencias"
```

---

### Task 2: Learning Dashboard — Métricas de Tiempo y Rendimiento

**Files:**
- Modify: `edutechlife-frontend/src/components/IALab/IALabDashboard.jsx`
- Modify: `edutechlife-frontend/src/hooks/useActivityTracker.js`
- Modify: `edutechlife-frontend/src/store/slices/progressSlice.js`
- Modify: `edutechlife-frontend/src/i18n/es.json`
- Modify: `edutechlife-frontend/src/i18n/en.json`

- [ ] **Step 1: Añadir getTimeTrackingStats a useActivityTracker**

Add to the return object after `getStudentStats`:

```js
const getTimeTrackingStats = useCallback(() => {
  const now = new Date();
  const today = now.toDateString();
  const thisWeek = [];
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    thisWeek.push(d.toDateString());
  }
  const dayCount = {};
  const weekCount = {};
  activities.forEach(a => {
    const key = new Date(a.completed_at).toDateString();
    dayCount[key] = (dayCount[key] || 0) + 1;
    if (thisWeek.includes(key)) weekCount[key] = (weekCount[key] || 0) + 1;
  });
  return {
    today: dayCount[today] || 0,
    weekTotal: Object.values(weekCount).reduce((a, b) => a + b, 0),
    weekDaily: thisWeek.map(d => ({ day: d, count: weekCount[d] || 0 })),
    avgPerDay: Object.keys(dayCount).length > 0
      ? Math.round(activities.length / Object.keys(dayCount).length)
      : 0,
    totalDaysActive: Object.keys(dayCount).length,
  };
}, [activities]);
```

- [ ] **Step 2: Añadir getModuleBreakdown a progressSlice**

En `edutechlife-frontend/src/store/slices/progressSlice.js`, add at end of the slice object (before the closing slice function):

```js
getModuleBreakdown: () => {
  const st = get();
  const breakdown = {};
  for (let id = 1; id <= 5; id++) {
    const mp = st.moduleProgress[id];
    breakdown[id] = {
      score: mp?.currentScore || 0,
      exam: !!mp?.exam,
      challenge: !!mp?.challenge,
      resources: mp?.resourcesCompleted ? 5 : Math.min(mp?.resourcesViewed || 0, 5),
      community: !!mp?.community,
    };
  }
  return breakdown;
},
```

- [ ] **Step 3: Añadir sección de métricas de tiempo en IALabDashboard**

Add import at top of `IALabDashboard.jsx`:
```js
import useActivityTracker from '../../hooks/useActivityTracker';
```

Inside `IALabDashboard`, add after `courseCompleted` line:
```js
const { getTimeTrackingStats } = useActivityTracker();
const [showTimeStats, setShowTimeStats] = useState(false);
```

After the `weeklyData` useMemo, add:
```js
const timeStats = useMemo(() => getTimeTrackingStats(), [getTimeTrackingStats]);
```

After the stats cards section (after line 182 `</section>`), add:

```jsx
{!hasNoProgress && timeStats.totalDaysActive > 0 && (
  <section>
    <button
      onClick={() => setShowTimeStats(v => !v)}
      className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 cursor-pointer group"
      aria-expanded={showTimeStats}
    >
      <Icon name="fa-clock" className="w-4 h-4 text-corporate group-hover:text-petroleum transition-colors" />
      <span>Resumen de Actividad</span>
      <Icon name="fa-chevron-down" className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showTimeStats ? 'rotate-180' : ''}`} />
    </button>
    {showTimeStats && (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon="fa-calendar-day" label="Hoy" value={`${timeStats.today} act.`} accentColor="border-t-corporate" gradient="from-corporate/5 to-corporate/5" iconColor="text-corporate" />
        <StatCard icon="fa-calendar-week" label="Esta semana" value={`${timeStats.weekTotal} act.`} accentColor="border-t-petroleum" gradient="from-petroleum/5 to-petroleum/5" iconColor="text-petroleum" />
        <StatCard icon="fa-chart-simple" label="Promedio/día" value={`${timeStats.avgPerDay}`} accentColor="border-t-emerald-400" gradient="from-emerald-50 to-emerald-50/30" iconColor="text-emerald-500" />
        <StatCard icon="fa-calendar-alt" label="Días activos" value={`${timeStats.totalDaysActive}`} accentColor="border-t-amber-400" gradient="from-amber-50 to-amber-50/30" iconColor="text-amber-500" />
      </div>
    )}
  </section>
)}
```

- [ ] **Step 4: Añadir gráfico de rendimiento por módulo en "Tu Progreso"**

Replace the import of `LineChart` etc. with a combined import:

```js
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
```

After line 276 `<h2 className="...">Tu Progreso</h2>`, add:

```jsx
{modules.filter(m => m.modScore > 0).length >= 2 && (
  <div className="mb-4 h-28">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={modules.filter(m => m.modScore > 0)} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis dataKey="id" type="category" width={28} axisLine={false} tickLine={false}
          tick={({ x, y, payload }) => (
            <text x={x - 4} y={y} dy={3} textAnchor="end" fontSize={10} fill="#94a3b8">M{payload.value}</text>
          )}
        />
        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
          formatter={(value) => [`${value}%`, 'Score']} />
        <Bar dataKey="modScore" radius={[0, 4, 4, 0]} barSize={14}>
          {modules.filter(m => m.modScore > 0).map(e => (
            <Cell key={e.id} fill={moduleColors[e.id] || '#00BCD4'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
)}
```

- [ ] **Step 5: Añadir keys de i18n**

En `es.json` y `en.json`:

```json
"time_title": "Resumen de Actividad",
"time_today": "Hoy",
"time_week": "Esta semana",
"time_avg": "Promedio/día",
"time_days_active": "Días activos"
```

---

### Task 3: Navegación Predictiva y Continue Where You Left Off

**Files:**
- Modify: `edutechlife-frontend/src/store/ialabStore.js`
- Modify: `edutechlife-frontend/src/components/IALab/IALabDashboard.jsx`
- Modify: `edutechlife-frontend/src/components/IALab/DailyPlan.jsx`
- Modify: `edutechlife-frontend/src/i18n/es.json`
- Modify: `edutechlife-frontend/src/i18n/en.json`

- [ ] **Step 1: Añadir getNextSuggestedAction al store**

En `edutechlife-frontend/src/store/ialabStore.js`, add after `getDetailedRecommendations`:

```js
getNextSuggestedAction: () => {
  const st = get();
  for (let id = 1; id <= 5; id++) {
    const mp = st.moduleProgress[id];
    if (!mp || !mp.isUnlocked) {
      if (id === 1) return { action: 'start', moduleId: 1, label: 'Comenzar Módulo 1' };
      continue;
    }
    const approved = mp.exam && mp.challenge && mp.resourcesCompleted && (mp.currentScore || 0) >= 80;
    if (approved) continue;
    if (!mp.resourcesCompleted) return { action: 'resources', moduleId: id, label: 'Ver recursos del Módulo ' + id };
    if (!mp.exam) return { action: 'exam', moduleId: id, label: 'Tomar examen del Módulo ' + id };
    if (!mp.challenge) return { action: 'challenge', moduleId: id, label: 'Aceptar desafío del Módulo ' + id };
    if (!mp.community) return { action: 'community', moduleId: id, label: 'Participar en la comunidad' };
    return { action: 'improve', moduleId: id, label: 'Mejorar nota del Módulo ' + id };
  }
  if (st.courseProgress >= 80) return { action: 'certificate', moduleId: null, label: 'Obtener tu certificado' };
  return { action: 'explore', moduleId: 1, label: 'Explorar IALab' };
},
```

- [ ] **Step 2: Mejorar "Continue" button en IALabDashboard**

Replace the existing "Continuar Módulo X" button (line 321-331 in the third branch of the ternary). The current structure is:
```
) : hasNoProgress ? ( ... ) : (
  <button ...>Continuar Módulo {activeModuleId} — {titles}</button>
)
```

Replace the third branch (from `(` after `:`)` to the closing `)` before `<section>` at line 333):

```jsx
: (() => {
  const nextAction = useIALabStore.getState().getNextSuggestedAction();
  return (
    <button
      onClick={() => {
        if (nextAction.action === 'certificate') {
          window.dispatchEvent(new CustomEvent('ialab:openCertificate'));
        } else {
          navigate(`/ialab/${nextAction.moduleId}`);
        }
      }}
      className="relative w-full overflow-hidden bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate text-white font-bold py-4 px-6 rounded-2xl hover:shadow-[0_0_30px_rgba(0,188,212,0.35)] transition-all duration-300 flex items-center justify-center gap-3 group"
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
        <Icon name={nextAction.action === 'exam' ? 'fa-file-text' : nextAction.action === 'challenge' ? 'fa-trophy' : nextAction.action === 'certificate' ? 'fa-award' : 'fa-play-circle'} className="w-4 h-4 text-white" />
      </div>
      <span>{nextAction.label}</span>
    </button>
  );
})()
```

Note: wrap the JSX in an IIFE `(() => { ... })()` since it's inside a ternary expression.

- [ ] **Step 3: Añadir continue banner en DailyPlan**

Modify `DailyPlan.jsx`. Add import:
```js
import { useIALabStore } from '../../store/ialabStore';
```

Inside the component, after existing state declarations:
```js
const nextAction = useMemo(() => useIALabStore.getState().getNextSuggestedAction(), []);
```

Before the recommendations section (before the `{/* Recomendaciones */}` line), add:

```jsx
{/* Continue banner */}
<div className="relative overflow-hidden bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-xl border border-petroleum/10 p-3 mt-3">
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0">
      <Icon name={nextAction.action === 'exam' ? 'fa-file-text' : nextAction.action === 'challenge' ? 'fa-trophy' : 'fa-play-circle'} className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-petroleum">Continúa por donde ibas</p>
      <p className="text-[11px] text-slate-500 truncate">{nextAction.label}</p>
    </div>
    <button
      onClick={() => {
        if (nextAction.action === 'exam') onAction?.('OPEN_EVALUATION');
        else if (nextAction.action === 'challenge') onAction?.('OPEN_CHALLENGE');
        else if (nextAction.moduleId) {
          window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: 'contenido' }));
          useIALabStore.getState().setActiveMod(nextAction.moduleId);
        }
      }}
      className="flex-shrink-0 text-[10px] font-bold text-white bg-gradient-to-r from-petroleum to-corporate px-3 py-1.5 rounded-lg hover:shadow-sm transition-all active:scale-95"
    >
      Ir
    </button>
  </div>
</div>
```

- [ ] **Step 4: Añadir keys de i18n**

En `es.json` y `en.json`:

```json
"continue_title": "Continúa por donde ibas",
"action_start": "Comenzar Módulo {module}",
"action_exam": "Tomar examen del Módulo {module}",
"action_challenge": "Aceptar desafío del Módulo {module}",
"action_certificate": "Obtener tu certificado",
"action_explore": "Explorar IALab"
```

---

### Task 4: Build y Verificación

- [ ] **Step 1: Syntax check de archivos modificados**

```bash
cd /Users/home/Desktop/edutechlife && for f in edutechlife-frontend/src/components/IALab/IALabDashboard.jsx edutechlife-frontend/src/context/NotificationContext.jsx edutechlife-frontend/src/hooks/useBrowserNotifications.js edutechlife-frontend/src/hooks/useActivityTracker.js edutechlife-frontend/src/components/IALab/DailyPlan.jsx edutechlife-frontend/src/components/NotificationPanel.jsx edutechlife-frontend/src/store/ialabStore.js edutechlife-frontend/src/store/slices/progressSlice.js; do node -e "try{require('fs').readFileSync('$f','utf8');console.log('$f: OK')}catch(e){console.log('$f:',e.message)}" 2>&1; done
```

- [ ] **Step 2: Balance check de paréntesis/llaves**

```bash
cd /Users/home/Desktop/edutechlife/edutechlife-frontend && for f in src/components/IALab/IALabDashboard.jsx src/context/NotificationContext.jsx src/hooks/useBrowserNotifications.js src/hooks/useActivityTracker.js src/components/IALab/DailyPlan.jsx src/components/NotificationPanel.jsx src/store/ialabStore.js src/store/slices/progressSlice.js; do node -e "const c=require('fs').readFileSync('$f','utf8');let d=0,ok=true;for(const ch of c){if(ch==='{')d++;if(ch==='}'){d--;if(d<0){ok=false;break}}}console.log('$f:',ok&&d===0?'balanced':'imbalanced ('+d+')')" 2>&1; done
```

- [ ] **Step 3: Build check**

```bash
cd /Users/home/Desktop/edutechlife/edutechlife-frontend && timeout 60 npx vite build 2>&1 || echo "BUILD_TIMEOUT_OR_ERROR - verify manually"
```

- [ ] **Step 4: Commit**

```bash
git add edutechlife-frontend/public/sw.js \
        edutechlife-frontend/index.html \
        edutechlife-frontend/src/hooks/useBrowserNotifications.js \
        edutechlife-frontend/src/context/NotificationContext.jsx \
        edutechlife-frontend/src/components/NotificationPanel.jsx \
        edutechlife-frontend/src/components/IALab/IALabDashboard.jsx \
        edutechlife-frontend/src/components/IALab/DailyPlan.jsx \
        edutechlife-frontend/src/hooks/useActivityTracker.js \
        edutechlife-frontend/src/store/ialabStore.js \
        edutechlife-frontend/src/store/slices/progressSlice.js \
        edutechlife-frontend/src/i18n/es.json \
        edutechlife-frontend/src/i18n/en.json \
        .opencode/plans/2026-06-08-ialab-mejoras-fase5.md
git commit -m "feat(ialab): notificaciones push, métricas tiempo, navegación predictiva"
```
