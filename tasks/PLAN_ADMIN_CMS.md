# Implementation Plan: Admin/CMS Contenido (SmartBoard #50)

## Overview
Build a centralized content management system for EdutechLife admins to create, publish, and manage educational content (missions, resources, multimedia). Incremental vertical slices, one per task.

**Total Phases**: 5 | **Estimated Tasks**: 12 | **Timeline**: 2-3 weeks

---

## Dependency Graph

```
Foundation (Auth + DB)
    ↓
Phase 1 (Mission CRUD Backend)
    ↓
Phase 1b (Mission UI)
    ↓
Phase 2 (Resource Upload + Storage)
    ↓
Phase 3 (UI Polish + Preview)
    ↓
Phase 4 (Audit Logging)
    ↓
Phase 5 (Testing + Deployment)
```

---

## Phase 1: Foundation (Admin Auth + Database Schema)

### Task 1.1: Admin Auth & Route Protection
**Objective**: Secure admin routes so only authenticated admins can access CMS
**Acceptance Criteria**:
- ✅ Create `/api/admin/auth/me` endpoint (returns current user + admin status)
- ✅ Implement JWT role check (role = 'admin' or 'content_creator')
- ✅ Create `useAdminAuth()` hook for frontend
- ✅ Protect all `/api/admin/*` routes with auth middleware
- ✅ Redirect non-admins from `/admin/*` pages to home

**Verification**:
- Test unauthorized access returns 403
- Test authenticated admin access succeeds
- Test logout clears session

**Files to Create/Modify**:
- `edutechlife-backend/src/routes/admin.js` (NEW)
- `edutechlife-backend/src/middleware/adminAuth.js` (NEW)
- `edutechlife-frontend/src/hooks/useAdminAuth.js` (NEW)
- `edutechlife-frontend/src/pages/AdminLogin.jsx` (NEW)

---

### Task 1.2: Database Schema (Supabase Migrations)
**Objective**: Create tables for missions, resources, and audit logging
**Acceptance Criteria**:
- ✅ Create `content_missions` table (title, description, objectives, grade, subject, is_published, etc.)
- ✅ Create `content_resources` table (title, type, storage_path, cdn_url, grade, subject, tags)
- ✅ Create `mission_resources` junction table (link missions ↔ resources)
- ✅ Create `content_audit_log` table (immutable audit trail)
- ✅ Add RLS policies (admins read all, students read published only)
- ✅ Migration file follows Supabase convention (timestamp_description.sql)

**Verification**:
- Migrate locally: `supabase db push`
- Verify table structure with `\d table_name` in psql
- Test RLS policies with different user roles

**Files to Create**:
- `supabase/migrations/YYYYMMDD_000_content_missions.sql` (NEW)
- `supabase/migrations/YYYYMMDD_001_content_resources.sql` (NEW)
- `supabase/migrations/YYYYMMDD_002_mission_resources.sql` (NEW)
- `supabase/migrations/YYYYMMDD_003_audit_log.sql` (NEW)

---

## Phase 2: Mission Management Backend

### Task 2.1: Mission CRUD API (Backend)
**Objective**: Implement full CRUD endpoints for missions
**Acceptance Criteria**:
- ✅ POST `/api/admin/missions` → Create mission (validate title, grade, subject)
- ✅ GET `/api/admin/missions` → List missions (with filters: grade, subject, published status)
- ✅ GET `/api/admin/missions/:id` → Get single mission
- ✅ PATCH `/api/admin/missions/:id` → Update mission (only by creator or admin)
- ✅ DELETE `/api/admin/missions/:id` → Soft delete
- ✅ POST `/api/admin/missions/:id/publish` → Mark published + set timestamp
- ✅ POST `/api/admin/missions/:id/unpublish` → Mark draft
- ✅ All mutations create audit log entries

**Verification**:
- Test all endpoints with curl/Postman
- Verify validation rejects invalid grade levels, empty titles
- Verify audit log records user, timestamp, action
- Test permission check (creator can edit own, admin can edit any)

**Files to Create**:
- `edutechlife-backend/src/routes/missions.js` (NEW)
- `edutechlife-backend/src/services/missionService.js` (NEW)
- `edutechlife-backend/tests/missions.test.js` (NEW)

---

### Task 2.2: Mission Frontend UI (React Form)
**Objective**: Build React component to create/edit missions
**Acceptance Criteria**:
- ✅ MissionEditor form component (title, description, grade, subject, objectives, difficulty, duration)
- ✅ Form validation (required fields, text length limits)
- ✅ Create new mission → POST `/api/admin/missions` → redirect to list
- ✅ Edit existing mission → PATCH → show success toast
- ✅ Delete mission → soft delete → remove from list
- ✅ Draft/published toggle in form
- ✅ Accessibility: ARIA labels, keyboard nav, focus management

**Verification**:
- Fill form → submit → mission appears in list
- Edit mission → change title → verify update
- Test keyboard navigation (Tab through all fields)
- Test screen reader announces labels

**Files to Create**:
- `edutechlife-frontend/src/components/MissionEditor/MissionEditor.jsx` (NEW)
- `edutechlife-frontend/src/components/MissionEditor/MissionForm.jsx` (NEW)
- `edutechlife-frontend/src/hooks/useMissions.js` (NEW)
- `edutechlife-frontend/src/pages/MissionsManagement.jsx` (NEW)
- `edutechlife-frontend/src/components/MissionEditor/__tests__/MissionEditor.test.jsx` (NEW)

---

## Phase 3: Resource Management & Upload

### Task 3.1: Multimedia Upload to Supabase Storage
**Objective**: Implement file upload with validation and CDN URL generation
**Acceptance Criteria**:
- ✅ Upload endpoint: POST `/api/admin/resources/upload`
- ✅ Validate file type (images: jpg/png/webp, videos: mp4/webm, PDFs, audio: mp3/m4a)
- ✅ Validate file size (images ≤5MB, videos ≤100MB, PDFs ≤20MB)
- ✅ Store in Supabase Storage at `admin/resources/{year}/{month}/{random-uuid}`
- ✅ Generate CDN URL via Supabase
- ✅ Store metadata in `content_resources` table
- ✅ Return resource ID + CDN URL to frontend

**Verification**:
- Upload image → verify stored in Storage → verify CDN URL works
- Upload oversized video → verify rejection with user-friendly error
- Test invalid file type → verify rejection
- Verify thumbnail generation (if using Supabase Transform)

**Files to Create**:
- `edutechlife-backend/src/routes/resourceUpload.js` (NEW)
- `edutechlife-backend/src/services/storageService.js` (NEW)

---

### Task 3.2: Resource Manager UI (List + Upload)
**Objective**: Build UI to view, upload, organize resources
**Acceptance Criteria**:
- ✅ ResourceManager list view (grid or table: name, type, grade, subject, upload date)
- ✅ Filter resources by type, grade, subject
- ✅ Drag-and-drop upload area (or file picker button)
- ✅ Preview uploaded files (image thumbnail, video player, PDF viewer)
- ✅ Delete resource (with confirmation dialog)
- ✅ Tag resources (multi-select)
- ✅ Progress indicator during upload (show % complete)

**Verification**:
- Drag image → upload → appears in list with thumbnail
- Click filter → list updates
- Delete resource → confirmation modal → removed from list
- Test keyboard upload (focus upload area, press Enter to open file picker)

**Files to Create**:
- `edutechlife-frontend/src/components/ResourceManager/ResourceManager.jsx` (NEW)
- `edutechlife-frontend/src/components/ResourceManager/ResourceUploader.jsx` (NEW)
- `edutechlife-frontend/src/hooks/useResources.js` (NEW)
- `edutechlife-frontend/src/services/storageService.js` (NEW)

---

### Task 3.3: Link Resources to Missions
**Objective**: Allow admins to attach resources (multimedia) to missions
**Acceptance Criteria**:
- ✅ Mission form has "Attach Resources" section
- ✅ Modal to search/select existing resources or upload new ones
- ✅ Drag to reorder resources within mission
- ✅ Remove resource from mission (unlink, not delete)
- ✅ Save mission with resources → create entries in `mission_resources` table
- ✅ Display attached resources in mission preview

**Verification**:
- Create mission → attach 3 resources → save → verify mission_resources table has 3 rows
- Reorder resources → verify position column updates
- Remove resource from mission → verify mission_resources row deleted
- Preview mission → see resources in order

**Files to Modify**:
- `edutechlife-frontend/src/components/MissionEditor/MissionEditor.jsx`
- `edutechlife-backend/src/routes/missions.js` (add resource linking logic)

---

## Phase 4: Admin Dashboard & Preview

### Task 4.1: Admin Dashboard (Overview)
**Objective**: Landing page showing content stats and quick actions
**Acceptance Criteria**:
- ✅ Dashboard shows: total missions, total resources, unpublished content count
- ✅ Recent activity feed (last 10 edits across missions/resources)
- ✅ Quick actions: "Create Mission", "Upload Resource"
- ✅ Navigation menu to: Missions, Resources, Curriculum, Audit Log
- ✅ Sidebar with admin profile + logout

**Verification**:
- Load dashboard → counts are accurate
- Click "Create Mission" → navigate to form
- Log out → redirect to login

**Files to Create**:
- `edutechlife-frontend/src/pages/AdminDashboard.jsx` (NEW)
- `edutechlife-frontend/src/components/AdminLayout/Sidebar.jsx` (NEW)

---

### Task 4.2: Mission Preview (Student View)
**Objective**: Show admins exactly how mission appears to students before publishing
**Acceptance Criteria**:
- ✅ "Preview" button on mission editor
- ✅ Modal/page shows mission as student would see it in SmartBoard
- ✅ Render mission title, objectives, resources (images, videos, PDFs)
- ✅ Test resource playback (verify CDN URLs work)
- ✅ Show "DRAFT" label if unpublished
- ✅ Link back to edit

**Verification**:
- Edit mission → click Preview → see student-facing layout
- Verify all images load (check CDN URLs)
- Play video → verify it works
- Unpublished mission shows "DRAFT" badge

**Files to Create**:
- `edutechlife-frontend/src/components/MissionEditor/MissionPreview.jsx` (NEW)

---

### Task 4.3: Curriculum Browser (Read-Only)
**Objective**: Display MEN Colombia curriculum standards for reference
**Acceptance Criteria**:
- ✅ Tree view: Grades (1-11) → Subjects → Standards
- ✅ Read-only (no editing; data comes from migration 051)
- ✅ Click standard → show related missions/resources already linked
- ✅ Search standards by keyword

**Verification**:
- Load curriculum → tree expands correctly
- Click grade 7 → subjects appear
- Click subject → standards appear
- Search "matemáticas" → filters standards

**Files to Create**:
- `edutechlife-frontend/src/components/CurriculumBrowser/CurriculumTree.jsx` (NEW)
- `edutechlife-frontend/src/pages/CurriculumManagement.jsx` (NEW)

---

## Phase 5: Audit Logging & Deployment

### Task 5.1: Audit Log Viewer
**Objective**: Provide admins visibility into all content changes
**Acceptance Criteria**:
- ✅ Page shows all audit log entries (paginated, 50 per page)
- ✅ Filter by: action (create/edit/delete/publish), entity type (mission/resource), date range, user
- ✅ Display: timestamp, user, action, entity name, change summary
- ✅ Export audit log as CSV (for compliance)
- ✅ Read-only (audit log is immutable)

**Verification**:
- Create/edit mission → entry appears in audit log within 1 second
- Filter by user → shows only that user's actions
- Export → CSV file downloads with correct data

**Files to Create**:
- `edutechlife-frontend/src/components/AuditLog/AuditLogViewer.jsx` (NEW)
- `edutechlife-backend/src/routes/auditLog.js` (NEW)
- `edutechlife-backend/src/services/auditService.js` (NEW)

---

### Task 5.2: Testing & Quality Assurance
**Objective**: Comprehensive testing before production release
**Acceptance Criteria**:
- ✅ Unit tests for services (missionService, storageService, auditService) → ≥80% coverage
- ✅ Component tests for forms (MissionEditor, ResourceUploader) → ≥60% coverage
- ✅ E2E test: Create mission → upload resource → link → publish → verify student sees it
- ✅ Security test: Non-admin user cannot access `/admin/*` routes
- ✅ Permission test: Creator cannot edit other users' missions (only admin can)
- ✅ Performance test: Dashboard loads <2s, mission list with 1000 items filters instantly

**Verification**:
- Run `npm run test:admin --coverage` → ≥80% for services
- Run E2E test → full flow succeeds
- Try accessing `/admin/*` without login → redirected to login
- Try editing another user's mission → 403 error

**Files to Create/Modify**:
- `edutechlife-frontend/src/components/__tests__/` (various test files)
- `edutechlife-backend/src/services/__tests__/` (service tests)
- `edutechlife-frontend/cypress/e2e/admin-flow.cy.js` (E2E test)

---

### Task 5.3: Deployment & Documentation
**Objective**: Deploy Admin CMS to production
**Acceptance Criteria**:
- ✅ Build both frontend & backend without errors
- ✅ All env vars configured in Vercel/Render
- ✅ Database migrations applied to production
- ✅ Smoke test: Login as admin → create mission → publish → verify in SmartBoard
- ✅ README with admin onboarding instructions
- ✅ Admin user created in production (test account)

**Verification**:
- Visit `https://edutechlife.co/admin` → login works
- Create mission → appears in SmartBoard student dashboard within 1 minute
- Verify CDN URLs are accessible (no 403s)

**Files to Create**:
- `edutechlife-admin-cms/README.md` (deployment & onboarding guide)
- `docs/admin-cms-onboarding.md` (step-by-step guide for admins)

---

## Checkpoints Between Phases

| After Phase | Checkpoint | Gate |
|-------------|-----------|------|
| Phase 1 | Auth & DB schema working locally | ✅ DB migrations run, auth tokens validate |
| Phase 2 | Missions CRUD complete | ✅ Create/edit/delete/publish missions via API + UI |
| Phase 3 | Resources uploading to CDN | ✅ Upload file → verify CDN URL works |
| Phase 4 | Admin dashboard + preview working | ✅ Dashboard loads, preview modal renders mission correctly |
| Phase 5 | Full E2E flow passes | ✅ Create mission → upload resource → publish → student sees it |

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Large file uploads timeout | Implement chunked upload; set nginx timeout to 300s |
| Concurrent mission edits conflict | Add `updated_at` timestamp; last-write-wins or optimistic locking |
| Supabase Storage quota exceeded | Monitor storage usage; set upload limits; archive old resources |
| RLS policies too permissive | Review with security team; test non-admin access denied |

---

## Deliverables by Phase

**Phase 1**: Deployed DB schema + auth middleware  
**Phase 2**: Functional mission CRUD (backend + UI)  
**Phase 3**: Working file uploads + CDN integration  
**Phase 4**: Admin dashboard + preview feature  
**Phase 5**: Production deployment + documentation  

---

**Status**: PLAN_V1 - Ready for implementation  
**Next Step**: Begin Task 1.1 (Admin Auth) — estimated 2-3 hours
