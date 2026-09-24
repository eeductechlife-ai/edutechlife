import ModuleNavItem from "./ModuleNavItem";
import { I18nProvider } from "../../../i18n/I18nProvider";

const decorators = [
  (Story) => (
    <I18nProvider>
      <div className="w-64 p-4 bg-[var(--theme-bg)]">
        <div className="space-y-2.5">
          <Story />
        </div>
      </div>
    </I18nProvider>
  ),
];

const baseModule = {
  id: 1,
  title: "Artesano Digital: Prompts",
  icon: "fa-wand-magic-sparkles",
};

export default {
  title: "IALab/Sidebar/ModuleNavItem",
  component: ModuleNavItem,
  tags: ["autodocs"],
  decorators,
  args: { mod: baseModule, onClick: () => {} },
};

export const Activo = { args: { isActive: true, score: 60 } };
export const Completado = { args: { isCompleted: true, score: 96 } };
export const Bloqueado = {
  args: { isLocked: true, score: 0, mod: { ...baseModule, id: 3 } },
};
export const Normal = { args: { score: 20 } };
export const CompactoActivo = {
  args: { variant: "compact", isActive: true, score: 60 },
  decorators: [
    (Story) => (
      <I18nProvider>
        <div className="w-[72px] p-2 bg-[var(--theme-surface-2)]">
          <Story />
        </div>
      </I18nProvider>
    ),
  ],
};
export const CompactoBloqueado = {
  args: { variant: "compact", isLocked: true },
  decorators: [
    (Story) => (
      <I18nProvider>
        <div className="w-[72px] p-2 bg-[var(--theme-surface-2)]">
          <Story />
        </div>
      </I18nProvider>
    ),
  ],
};
