import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useProjects } from '@/app/hooks/useProjects';
import { ProjectContextProvider } from '@/app/projects/context/projectContext';

vi.mock('@/app/services/proyectService', () => ({
  proyectService: {
    fetchProyects: vi.fn().mockResolvedValue([]),
    createProyect: vi.fn(async (proyect) => proyect),
    updateProyect: vi.fn(async (id, updates) => ({
      id,
      title: 'Proyecto de prueba modificada',
      description: 'Descripción de prueba',
      status: 'in_progress',
      priority: 'high',
      createdAt: Date.now().toString(),
      ...updates,
    })),
    deleteProyect: vi.fn().mockResolvedValue(undefined),
  },
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ProjectContextProvider>{children}</ProjectContextProvider>;
}

describe('useProjects hook', () => {
  it('agrega una proyecto correctamente', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.addProject({
        id: '1',
        title: 'Proyecto de prueba',
        description: 'Descripción de prueba',
        status: 'in_progress',
        priority: 'high',
        createdAt: Date.now().toString(),
      });
    });

    expect(result.current.projects).toHaveLength(1);
    expect(result.current.projects[0].title).toBe('Proyecto de prueba');
  });

  it('modifica una proyecto correctamente', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.addProject({
        id: '1',
        title: 'Proyecto de prueba',
        description: 'Descripción de prueba',
        status: 'in_progress',
        priority: 'high',
        createdAt: Date.now().toString(),
      });
    });

    const proyectId = result.current.projects[0].id;

    await act(async () => {
      await result.current.updateProject(proyectId, {
        title: 'Proyecto de prueba modificada',
      });
    });

    expect(result.current.projects[0].title).toBe('Proyecto de prueba modificada');
  });

  it('obtiene una proyecto por id', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.addProject({
        id: '1',
        title: 'Proyecto de prueba',
        description: 'Descripción de prueba',
        status: 'in_progress',
        priority: 'high',
        createdAt: Date.now().toString(),
      });

      await result.current.addProject({
        id: '2',
        title: 'Proyecto de prueba 2',
        description: 'Descripción de prueba 2',
        status: 'in_progress',
        priority: 'medium',
        createdAt: Date.now().toString(),
      });
    });

    const proyectId = result.current.projects[0].id;
    const proyectById = result.current.getProjectById(proyectId);
    const ProjectByEmptyId = result.current.getProjectById("");

    expect(proyectById).toBeDefined();
    expect(proyectById?.id).toBe(proyectId);
    expect(ProjectByEmptyId).toBeUndefined();
  });
});