import { Projects } from '@/types';

/**
 * Load the projects from the content folder
 */
export const loadProjects = async (): Promise<Projects> => {
  const file = await import('@/content/projects.json');
  return file.default;
};
