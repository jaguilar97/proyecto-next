import { mockTasks, type Task } from '@/app/utils/mockDataTasks';

const mockTasksDb: Task[] = [...mockTasks];

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const taskService = {
  async fetchTasks(signal?: AbortSignal): Promise<Task[]> {
    await delay(1500);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    return [...mockTasksDb];
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
    await delay(1500);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const newTask: Task = {
      ...taskData,
    };

    mockTasksDb.push(newTask);
    return newTask;
  },

  async updateTask(
    id: string,
    updates: Partial<Task>,
    signal?: AbortSignal,
  ): Promise<Task> {
    await delay(600);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const task = mockTasksDb.find((t) => t.id === id);

    if (!task) {
      throw new Error('Task not found');
    }

    Object.assign(task, updates);
    return task;
  },
};