import {
  Eye,
  Video,
  Headphones,
  Activity,
  Sparkles,
  Rocket,
  Music,
  Volume,
  Wrench,
  ListOrdered,
  CheckSquare,
  Users,
  List,
  BookOpen,
  Mic,
  MessageCircle,
  Target,
  Zap,
  Globe,
  Cpu,
  Lightbulb,
} from "lucide-react";

export function getIconComponent(iconName) {
  switch (iconName) {
    case "Eye":
      return Eye;
    case "Video":
      return Video;
    case "Headphones":
      return Headphones;
    case "Activity":
      return Activity;
    case "Sparkles":
      return Sparkles;
    case "Rocket":
      return Rocket;
    case "Music":
      return Music;
    case "Volume":
      return Volume;
    case "Wrench":
      return Wrench;
    case "ListOrdered":
      return ListOrdered;
    case "CheckSquare":
      return CheckSquare;
    case "Users":
      return Users;
    case "List":
      return List;
    case "BookOpen":
      return BookOpen;
    case "Mic":
      return Mic;
    case "MessageCircle":
      return MessageCircle;
    case "Target":
      return Target;
    case "Zap":
      return Zap;
    case "Globe":
      return Globe;
    case "Cpu":
      return Cpu;
    case "Lightbulb":
      return Lightbulb;
    default:
      return Video;
  }
}
