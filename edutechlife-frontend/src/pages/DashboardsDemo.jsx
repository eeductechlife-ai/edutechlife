import { useState } from "react";
import { motion } from "framer-motion";
import ParentDashboard from "../components/parent-dashboard/ParentDashboard";
import EducatorDashboard from "../components/educator-dashboard/EducatorDashboard";

export default function DashboardsDemo() {
  const [activeTab, setActiveTab] = useState("parent");

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Tab Navigation */}
      <motion.div
        className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700 px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto flex gap-4">
          <motion.button
            onClick={() => setActiveTab("parent")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === "parent"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👨‍👩‍👧 Parent Dashboard
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("educator")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === "educator"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👨‍🏫 Educator Dashboard
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "parent" && <ParentDashboard />}
        {activeTab === "educator" && <EducatorDashboard />}
      </motion.div>
    </div>
  );
}
