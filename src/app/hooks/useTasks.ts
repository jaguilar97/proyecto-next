//✅ Client Component — usa useEffect, useCallback, useTaskContext, useAsync
'use client';

import { useEffect, useCallback } from 'react';
import { useTaskContext } from '@/app/tasks/context/taskContext';
import { useAsync } from '@/app/hooks/useAsync';
import { taskService } from '@/app/services/taskService';
import type { Task } from '@/app/utils/mockDataTasks';

export function useTasks() {
  const { tasks, dispatch } = useTaskContext();

  const fetchTasks = useCallback(async (signal: AbortSignal) => {
    return await taskService.fetchTasks(signal);
  }, []);

  const { data, isLoading, error, refetch } = useAsync<Task[]>(
    fetchTasks,
    true,
  );

  useEffect(() => {
    if (data && tasks.length === 0) {
      dispatch({
        type: 'SET_TASKS',
        payload: data,
      });
    }
  }, [data, dispatch, tasks.length]);

  const addTask = async (task: Task) => {
    const createdTask = await taskService.createTask(task);

    dispatch({
      type: 'ADD_TASK',
      payload: createdTask,
    });

    return createdTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updatedTask = await taskService.updateTask(id, updates);

    dispatch({
      type: 'UPDATE_TASK',
      payload: updatedTask,
    });

    return updatedTask;
  };

  const deleteTask = async (id: string) => {
    await taskService.deleteTask(id);

    dispatch({
      type: 'DELETE_TASK',
      payload: id,
    });
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    isLoading,
    error,
    refetch,
  };
}