import { mockProjects, type Project } from '@/app/utils/mockDataProjects';

const mockProjectsDb: Project[] = [...mockProjects];

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const projectService = {
  async fetchProjects(signal?: AbortSignal): Promise<Project[]> {
    await delay(800);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    return [...mockProjectsDb];
  },

  async fetchProjectById(id: string, signal?: AbortSignal): Promise<Project> {
    await delay(800);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const project = mockProjectsDb.find((t) => t.id === id);

    if (!project) {
      throw new Error('Project not found');
    }

    return { ...project };
  },

  async createProject(
    projectData: Project,
    signal?: AbortSignal,
  ): Promise<Project> {
    await delay(800);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    mockProjectsDb.push(projectData);
    return { ...projectData };
  },

  async updateProject(
    id: string,
    updates: Partial<Project>,
    signal?: AbortSignal,
  ): Promise<Project> {
    await delay(800);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const index = mockProjectsDb.findIndex((project) => project.id === id);

    if (index === -1) {
      throw new Error('Project not found');
    }

    mockProjectsDb[index] = {
      ...mockProjectsDb[index],
      ...updates,
    };

    return { ...mockProjectsDb[index] };
  },

  async deleteProject(id: string, signal?: AbortSignal): Promise<void> {
    await delay(700);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const index = mockProjectsDb.findIndex((project) => project.id === id);

    if (index === -1) {
      throw new Error('Project not found');
    }

    mockProjectsDb.splice(index, 1);
  },
};