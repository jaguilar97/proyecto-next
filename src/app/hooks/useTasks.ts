'use client';

import { useEffect, useCallback } from 'react';
import { useTaskContext } from '@/app/tasks/context/taskContext';
import { useAsync } from '@/app/hooks/useAsync';
import { taskService } from '@/app/services/taskService';
import type { Task } from '@/app/utils/mockDataTasks';

type CreateTaskInput = Task;

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

  const addTask = async (taskData: CreateTaskInput) => {
    const createdTask = await taskService.createTask(taskData);

    dispatch({
      type: 'ADD_TASK',
      payload: createdTask,
    });

    return createdTask;
  };

  return {
    tasks,
    addTask,
    isLoading,
    error,
    refetch,
  };
}