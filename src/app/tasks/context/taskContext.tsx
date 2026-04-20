//✅ Client Component — usa useContext, useReducer
'use client';

import React, { createContext, useContext, useReducer } from 'react';
import type { Task } from '@/app/utils/mockDataTasks';

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string };

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

    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id ? action.payload : task,
      );

    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);

    default:
      return state;
  }
}

export function TaskContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, dispatch] = useReducer(taskReducer, []);

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