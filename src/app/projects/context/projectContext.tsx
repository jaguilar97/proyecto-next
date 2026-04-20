//✅ Client Component — usa useContext, useReducer
'use client';

import React, { createContext, useContext, useReducer } from 'react';
import type { Project } from '@/app/utils/mockDataProjects';

type ProjectAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string };

interface ProjectContextType {
  projects: Project[];
  dispatch: React.Dispatch<ProjectAction>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

function projectReducer(state: Project[], action: ProjectAction): Project[] {
  switch (action.type) {
    case 'SET_PROJECTS':
      return action.payload;

    case 'ADD_PROJECT':
      return [action.payload, ...state];

    case 'UPDATE_PROJECT':
      return state.map((project) =>
        project.id === action.payload.id ? action.payload : project,
      );

    case 'DELETE_PROJECT':
      return state.filter((project) => project.id !== action.payload);

    default:
      return state;
  }
}

export function ProjectContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, dispatch] = useReducer(projectReducer, []);

  return (
    <ProjectContext.Provider value={{ projects, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProjectContext debe usarse dentro de ProjectContextProvider');
  }

  return context;
}