import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTasks } from '@/app/hooks/useTasks';
import { TaskContextProvider } from '@/app/tasks/context/taskContext';

vi.mock('@/app/services/taskService', () => ({
  taskService: {
    fetchTasks: vi.fn().mockResolvedValue([]),
    createTask: vi.fn(async (task) => task),
    updateTask: vi.fn(async (id, updates) => ({
      id,
      title: 'Tarea de prueba modificada',
      description: 'Descripción de prueba',
      status: 'in_progress',
      priority: 'high',
      project: '1',
      createdAt: Date.now().toString(),
      ...updates,
    })),
    deleteTask: vi.fn().mockResolvedValue(undefined),
  },
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <TaskContextProvider>{children}</TaskContextProvider>;
}

describe('useTasks hook', () => {
  it('agrega una tarea correctamente', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.addTask({
        id: '1',
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
        status: 'in_progress',
        priority: 'high',
        project: '1',
        createdAt: Date.now().toString(),
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Tarea de prueba');
  });

  it('modifica una tarea correctamente', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.addTask({
        id: '1',
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
        status: 'in_progress',
        priority: 'high',
        project: '1',
        createdAt: Date.now().toString(),
      });
    });

    const taskId = result.current.tasks[0].id;

    await act(async () => {
      await result.current.updateTask(taskId, {
        title: 'Tarea de prueba modificada',
      });
    });

    expect(result.current.tasks[0].title).toBe('Tarea de prueba modificada');
  });

  it('elimina una tarea por id', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.addTask({
        id: '1',
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
        status: 'in_progress',
        priority: 'high',
        project: '1',
        createdAt: Date.now().toString(),
      });
    });

    const taskId = result.current.tasks[0].id;

    await act(async () => {
      await result.current.deleteTask(taskId);
    });
    
    expect(result.current.tasks).toHaveLength(0);

    await act(async () => {
      await result.current.addTask({
        id: '1',
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
        status: 'in_progress',
        priority: 'high',
        project: '1',
        createdAt: Date.now().toString(),
      });
    });

    await act(async () => {
      await result.current.deleteTask("2");
    });
    
    expect(result.current.tasks).toHaveLength(1);
  });

  it('obtiene una tarea por id', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.addTask({
        id: '1',
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
        status: 'in_progress',
        priority: 'high',
        project: '1',
        createdAt: Date.now().toString(),
      });

      await result.current.addTask({
        id: '2',
        title: 'Tarea de prueba 2',
        description: 'Descripción de prueba 2',
        status: 'in_progress',
        priority: 'medium',
        project: '1',
        createdAt: Date.now().toString(),
      });
    });

    const taskId = result.current.tasks[0].id;
    const taskById = result.current.getTaskById(taskId);
    const TaskByEmptyId = result.current.getTaskById("");

    expect(taskById).toBeDefined();
    expect(taskById?.id).toBe(taskId);
    expect(TaskByEmptyId).toBeUndefined();
  });
});