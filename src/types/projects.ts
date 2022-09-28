export type Projects = Project[];

export interface Project {
  title: string;
  description: string;
  icon?: string;
  links: ProjectLinks;
}

interface ProjectLinks {
  github: string;
  homepage?: string;
  post?: string;
}
