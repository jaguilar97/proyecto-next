//✅ Client Component — usa useEffect, useCallback, useProjectContext, useAsync
'use client';

import { useEffect, useCallback } from 'react';
import { useProjectContext } from '@/app/projects/context/projectContext';
import { useAsync } from '@/app/hooks/useAsync';
import { projectService } from '@/app/services/projectService';
import type { Project } from '@/app/utils/mockDataProjects';

export function useProjects() {
  const { projects, dispatch } = useProjectContext();

  const fetchProjects = useCallback(async (signal: AbortSignal) => {
    return await projectService.fetchProjects(signal);
  }, []);

  const { data, isLoading, error, refetch } = useAsync<Project[]>(
    fetchProjects,
    true,
  );

  useEffect(() => {
    if (data && projects.length === 0) {
      dispatch({
        type: 'SET_PROJECTS',
        payload: data,
      });
    }
  }, [data, dispatch, projects.length]);

  const addProject = async (project: Project) => {
    const createdProject = await projectService.createProject(project);

    dispatch({
      type: 'ADD_PROJECT',
      payload: createdProject,
    });

    return createdProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updatedProject = await projectService.updateProject(id, updates);

    dispatch({
      type: 'UPDATE_PROJECT',
      payload: updatedProject,
    });

    return updatedProject;
  };

  const deleteProject = async (id: string) => {
    await projectService.deleteProject(id);

    dispatch({
      type: 'DELETE_PROJECT',
      payload: id,
    });
  };

  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    isLoading,
    error,
    refetch,
  };
}