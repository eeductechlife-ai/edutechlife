# Admin/CMS Contenido — SmartBoard 3.0 (Item #50)

## 1. Objective

Provide EdutechLife admins and content creators with a centralized, user-friendly portal to manage all educational content consumed by SmartBoard students:
- Create, edit, organize, and publish learning missions
- Manage curriculum (Colombian MEN standards, grades 1-11)
- Upload and organize multimedia assets (videos, PDFs, podcasts, images)
- Control content visibility and publication status
- Track content audit trail (who created/edited what, when)
- Preview content before publication

**Target Users**: EdutechLife admins, curriculum leads, content creators, teachers
**Success Criteria**: Content creators can publish a new mission with 5 multimedia assets in <5 minutes without technical support

---

## 2. Core Features & Acceptance Criteria

### 2.1 Missions Management
- **Create**: Form with title, description, learning objectives, duration (min), difficulty (1-5), grade level, subject
- **Edit**: Full CRUD on all mission fields
- **Publish/Unpublish**: Immediate visibility control for students
- **Metadata**: Tags, prerequisites, learning outcomes, aligned standards
- **Validation**: All required fields enforced, text length limits

### 2.2 Curriculum Management (MEN Colombia)
- **Browse**: Tree view of grades (1-11) → subjects → standards
- **Sync**: Read-only sync from curriculum migration (051) in Supabase
- **Link Content**: Missions linked to curriculum standards
- **View**: Standards aligned with uploaded content

### 2.3 Resources Management
- **CRUD**: Articles, PDFs, videos, podcasts, images
- **Metadata**: Title, description, file type, URL/path, duration (for media), aligned grade/subject
- **Categorization**: Organize into folders/categories
- **Search**: Filter by type, grade, subject, keyword

### 2.4 Multimedia Upload & Storage
- **Upload**: Drag-and-drop or file picker for images, PDFs, videos, audio
- **Storage**: Supabase Storage (integrated with RLS)
- **Validation**: File type & size limits (images ≤5MB, videos ≤100MB, PDFs ≤20MB)
- **Preview**: Thumbnail preview before confirming upload
- **CDN**: Automatic serving via Supabase CDN URL

### 2.5 Content Organization
- **Folders**: Hierarchical folder structure for organizing resources
- **Tags**: Multi-tag system for cross-cutting organization
- **Collections**: Curated groupings of missions/resources by theme or grade

### 2.6 Publication & Versioning
- **Draft/Published**: Content is draft until explicitly published
- **Schedule**: Publish at specific date/time (optional)
- **Visibility**: Toggle between visible/hidden for students in real-time
- **Version History**: Track last modified date, editor name, change notes

### 2.7 Preview & Testing
- **Student Preview**: Admins can view content exactly as students will see it
- **Draft Preview**: Before publishing, see how mission appears in SmartBoard UI

### 2.8 Audit Trail
- **Log**: All create/edit/delete actions with timestamp, user ID, editor name, change summary
- **Accountability**: Track who published what and when
- **Export**: Download audit logs for compliance

---

## 3. Project Structure

```
edutechlife-admin-cms/
├── src/
│   ├── pages/
│   │   ├── AdminLogin.jsx
│   │   ├── Dashboard.jsx
│   │   └── ContentManagement.jsx
│   ├── components/
│   │   ├── MissionEditor/
│   │   │   ├── MissionEditor.jsx
│   │   │   ├── MissionForm.jsx
│   │   │   └── MissionPreview.jsx
│   │   ├── ResourceManager/
│   │   │   ├── ResourceManager.jsx
│   │   │   ├── ResourceUploader.jsx
│   │   │   └── ResourceList.jsx
│   │   ├── CurriculumBrowser/
│   │   │   ├── CurriculumTree.jsx
│   │   │   └── StandardDetails.jsx
│   │   └── AuditLog/
│   │       └── AuditLogViewer.jsx
│   ├── hooks/
│   │   ├── useAdminAuth.js
│   │   ├── useMissions.js
│   │   ├── useResources.js
│   │   └── useAuditLog.js
│   ├── services/
│   │   ├── contentService.js
│   │   ├── storageService.js
│   │   └── auditService.js
│   └── styles/
│       └── admin.css
├── tests/
│   ├── components/
│   └── services/
└── README.md
```

---

## 4. Code Style & Conventions

### React/Component Patterns
- **Functional components** with hooks (useState, useEffect, useCallback)
- **One file per component** (e.g., `MissionEditor.jsx`, not split into smaller files unless >300 lines)
- **Props validation**: Use PropTypes or TypeScript if types are complex
- **Custom hooks** for reusable logic (data fetching, form handling)

### Naming
- Components: PascalCase (`MissionEditor.jsx`)
- Functions/hooks: camelCase (`useMissions.js`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- CSS classes: kebab-case (`mission-editor__form`)

### Error Handling
- Input validation at system boundary (API routes)
- User-friendly error messages (no stack traces in UI)
- Fallback states (loading, error, empty)

### Accessibility
- Semantic HTML (`<button>`, `<form>`, `<label>`)
- ARIA labels for screen readers
- Keyboard navigation throughout
- 44px+ touch targets

### No Over-Engineering
- Single responsibility per component
- No premature abstraction (3+ similar lines = candidate for helper, not before)
- Inline styles only for computed values; use CSS classes for static styles

---

## 5. Testing Strategy

### Unit Tests (for services & utilities)
- **Test file location**: `src/services/__tests__/`
- **Test runner**: Jest + React Testing Library
- **Coverage target**: ≥80% for services, ≥60% for components
- **What to test**: Input validation, data transformation, error states

### Component Tests (integration)
- **Test file location**: `src/components/__tests__/`
- **Focus**: User interactions (form submission, uploads, navigation)
- **Fixtures**: Mock Supabase responses, mock user auth

### E2E Tests (optional for MVP)
- **Scope**: Critical user flows (create mission → upload resource → publish)
- **Tool**: Cypress or Playwright

### Test Command
```bash
npm run test:admin           # Run all tests
npm run test:admin --watch   # Watch mode
npm run test:admin --coverage # Coverage report
```

---

## 6. Boundaries

### ✅ ALWAYS DO
- **Validate all input** at API boundary (mission title length, file types, grade levels)
- **Check admin role** on every protected route (via JWT + RLS in Supabase)
- **Log audit trail** for all content mutations (create, edit, delete, publish)
- **Use parameterized queries** (never concatenate user input into SQL)
- **Encode output** in React (JSX auto-escapes by default)
- **Use HTTPS** for all external communication
- **Keep files under 500 lines** (split large editors into sub-components)

### ❓ ASK FIRST BEFORE
- Adding new user roles or permission levels (e.g., "content-reviewer")
- Integrating third-party services (e.g., video transcoding, AI image alt-text)
- Changing the curriculum sync mechanism from Supabase
- Exposing any admin APIs publicly

### ❌ NEVER DO
- Commit `.env` files or secrets
- Log sensitive data (passwords, tokens, full file paths)
- Store admin sessions in localStorage (use httpOnly cookies or Supabase auth)
- Allow file uploads without MIME type validation
- Expose stack traces or internal errors to users
- Create admin accounts via UI (only via Supabase auth + manual role assignment)

---

## 7. Database Schema (Supabase)

### Existing Tables to Use
- `users` (id, email, user_type, role, ...)
- `students` (id, auth_id, name, grade, ...)
- `missions` (already referenced in student dashboard)
- `parental_controls` (existing from #65)

### New Tables Required
```sql
-- content_missions: Full mission definitions
CREATE TABLE content_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  learning_objectives TEXT[],
  difficulty_level INT CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  grade_level VARCHAR(50),
  subject VARCHAR(100),
  duration_minutes INT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- content_resources: Multimedia assets
CREATE TABLE content_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type VARCHAR(50), -- 'pdf', 'video', 'image', 'podcast'
  storage_path VARCHAR(500), -- Supabase Storage path
  cdn_url TEXT,
  file_size_bytes INT,
  duration_seconds INT, -- for video/podcast
  grade_level VARCHAR(50),
  subject VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- mission_resources: Link missions to resources
CREATE TABLE mission_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES content_missions(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES content_resources(id) ON DELETE CASCADE,
  position INT, -- order within mission
  UNIQUE(mission_id, resource_id)
);

-- content_audit_log: Immutable audit trail
CREATE TABLE content_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(50), -- 'create', 'edit', 'delete', 'publish', 'unpublish'
  entity_type VARCHAR(50), -- 'mission', 'resource'
  entity_id UUID,
  performed_by UUID NOT NULL REFERENCES users(id),
  changes JSONB, -- before/after diff
  created_at TIMESTAMP DEFAULT NOW()
);
```

### RLS Policies
- **Admin read**: Admins see all content (draft + published)
- **Student read**: Students see only published content for their grade
- **Creator write**: Content creators edit only their own content
- **Admin approve**: Only admins can publish

---

## 8. API Endpoints (Backend)

```
POST   /api/admin/missions           - Create mission
GET    /api/admin/missions           - List all missions (with filters)
GET    /api/admin/missions/:id       - Get mission details
PATCH  /api/admin/missions/:id       - Update mission
DELETE /api/admin/missions/:id       - Delete mission
POST   /api/admin/missions/:id/publish    - Publish mission
POST   /api/admin/missions/:id/unpublish  - Unpublish mission

POST   /api/admin/resources          - Upload resource
GET    /api/admin/resources          - List resources (with filters)
DELETE /api/admin/resources/:id      - Delete resource

GET    /api/admin/curriculum         - Browse curriculum tree
GET    /api/admin/audit-logs         - Export audit trail
```

---

## 9. Deployment & Env Vars

### Required Env Vars
```
VITE_ADMIN_API_BASE_URL=https://edutechlife-backend.onrender.com
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_JWT_SECRET=... (backend only)
```

### Build & Serve
```bash
npm run build:admin      # Build admin CMS bundle
npm run serve:admin      # Local preview
npm run deploy:admin     # Deploy to Vercel (optional subdomain)
```

### Access Control
- **Route**: `/admin/login` → `/admin/dashboard`
- **Auth**: Supabase auth + JWT role check
- **Only admins** can access (role = 'admin' or 'content-creator')

---

## 10. Success Metrics

- ✅ Content creator can create & publish a mission in <5 min
- ✅ All uploads validate file type/size without breaking
- ✅ Audit log is immutable and queryable
- ✅ Student dashboard reflects published content within 1 minute
- ✅ 0 secrets in git history
- ✅ 100% input validation at boundaries
- ✅ Keyboard navigation works on all forms

---

## 11. Out of Scope (Phase 2+)

- Bulk content import (CSV/Excel)
- AI-powered alt-text generation for images
- Content recommendation engine
- A/B testing framework
- Content versioning/rollback
- Automated translations

---

**Status**: SPEC_V1 - Ready for implementation planning
**Next Step**: Run `agent-skills:plan` to break this into implementable increments
