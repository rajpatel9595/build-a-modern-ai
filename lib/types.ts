export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  imageUrl: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  category: string
  featured: boolean
}

export interface ResearchItem {
  id: string
  title: string
  description: string
  type: string
  date: string
  tags: string[]
  notebookUrl: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: number
  tags: string[]
  imageUrl: string
}

export interface SkillCategory {
  id: string
  category: string
  color: string
  icon: string
  skills: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}
