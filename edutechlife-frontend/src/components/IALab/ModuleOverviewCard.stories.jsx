import ModuleOverviewCard from './ModuleOverviewCard';

export default {
  title: 'IALab/ModuleOverviewCard',
  component: ModuleOverviewCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onAction: { action: 'action' },
    onToggleForum: { action: 'toggleForum' },
  },
};

export const Default = {
  args: {
    onAction: () => {},
    onToggleForum: () => {},
  },
};
