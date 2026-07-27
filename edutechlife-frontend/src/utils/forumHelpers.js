export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const AVATAR_GRADIENTS = [
  "from-petroleum to-petroleum-dark",
  "from-petroleum-dark to-corporate",
  "from-petroleum to-corporate",
  "from-petroleum-dark to-corporate",
  "from-petroleum to-petroleum-dark",
];

export const getAvatarGradient = (name) => {
  if (!name) return AVATAR_GRADIENTS[0];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
};
