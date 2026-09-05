# TODO: Admin/CMS Contenido Implementation Checklist

## Phase 1: Foundation

- [ ] **Task 1.1**: Admin Auth & Route Protection
  - [ ] Create `/api/admin/auth/me` endpoint
  - [ ] Implement JWT role check middleware
  - [ ] Create `useAdminAuth()` hook
  - [ ] Create AdminLogin page
  - [ ] Test unauthorized access → 403
  - [ ] Verify admin access succeeds

- [ ] **Task 1.2**: Database Schema (Migrations)
  - [ ] Create content_missions table
  - [ ] Create content_resources table
  - [ ] Create mission_resources junction table
  - [ ] Create content_audit_log table
  - [ ] Add RLS policies (admin/student read rules)
  - [ ] Run migrations locally
  - [ ] Verify table structure
  - [ ] Test RLS policies

## Phase 2: Mission Management

- [ ] **Task 2.1**: Mission CRUD API
  - [ ] POST /api/admin/missions (create)
  - [ ] GET /api/admin/missions (list + filters)
  - [ ] GET /api/admin/missions/:id (single)
  - [ ] PATCH /api/admin/missions/:id (update)
  - [ ] DELETE /api/admin/missions/:id (soft delete)
  - [ ] POST /api/admin/missions/:id/publish
  - [ ] POST /api/admin/missions/:id/unpublish
  - [ ] Audit log integration (all mutations)
  - [ ] Test all endpoints with curl/Postman
  - [ ] Test validation (invalid grades, empty titles)
  - [ ] Test permissions (creator can edit own, admin can edit any)

- [ ] **Task 2.2**: Mission Frontend UI
  - [ ] Create MissionEditor component
  - [ ] Create MissionForm component
  - [ ] Build useMissions hook
  - [ ] Create MissionsManagement page
  - [ ] Form validation (required fields, text limits)
  - [ ] Create mission → POST → redirect to list
  - [ ] Edit mission → PATCH → success toast
  - [ ] Delete mission → soft delete → remove from list
  - [ ] Draft/published toggle in form
  - [ ] Accessibility: ARIA labels, keyboard nav
  - [ ] Test flow: fill form → submit → appears in list
  - [ ] Test edit: change title → verify update
  - [ ] Test keyboard navigation
  - [ ] Test screen reader

## Phase 3: Resource Management

- [ ] **Task 3.1**: Multimedia Upload
  - [ ] POST /api/admin/resources/upload endpoint
  - [ ] File type validation (jpg/png/mp4/pdf/mp3)
  - [ ] File size validation (5MB images, 100MB videos, etc.)
  - [ ] Supabase Storage integration
  - [ ] CDN URL generation
  - [ ] Metadata storage in content_resources table
  - [ ] Test upload image → verify CDN URL works
  - [ ] Test oversized file → rejection with error message
  - [ ] Test invalid file type → rejection

- [ ] **Task 3.2**: Resource Manager UI
  - [ ] Create ResourceManager component
  - [ ] Create ResourceUploader component
  - [ ] Build useResources hook
  - [ ] Resource list view (grid/table)
  - [ ] Filter by type, grade, subject
  - [ ] Drag-and-drop upload area
  - [ ] File preview (thumbnail, video player, PDF)
  - [ ] Delete resource (with confirmation)
  - [ ] Tag resources (multi-select)
  - [ ] Upload progress indicator
  - [ ] Test drag → upload → appears in list with thumbnail
  - [ ] Test filter → list updates
  - [ ] Test delete → confirmation → removed
  - [ ] Test keyboard upload

- [ ] **Task 3.3**: Link Resources to Missions
  - [ ] Add "Attach Resources" section to mission form
  - [ ] Modal to search/select resources
  - [ ] Drag to reorder resources
  - [ ] Remove resource from mission
  - [ ] Save mission with resources
  - [ ] Create mission_resources entries
  - [ ] Display resources in mission preview
  - [ ] Test: create → attach 3 resources → verify table
  - [ ] Test: reorder → verify position updated
  - [ ] Test: remove → verify row deleted

## Phase 4: Admin Dashboard & Preview

- [ ] **Task 4.1**: Admin Dashboard
  - [ ] Create AdminDashboard page
  - [ ] Display mission count, resource count, unpublished count
  - [ ] Recent activity feed (last 10 edits)
  - [ ] Quick action buttons (Create Mission, Upload Resource)
  - [ ] Navigation menu (Missions, Resources, Curriculum, Audit)
  - [ ] Sidebar with profile + logout
  - [ ] Test: counts are accurate
  - [ ] Test: quick actions navigate correctly
  - [ ] Test: logout redirects to login

- [ ] **Task 4.2**: Mission Preview
  - [ ] Create MissionPreview component
  - [ ] Add "Preview" button to editor
  - [ ] Render mission as student would see it
  - [ ] Display all resources (images, videos, PDFs)
  - [ ] Test video/image playback (CDN URLs)
  - [ ] Show "DRAFT" label if unpublished
  - [ ] Link back to edit
  - [ ] Test: preview shows student layout
  - [ ] Test: all media loads correctly
  - [ ] Test: unpublished shows DRAFT badge

- [ ] **Task 4.3**: Curriculum Browser
  - [ ] Create CurriculumTree component
  - [ ] Tree view: Grades → Subjects → Standards
  - [ ] Read-only (data from migration 051)
  - [ ] Click standard → show related missions
  - [ ] Search standards by keyword
  - [ ] Test: tree expands correctly
  - [ ] Test: search filters standards

## Phase 5: Audit & Deployment

- [ ] **Task 5.1**: Audit Log Viewer
  - [ ] Create AuditLogViewer page
  - [ ] Display audit log entries (paginated)
  - [ ] Filter by action, entity type, date, user
  - [ ] Show timestamp, user, action, entity name
  - [ ] Export as CSV
  - [ ] Read-only UI
  - [ ] Test: create mission → appears in log within 1s
  - [ ] Test: filter by user → correct actions
  - [ ] Test: export downloads CSV

- [ ] **Task 5.2**: Testing & QA
  - [ ] Unit tests for services (≥80% coverage)
  - [ ] Component tests for forms (≥60% coverage)
  - [ ] E2E test: create → upload → link → publish → verify
  - [ ] Security test: non-admin access denied
  - [ ] Permission test: creator cannot edit others' missions
  - [ ] Performance test: dashboard <2s, list filters instantly
  - [ ] Run `npm run test:admin --coverage`
  - [ ] All tests pass

- [ ] **Task 5.3**: Deployment
  - [ ] Build frontend & backend
  - [ ] Configure env vars (Vercel/Render)
  - [ ] Apply DB migrations to production
  - [ ] Create admin test account
  - [ ] Smoke test: login → create → publish → verify in SmartBoard
  - [ ] Verify CDN URLs accessible
  - [ ] Write README for admin CMS
  - [ ] Write onboarding guide for admins
  - [ ] Production deployment complete

---

## Summary

**Total Tasks**: 13  
**Total Subtasks**: ~120  
**Estimated Timeline**: 2-3 weeks (assuming 1 developer full-time)

**Critical Path**: 1.1 → 1.2 → 2.1 → 2.2 → 3.1 → 3.2 → 3.3 → 4.1 → 4.2 → 5.3

Start with **Task 1.1** (Admin Auth) — 2-3 hours estimated
