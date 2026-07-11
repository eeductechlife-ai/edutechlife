import { memo } from "react";
import { tutorAvatars, DEFAULT_AVATAR } from "../../../data/tutorAvatars";

// ==========================================
// Dani Avatar Component
// ==========================================
const DaniAvatar = memo(() => (
  <img
    src={tutorAvatars.Dani || DEFAULT_AVATAR}
    alt="Dani"
    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30 flex-shrink-0"
  />
));

DaniAvatar.displayName = "DaniAvatar";

export default DaniAvatar;
