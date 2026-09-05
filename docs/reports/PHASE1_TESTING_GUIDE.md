# Phase 1 Testing Guide - Supabase Migration

## Overview
This guide covers end-to-end testing of SmartBoard's migration from localStorage to Supabase, including Realtime subscriptions and Nico memory integration.

**Estimated testing time:** 45-60 minutes

---

## Pre-Testing Setup

### 1. Apply Database Migration
```bash
cd /Users/home/Desktop/edutechlife/edutechlife-backend

# Push migration to Supabase
supabase db push

# Verify tables were created
supabase db list
```

Expected tables: `students`, `sessions`, `points_history`, `vak_results`, `conversations`, `academic_context`, `achievements`, `learning_streaks`

### 2. Install Dependencies
```bash
cd /Users/home/Desktop/edutechlife/edutechlife-frontend

# React Query should already be in package.json
npm install

# Verify React Query installed
npm list @tanstack/react-query
```

### 3. Start Frontend Dev Server
```bash
npm run dev

# Should start on http://localhost:5173
```

### 4. Verify Environment Variables
Ensure `.env.local` has:
```
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## Testing Suite

### TEST GROUP 1: Context Layer (useSmartBoardSupabase)

#### Test 1.1: Initial Data Load
**Steps:**
1. Open http://localhost:5173/smartboard/dashboard
2. Open DevTools → Application → Local Storage
3. Verify NO `edutechlife_*` keys in localStorage
4. Check Network tab → should see query to `students` table
5. Wait 2-3 seconds for data to load

**Expected Results:**
- ✓ Dashboard displays without localStorage
- ✓ No localStorage keys created
- ✓ Data loads from Supabase (check Network tab)
- ✓ Points/VAK/streak visible

#### Test 1.2: Add Points Mutation
**Steps:**
1. Click "Complete Lesson" or equivalent action that adds points
2. Check DevTools Network → should see INSERT to `points_history`
3. Check Application → Supabase tables → points_history row added
4. Refresh page
5. Points should persist

**Expected Results:**
- ✓ Points mutation succeeds
- ✓ Data saved to Supabase (not localStorage)
- ✓ After refresh, points still visible
- ✓ No localStorage fallback

#### Test 1.3: VAK Result Persistence
**Steps:**
1. Complete VAK test or set VAK manually
2. Check Network tab → INSERT to `vak_results` table
3. Close tab completely
4. Reopen dashboard
5. VAK should be loaded and displayed

**Expected Results:**
- ✓ VAK result saved to Supabase
- ✓ VAK loads on page reload
- ✓ Correct learning style displayed

#### Test 1.4: Session Tracking
**Steps:**
1. Create a new study session (select subject, click start)
2. Network tab should show INSERT to `sessions`
3. Add some points during session
4. End session
5. Check `sessions` table in Supabase → session logged

**Expected Results:**
- ✓ Session created in DB
- ✓ Points tracked to session
- ✓ Duration recorded

---

### TEST GROUP 2: Parent Dashboard Realtime

#### Test 2.1: Live Online Status
**Setup:** Two browser windows
- **Browser A:** Parent at http://localhost:5173/smartboard/parent-dashboard
- **Browser B:** Student at http://localhost:5173/smartboard/dashboard

**Steps:**
1. In Browser A (Parent): Open DevTools → Network
2. Watch for subscriptions to `students` table
3. In Browser B (Student): Start a study session
4. In Browser A: Within 1-2 seconds, should see:
   - "Online Now" badge appears
   - Green dot next to student name
   - Current time shows

**Expected Results:**
- ✓ Realtime subscription active (check Network)
- ✓ Online status updates within 1s
- ✓ Badge shows correctly
- ✓ No localStorage involved

#### Test 2.2: Live Session Activity
**Steps:**
1. Keep Browser A (Parent) and Browser B (Student) open
2. Parent watches the activity panel
3. Student completes a lesson and earns points
4. Parent dashboard should update with:
   - Current subject
   - Points earned
   - Session duration
   - Timestamp

**Expected Results:**
- ✓ New activity appears in parent dashboard
- ✓ Updates within 1-2 seconds
- ✓ Subject name correct
- ✓ Points match what student earned

#### Test 2.3: Live Points History
**Steps:**
1. Student earns 10 points (complete 2 lessons)
2. Parent dashboard points chart should update live
3. Check that each point addition appears

**Expected Results:**
- ✓ Points increment in real-time
- ✓ No manual refresh needed
- ✓ Chart updates reflect new data
- ✓ Latency < 1 second

#### Test 2.4: Offline/Online Transition
**Steps:**
1. In Browser A (Parent): Watch data updates
2. In Browser B (Student): Go offline (DevTools → Offline)
3. Student continues studying (data cached locally)
4. Student goes back online
5. Parent dashboard should show all queued changes

**Expected Results:**
- ✓ Student app continues working offline
- ✓ Parent eventually sees all changes
- ✓ No data loss on reconnect
- ✓ Sync completes within 5s

---

### TEST GROUP 3: Nico Memory & Academic Context

#### Test 3.1: Context Loading on Chat Init
**Steps:**
1. Student has:
   - 50+ points earned
   - VAK test completed (e.g., Visual style)
   - 2-3 lessons completed
2. Open Nico coach chat for first time
3. Wait 1-2 seconds for context to load
4. Check DevTools Network → should see query to `students`, `academic_context`, `sessions`

**Expected Results:**
- ✓ Nico loads student context (< 2s)
- ✓ System prompt includes:
  - Student's name
  - VAK style (Visual/Auditory/Kinesthetic)
  - Current performance level
  - Weak areas detected
  - Recent lessons studied
- ✓ Nico references this context in responses

#### Test 3.2: Nico Personalization
**Steps:**
1. Nico loaded with student's context
2. Ask Nico: "How can I improve at math?"
3. Nico should:
   - Reference student's previous math lessons
   - Suggest learning style-specific approach
   - Mention their VAK style
   - Suggest next steps based on performance

**Expected Results:**
- ✓ Nico acknowledges student's learning style
- ✓ Personalized recommendations
- ✓ References actual student data
- ✓ Contextual and relevant responses

#### Test 3.3: Conversation Persistence
**Steps:**
1. Chat with Nico (5-10 messages back and forth)
2. Close the chat panel
3. Reopen Nico chat (same session)
4. Previous messages should appear
5. Nico should continue conversation context

**Expected Results:**
- ✓ Conversation history loads
- ✓ Previous messages visible
- ✓ Nico continues from where it left off
- ✓ Context maintained

#### Test 3.4: Multi-Session Memory
**Steps:**
1. Chat with Nico, close browser completely
2. Next day (or after 1 hour), reopen app
3. Open Nico chat
4. Nico should:
   - Greet student by name
   - Reference yesterday's conversation
   - Show "Last session: [date/time]"
   - Continue helping from where left off

**Expected Results:**
- ✓ Conversation persisted to Supabase
- ✓ Loaded on new session
- ✓ Nico remembers previous context
- ✓ Multi-session continuity works

#### Test 3.5: Emotional Context
**Steps:**
1. Send Nico messages like:
   - "I'm struggling with this"
   - "This is too easy"
   - "I'm getting frustrated"
2. Nico should detect emotional context
3. Check Supabase `conversations` table → `emotional_context` column

**Expected Results:**
- ✓ Nico detects emotional cues
- ✓ Responds empathetically
- ✓ Emotional context saved to DB
- ✓ Can be used for future interactions

---

### TEST GROUP 4: Integration Testing

#### Test 4.1: Full User Journey
**Scenario:** New student signs up, completes lesson, parent monitors

**Steps:**
1. Student signs up/logs in
2. Completes VAK test
3. Starts first lesson
4. Parent logs in (different window)
5. Parent sees:
   - Child "Online Now"
   - Current subject
   - Points earned in real-time
6. Student opens Nico chat
7. Nico greets student by name
8. Student and parent both refresh pages
9. Data persists

**Expected Results:**
- ✓ All systems work together
- ✓ No data inconsistencies
- ✓ Realtime updates work
- ✓ Nico memory intact
- ✓ Data survives page refresh

#### Test 4.2: Performance Benchmarks
**Metrics to measure:**
1. **Initial Load:** Dashboard loads in < 2 seconds
2. **Realtime Latency:** Parent sees data within 1 second of student action
3. **Nico Context Load:** < 1.5 seconds
4. **Query Performance:** Supabase queries complete in < 500ms

**How to measure:**
- DevTools → Performance tab → record
- Network tab → check request times
- Lighthouse audit

**Expected Results:**
- ✓ Initial load < 2s
- ✓ Realtime latency < 1s
- ✓ No UI jank during sync
- ✓ Smooth animations

#### Test 4.3: Error Handling
**Test scenarios:**
1. Network timeout: API doesn't respond
2. DB error: Invalid query
3. Permission error: RLS policy blocks access
4. Nico offline: Chat fails gracefully

**Expected Results:**
- ✓ Graceful error messages
- ✓ Retry logic works
- ✓ User not left in broken state
- ✓ Console logs helpful error info

---

## Test Report Template

Create a file `PHASE1_TEST_REPORT.md` with:

```markdown
# Phase 1 Test Report
Date: [DATE]
Tester: [NAME]
Duration: [TIME SPENT]

## Environment
- Browser: [Chrome/Firefox/Safari + version]
- Device: [Mac/Windows/Linux]
- Frontend version: [commit hash]
- Supabase project: [project name]

## Test Results Summary
- Total tests: XX
- Passed: XX ✓
- Failed: XX ✗
- Skipped: XX

## Test Group 1: Context Layer
- [x] Test 1.1 - Initial Data Load: PASS
- [x] Test 1.2 - Add Points: PASS
- [ ] Test 1.3 - VAK Persistence: FAIL - [reason]
- ...

## Test Group 2: ParentDashboard Realtime
- [x] Test 2.1 - Online Status: PASS
- [x] Test 2.2 - Session Activity: PASS
- ...

## Test Group 3: Nico Memory
- [x] Test 3.1 - Context Loading: PASS
- [x] Test 3.2 - Personalization: PASS
- ...

## Test Group 4: Integration
- [x] Test 4.1 - Full Journey: PASS
- [x] Test 4.2 - Performance: PASS
- ...

## Issues Found
1. [Issue description] - Severity: High/Medium/Low - Resolution: [fix applied/pending]
2. ...

## Screenshots
[Include screenshots of key tests]

## Recommendations
- Priority 1: [Action item]
- Priority 2: [Action item]

## Sign-off
Tester: _______________
Date: _______________
```

---

## Troubleshooting

### Issue: localStorage still being used
**Debug:**
```javascript
// In DevTools console
Object.keys(localStorage).filter(k => k.includes('edutechlife'))
// Should return [] (empty array)
```

### Issue: Realtime not updating
**Debug:**
1. Check DevTools → Network → Supabase websocket connection
2. Should see frame types: `subscription`, `access_token`, `update`
3. If no websocket, check:
   - Supabase Realtime enabled in project settings
   - `VITE_SUPABASE_URL` correct

### Issue: Nico not loading context
**Debug:**
```javascript
// In useNicoContext, log what's loaded
console.log('Student context:', studentContext)
console.log('System prompt:', systemPrompt)
```

### Issue: Data not persisting across sessions
**Debug:**
1. Check `useSmartBoardSupabase.ts` initialization
2. Verify `queryClient.setQueryData()` called
3. Check Supabase table has data
4. Verify RLS policies allow read access

---

## Sign-off Checklist

Before marking Phase 1 complete:

- [ ] All 4 test groups executed
- [ ] No HIGH severity issues remain
- [ ] Realtime latency < 1 second
- [ ] Zero localStorage usage
- [ ] Nico loads context within 1.5s
- [ ] Parent dashboard updates live
- [ ] No console errors in browser
- [ ] Test report documented
- [ ] Performance benchmarks met
- [ ] Ready for Phase 2 (Emotional tracking & News Hub)

---

## Next Steps (Phase 2)

Once Phase 1 tests pass:
1. Implement emotional check-ins
2. Add News Hub with article fetching
3. Create podcast generator
4. Set up advanced analytics

Estimated timeline: 2-3 weeks
