import Breadcrumbs from './Breadcrumbs';

export default {
  title: 'IALab/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    segments: { control: 'object' },
    separator: { control: 'text' },
    size: { control: 'text' },
  },
};

const sampleSegments = [
  { label: 'Inicio', icon: 'fa-home', onClick: () => {} },
  { label: 'Módulo 1', icon: 'fa-book' },
];

export const Default = {
  args: {
    segments: sampleSegments,
  },
};

export const ThreeLevels = {
  args: {
    segments: [
      { label: 'Inicio', icon: 'fa-home', onClick: () => {} },
      { label: 'Módulo 2', icon: 'fa-robot' },
      { label: 'ChatGPT', icon: 'fa-code' },
    ],
  },
};

export const CustomSeparator = {
  args: {
    segments: sampleSegments,
    separator: '›',
    size: 'text-sm',
  },
};
