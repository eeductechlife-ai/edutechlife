import BadgeCard from './BadgeCard';
import { BADGE_INFO } from '../../data/ialab';

export default {
  title: 'IALab/Gamification/BadgeCard',
  component: BadgeCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    earned: { control: 'boolean' },
    isNewlyEarned: { control: 'boolean' },
    dateEarned: { control: 'date' },
    onClick: { action: 'clicked' },
  },
};

const badgeKeys = Object.keys(BADGE_INFO);

export const Earned = {
  args: {
    badge: { id: badgeKeys[0], ...BADGE_INFO[badgeKeys[0]] },
    earned: true,
    dateEarned: new Date().toISOString(),
    isNewlyEarned: false,
  },
};

export const NewlyEarned = {
  args: {
    badge: { id: badgeKeys[1], ...BADGE_INFO[badgeKeys[1]] },
    earned: true,
    dateEarned: new Date().toISOString(),
    isNewlyEarned: true,
  },
};

export const Locked = {
  args: {
    badge: { id: badgeKeys[2], ...BADGE_INFO[badgeKeys[2]] },
    earned: false,
    dateEarned: null,
    isNewlyEarned: false,
  },
};

export const FirstLesson = {
  args: {
    badge: { id: 'first_lesson', ...BADGE_INFO['first_lesson'] },
    earned: true,
    dateEarned: '2026-01-15T10:30:00Z',
    isNewlyEarned: false,
  },
};
