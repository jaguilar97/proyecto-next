'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { mockTasks, type Task } from '@/app/utils/mockDataTasks';

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task };

interface TaskContextType {
  tasks: Task[];
  dispatch: React.Dispatch<TaskAction>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;

    case 'ADD_TASK':
      return [action.payload, ...state];

    default:
      return state;
  }
}

export function TaskContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, dispatch] = useReducer(taskReducer, mockTasks);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTaskContext debe usarse dentro de TaskContextProvider');
  }

  return context;
}