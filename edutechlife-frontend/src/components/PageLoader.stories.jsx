import { PageLoader } from "./LoadingScreen";

export default {
  title: "UI/PageLoader",
  component: PageLoader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
  argTypes: {
    message: { control: "text" },
  },
};

export const Default = {
  args: {
    message: "Cargando...",
  },
};

export const CustomMessage = {
  args: {
    message: "Preparando tu experiencia educativa...",
  },
};

export const Short = {
  args: {
    message: "Almost ready!",
  },
};
