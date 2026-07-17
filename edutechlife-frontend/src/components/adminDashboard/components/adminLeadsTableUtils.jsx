import React from "react";
import { Eye, Ear, Hand } from "lucide-react";

export const MODULES = [
  "Módulo 1 - Intro a IA",
  "Módulo 2 - Prompt Engineering",
  "Módulo 3 - Fundamentos IA",
  "Módulo 4 - Proyectos IA",
  "Módulo 5 - Certificación",
];

export const getVAKIcon = (vak) => {
  switch (vak) {
    case "Visual":
      return <Eye className="w-4 h-4" />;
    case "Auditivo":
      return <Ear className="w-4 h-4" />;
    case "Kinestésico":
      return <Hand className="w-4 h-4" />;
    default:
      return null;
  }
};

export const getVAKColor = (vak) => {
  switch (vak) {
    case "Visual":
      return "text-[#4DA8C4] bg-[#4DA8C4]/20";
    case "Auditivo":
      return "text-[#66CCCC] bg-[#66CCCC]/20";
    case "Kinestésico":
      return "text-[#FF6B9D] bg-[#FF6B9D]/20";
    default:
      return "text-gray-500 bg-gray-500/20";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "away":
      return "bg-yellow-500";
    case "inactive":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};
