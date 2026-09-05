/**
 * AdminDashboard Page
 * Main admin interface for content management
 * Placeholder for Task 2.1 (Mission CRUD)
 */

import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminDashboard() {
  const { user } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1e293b]">
                Admin Dashboard
              </h1>
              <p className="text-sm text-[#64748b] mt-1">
                Manage content, missions, and resources
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#1e293b]">
                {user?.email}
              </p>
              <p className="text-xs text-[#94a3b8] capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Missions Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#0077B6]">
            <h3 className="font-bold text-[#1e293b] mb-2">Missions</h3>
            <p className="text-sm text-[#64748b] mb-4">
              Create and manage learning missions
            </p>
            <button className="w-full px-3 py-2 bg-[#0077B6] text-white text-sm rounded font-medium hover:bg-[#004B63] transition-colors">
              Go to Missions
            </button>
          </div>

          {/* Resources Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#0077B6]">
            <h3 className="font-bold text-[#1e293b] mb-2">Resources</h3>
            <p className="text-sm text-[#64748b] mb-4">
              Upload and organize educational content
            </p>
            <button className="w-full px-3 py-2 bg-[#0077B6] text-white text-sm rounded font-medium hover:bg-[#004B63] transition-colors">
              Manage Resources
            </button>
          </div>

          {/* Audit Log Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#0077B6]">
            <h3 className="font-bold text-[#1e293b] mb-2">Audit Log</h3>
            <p className="text-sm text-[#64748b] mb-4">
              View content changes and activity history
            </p>
            <button className="w-full px-3 py-2 bg-[#0077B6] text-white text-sm rounded font-medium hover:bg-[#004B63] transition-colors">
              View Logs
            </button>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#0077B6]">
            <h3 className="font-bold text-[#1e293b] mb-2">Preview</h3>
            <p className="text-sm text-[#64748b] mb-4">
              Preview content before publishing
            </p>
            <button className="w-full px-3 py-2 bg-[#0077B6] text-white text-sm rounded font-medium hover:bg-[#004B63] transition-colors">
              Open Preview
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-[#004B63] mb-2">
            Welcome to Admin Portal
          </h3>
          <p className="text-sm text-[#1e293b]">
            This is your dashboard for managing EdutechLife content. Use the
            sections above to access missions, resources, audit logs, and
            content preview tools. Task 1.1 (Auth) is complete. Tasks 1.2-5.3
            (CRUD, Resources, Dashboard, Audit, Testing) are in development.
          </p>
        </div>
      </main>
    </div>
  );
}
