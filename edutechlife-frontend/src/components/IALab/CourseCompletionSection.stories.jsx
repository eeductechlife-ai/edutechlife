import CourseCompletionSection from './CourseCompletionSection';

export default {
  title: 'IALab/Gamification/CourseCompletionSection',
  component: CourseCompletionSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    hasCertificate: { control: 'boolean' },
    courseProgress: { control: { type: 'number', min: 0, max: 100 } },
    onViewCertificate: { action: 'viewCertificate' },
  },
};

export const Completed = {
  args: {
    hasCertificate: true,
    courseProgress: 95,
  },
};

export const Hidden = {
  args: {
    hasCertificate: false,
    courseProgress: 60,
  },
};
