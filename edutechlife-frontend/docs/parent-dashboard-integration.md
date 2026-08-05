# SmartBoard Parent Dashboard Integration

## Overview

The Parent Dashboard is a comprehensive monitoring platform for parents/guardians to track their children's academic progress on SmartBoard. It integrates seamlessly with the main SmartBoard application while maintaining independent styling and functionality.

**Route:** `/smartboard/padres`  
**Access:** Role-protected (requires `smartboard` role)  
**Status:** Production-ready

---

## Architecture

### Component Structure

```
src/components/pages/smartBoardParentDashboard/
├── SmartBoardParentDashboard.jsx (main container, ~423 lines)
└── components/
    ├── ParentControls.jsx (live presence bar & activity log)
    ├── ParentStats.jsx (stat cards, charts, progress bars)
    ├── ParentChildrenList.jsx (children management)
    ├── WeeklyReportCard.jsx (email report generation)
    └── WellbeingCard.jsx (AI wellbeing monitoring status)
```

### Data Flow

1. **Authentication**: User auth token from `useAuthIdentity()` hook
2. **localStorage Data**: Loads student metrics from prefixed localStorage keys
3. **Supabase Realtime**: Subscriptions to:
   - `activity_log` table (INSERT events)
   - `smartboard_sessions` (live sessions)
   - `smartboard_points_history` (live points)
4. **State Management**: Local React state + Supabase subscriptions

---

## Features

### 1. Live Presence Bar
- Real-time online/offline status with animated indicator
- Current activity display (currently studying topic)
- Today's session count & active minutes
- Streak counter with emoji
- Timeline of 8 most recent sessions

**Colors:** #4DA8C4 (active), #94A3B8 (inactive)

### 2. KPI Cards (6-column responsive grid)
- **Puntos**: Total XP + level badge (emoji + name)
- **Misiones**: Completed/Total + pending count
- **Tiempo activo**: Minutes + hours totals
- **Progreso**: Average % across all subjects
- **Racha**: Current streak (🔥) + longest streak
- **Materias**: Active subject count/total

**Animation:** Staggered entrance with spring physics

### 3. VAK Profile Visualization
- Three scoring bars (Visual, Auditory, Kinesthetic)
- Percentage values with color-coded bars
- Predominant learning style badge

### 4. Charts
- **14-Day Points History**: Bar chart with hover tooltips
- **Subject Progress**: Horizontal progress bars per subject

### 5. Activity Log & Notifications
- Last 10 activities with timestamps
- Real-time pulse notification on new activity
- Status icons (completed ✓, in-progress ⧗)
- Streaks and subject highlights

### 6. Weekly Email Report
- One-click email generation
- Includes: points, days active, streak, subjects
- Async API call with loading states
- Success/error feedback

### 7. Wellbeing Monitoring
- Trust signal: AI is monitoring the child's emotional state
- Aggregate-only: never shows sensitive content
- Status: "todo tranquilo" or "estuvimos pendientes"
- Fails soft: always shows reassurance, even if API unavailable

---

## Styling & Design System

### Color Palette

| Use Case | Primary | Secondary | Accent |
|----------|---------|-----------|--------|
| Primary | #004B63 | #4DA8C4 | #66CCCC |
| Background | #F8FAFC | #F1F5F9 | — |
| Borders | #E2E8F0 | #94A3B8 | — |
| Special | #FFD166 (XP) | #FF6B9D (Streak) | #66CCCC (Active) |

### Typography

- **Font Family**: Montserrat (inherited from SmartBoard)
- **Headings**: font-black (#004B63)
- **Labels**: font-medium, smaller weights
- **Stats**: font-bold, large sizes

### Responsive Design

- Mobile-first approach
- Grid column adaptation
- Touch-friendly tap targets (min 44px)
- Sidebar navigation on desktop

---

## Integration Points

### 1. Routing (src/routes/index.jsx)

```jsx
<Route
  path="smartboard/padres"
  element={
    <RoleProtectedRoute requiredRole="smartboard">
      <SectionErrorBoundary name="SmartBoardParentDashboard">
        <Suspense fallback={<SmartBoardSkeleton />}>
          <SmartBoardParentDashboard />
        </Suspense>
      </SectionErrorBoundary>
    </RoleProtectedRoute>
  }
/>
```

### 2. Sidebar Navigation (src/components/SidebarNavigation.jsx)

Added "Panel de Padres" button that navigates to `/smartboard/padres`:

```jsx
<motion.button
  onClick={() => onNavigate?.('/smartboard/padres')}
  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4DA8C4]/10 border border-[#4DA8C4]/30 rounded-xl hover:bg-[#4DA8C4]/20 transition-all duration-300"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
>
  <Users className="w-4 h-4 text-[#4DA8C4]" />
  <span className="text-sm font-semibold text-[#4DA8C4] font-open-sans">
    Panel de Padres
  </span>
</motion.button>
```

### 3. Authentication

- Protected by `RoleProtectedRoute` requiring `smartboard` role
- Uses Supabase JWT token from `useAuthIdentity()`
- Redirects to login if not authenticated

### 4. Supabase Integration

**Tables:**
- `activity_log`: Parent activity tracking
- `smartboard_sessions`: Live session data
- `smartboard_points_history`: Point history
- `smartboard_wellbeing`: Wellbeing monitoring status

**Realtime Subscriptions:**
- `parent-activity-live` channel for real-time updates

---

## Data Structures

### Activity Log Entry
```typescript
{
  id: string;
  user_id: string;
  activity: string;
  subject?: string;
  timestamp: string;
  status: 'completed' | 'in-progress';
}
```

### Wellbeing Status
```typescript
{
  status: 'calm' | 'attention';
  lastAlertAt?: string;
}
```

### Session
```typescript
{
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  subject?: string;
}
```

---

## Performance Optimizations

1. **Lazy Loading**: Component lazy-loaded in routes
2. **Memoization**: StatCard, TabButton, etc. use React.memo
3. **Code Splitting**: Realtime subscriptions created on-demand
4. **Polling Interval**: localStorage checked every 5 seconds
5. **Data Trimming**: Activity log limited to 10 items in memory

---

## Security Considerations

1. **Role-Based Access**: Only `smartboard` role can access
2. **Token-Based Auth**: Uses Supabase JWT in Authorization header
3. **RLS Policies**: Supabase table policies enforce user_id filtering
4. **Sensitive Data**: Wellbeing status is aggregate-only (never exposes child's content)
5. **Error Handling**: Fails soft on API errors, continues with cached data

---

## Testing Checklist

- [ ] Route protection: Unauthenticated users redirected to login
- [ ] Role protection: Non-smartboard users see error boundary
- [ ] Live presence: Online/offline status updates in real-time
- [ ] Charts: Data renders correctly with animations
- [ ] Email report: Weekly report generation succeeds
- [ ] Wellbeing card: Loads status without blocking dashboard
- [ ] Dark mode: All components visible in dark mode
- [ ] Responsive: Mobile, tablet, desktop layouts work
- [ ] Accessibility: WCAG AA compliance, screen reader support

---

## Deployment

1. **Build**: `npm run build` (includes prerendering & sitemap generation)
2. **Testing**: Run test suite before merge
3. **Staging**: Deploy to staging environment first
4. **Production**: Once verified, deploy to Vercel via git push

---

## Future Enhancements

1. **Notifications**: Push notifications for activity milestones
2. **Advanced Analytics**: Detailed learning style recommendations
3. **Parent-Child Messaging**: In-app messaging system
4. **Goal Setting**: Parent-defined learning goals & tracking
5. **Progress Predictions**: ML-based progress forecasting

---

## Troubleshooting

### Dashboard not loading
- Check authentication token validity
- Verify `smartboard` role is assigned to user
- Check browser console for Supabase connection errors

### Realtime updates not working
- Verify Supabase project is running
- Check network tab for websocket connections
- Ensure firewall allows Supabase realtime port

### Charts not rendering
- Confirm localStorage data exists
- Check browser DevTools for JavaScript errors
- Verify chart library (framer-motion) is loaded

---

## Related Documentation

- [SmartBoard Architecture](./smartboard.md)
- [Supabase Setup Guide](./supabase.md)
- [Authentication Flow](./auth.md)
- [Design System](./design-system.md)
