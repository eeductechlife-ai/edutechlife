export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin' | 'smartboard';
  avatarUrl?: string;
}

export interface Module {
  id: number;
  title: string;
  objective: string;
  description: string;
  icon: string;
  duration: string;
  topics: Topic[];
}

export interface Topic {
  title: string;
  icon: string;
  resources: number;
  duration: string;
}

export interface Progress {
  userId: string;
  moduleId: number;
  completed: boolean;
  score: number;
  completedAt?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'ova' | 'document';
  url: string;
  duration: string;
  estimatedTime?: string;
  pages?: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'challenge';
  duration: number;
  resources: Resource[];
}
