import StreakBadge from './StreakBadge';

export default {
  title: 'IALab/Gamification/StreakBadge',
  component: StreakBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    streak: { control: { type: 'number', min: 0, max: 30 } },
    xp: { control: { type: 'number', min: 0, max: 10000 } },
    level: { control: { type: 'number', min: 1, max: 20 } },
    isAtRisk: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export const Active = {
  args: {
    streak: 2,
    xp: 450,
    level: 3,
    isAtRisk: false,
  },
};

export const OnFire = {
  args: {
    streak: 5,
    xp: 1250,
    level: 5,
    isAtRisk: false,
  },
};

export const Unstoppable = {
  args: {
    streak: 12,
    xp: 3200,
    level: 7,
    isAtRisk: false,
  },
};

export const AtRisk = {
  args: {
    streak: 6,
    xp: 800,
    level: 4,
    isAtRisk: true,
  },
};

export const NoStreak = {
  args: {
    streak: 0,
    xp: 50,
    level: 1,
    isAtRisk: false,
  },
};
