import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useStudyGroups } from "../../../hooks/IALab/useStudyGroups";
import { useTranslation } from "../../../i18n/I18nProvider";

function StudyGroupsPanel({ moduleId }) {
  const { t } = useTranslation();
  const {
    groups,
    isLoading,
    error,
    myMemberships,
    createGroup,
    joinGroup,
    leaveGroup,
  } = useStudyGroups(moduleId);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setCreating(true);
    const result = await createGroup(formName.trim(), formDesc.trim());
    if (result.success) {
      setShowForm(false);
      setFormName("");
      setFormDesc("");
    }
    setCreating(false);
  };

  const getMemberCount = (group) => {
    return group.members ? group.members.length : 0;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center shadow-sm">
            <Icon name="fa-users" className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--theme-emphasis)]">
              {t("study_groups.title")}
            </h3>
            <p className="text-xs text-slate-500">
              {t("study_groups.subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-xs font-semibold hover:shadow-lg transition-all flex items-center gap-1.5"
        >
          <Icon name="fa-plus" className="text-xs" />
          {t("study_groups.create")}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleCreate}
          className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
        >
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder={t("study_groups.form_name_placeholder")}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/20"
            maxLength={100}
            required
          />
          <textarea
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder={t("study_groups.form_desc_placeholder")}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/20 resize-none"
            rows={2}
            maxLength={500}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-2 text-xs text-slate-500 hover:text-[var(--theme-emphasis)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formName.trim() || creating}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-xs font-semibold disabled:opacity-50 transition-all"
            >
              {creating ? "..." : t("study_groups.create")}
            </button>
          </div>
        </motion.form>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-[var(--theme-emphasis)]/20 border-t-[var(--theme-emphasis)] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-6 text-sm text-red-500">{error}</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <Icon name="fa-users" className="text-slate-400 text-lg" />
          </div>
          <p className="text-sm text-slate-500 mb-1">
            {t("study_groups.no_groups")}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-[var(--theme-emphasis)] font-medium hover:underline"
          >
            {t("study_groups.create_first")}
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {groups.map((group) => {
            const isMember = myMemberships[group.id];
            return (
              <div
                key={group.id}
                className="p-3.5 rounded-xl border border-slate-200/60 bg-white hover:border-[var(--theme-emphasis)]/20 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-[var(--theme-emphasis)] truncate">
                      {group.name}
                    </h4>
                    {group.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Icon name="fa-user" className="text-[9px]" />
                      {getMemberCount(group)}
                    </span>
                    {isMember ? (
                      <button
                        onClick={() => leaveGroup(group.id)}
                        className="px-2.5 py-1.5 text-[10px] font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        {t("study_groups.leave")}
                      </button>
                    ) : (
                      <button
                        onClick={() => joinGroup(group.id)}
                        className="px-2.5 py-1.5 text-[10px] font-medium rounded-lg bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white hover:shadow transition-all"
                      >
                        {t("study_groups.join")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudyGroupsPanel;
