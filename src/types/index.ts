export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl: string;
  category: 'Full Stack' | 'Frontend' | 'Backend' | 'Deep Learning' | 'Mobile';
  gradient: string;
  imageUrl?: string;
  showGithub?: boolean;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  type: 'Full-time' | 'Freelance' | 'Training' | 'Voluntary' | 'Self-Learning';
  period: string;
  description: string;
  skills: string[];
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
