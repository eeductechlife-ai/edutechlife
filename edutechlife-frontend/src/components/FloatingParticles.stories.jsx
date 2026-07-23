import FloatingParticles from "./FloatingParticles";

export default {
  title: "Animations/FloatingParticles",
  component: FloatingParticles,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    count: { control: { type: "number", min: 1, max: 50 } },
    color: { control: "color" },
    className: { control: "text" },
  },
};

export const Default = {
  args: {
    count: 10,
    color: "#4DA8C4",
  },
};

export const Dense = {
  args: {
    count: 30,
    color: "#66CCCC",
  },
};

export const Few = {
  args: {
    count: 3,
    color: "#004B63",
  },
};
