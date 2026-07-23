import GlassCard from "./GlassCard";

export default {
  title: "UI/GlassCard",
  component: GlassCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    padding: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    hover: { control: "boolean" },
    animate: { control: "boolean" },
    delay: { control: { type: "number", min: 0, max: 1, step: 0.1 } },
  },
};

export const Default = {
  args: {
    children: (
      <div className="w-64">
        <p className="text-petroleum font-medium">Contenido de la tarjeta</p>
        <p className="text-slate-500 text-sm mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
    ),
    padding: "lg",
  },
};

export const WithHover = {
  args: {
    ...Default.args,
    hover: true,
  },
};

export const Animated = {
  args: {
    ...Default.args,
    animate: true,
    delay: 0.2,
  },
};

export const Small = {
  args: {
    children: (
      <div className="w-48 text-center">
        <p className="text-petroleum font-bold text-lg">42</p>
        <p className="text-slate-500 text-xs">Completed</p>
      </div>
    ),
    padding: "sm",
  },
};

export const ExtraLarge = {
  args: {
    children: (
      <div className="w-80">
        <h3 className="text-xl font-black text-petroleum">Premium Card</h3>
        <p className="text-slate-500 mt-2">
          With extra large padding for featured content that needs more
          breathing room.
        </p>
      </div>
    ),
    padding: "xl",
    hover: true,
    animate: true,
  },
};
