import { mockTasks, type Task } from '@/app/utils/mockDataTasks';

const mockTasksDb: Task[] = [...mockTasks];

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const taskService = {
  async fetchTasks(signal?: AbortSignal): Promise<Task[]> {
    await delay(800);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    return [...mockTasksDb];
  },

  async fetchTaskById(id: string, signal?: AbortSignal): Promise<Task> {
    await delay(800);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const task = mockTasksDb.find((t) => t.id === id);

    if (!task) {
      throw new Error('Task not found');
    }

    return { ...task };
  },

  async fetchTasksByProject(
    projectId: string,
    signal?: AbortSignal,
  ): Promise<Task[]> {
    await delay(1200);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    return mockTasksDb.filter((task) => task.project === projectId);
  },

  async createTask(
    taskData: Task,
    signal?: AbortSignal,
  ): Promise<Task> {
    await delay(800);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    mockTasksDb.push(taskData);
    return { ...taskData };
  },

  async updateTask(
    id: string,
    updates: Partial<Task>,
    signal?: AbortSignal,
  ): Promise<Task> {
    await delay(800);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const index = mockTasksDb.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error('Task not found');
    }

    mockTasksDb[index] = {
      ...mockTasksDb[index],
      ...updates,
    };

    return { ...mockTasksDb[index] };
  },

  async deleteTask(id: string, signal?: AbortSignal): Promise<void> {
    await delay(700);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const index = mockTasksDb.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error('Task not found');
    }

    mockTasksDb.splice(index, 1);
  },
};