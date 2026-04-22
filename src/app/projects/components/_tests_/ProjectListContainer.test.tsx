import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectListContainer } from '../ProjectListContainer';
import type { Project } from '@/app/utils/mockDataProjects';

const mockUseProjects = vi.fn();

vi.mock('@/app/hooks/useProjects', () => ({
  useProjects: () => mockUseProjects(),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('../ProjectCard', () => ({
  ProjectCard: ({ project }: { project: Project }) => (
    <div data-testid="project-card">{project.title}</div>
  ),
}));

vi.mock('@/app/components/atoms/LoadingSkeleton', () => ({
  LoadingSkeleton: ({ count }: { count: number }) => (
    <div data-testid="loading-skeleton">Loading {count}</div>
  ),
}));

vi.mock('../ProjectFilters', () => ({
  ProjectFilters: ({
    current,
    onChange,
    search,
    onSearchChange,
  }: {
    current: string;
    onChange: (value: 'all' | Project['status']) => void;
    search: string;
    onSearchChange: (value: string) => void;
  }) => (
    <div>
      <p data-testid="current-filter">{current}</p>
      <input
        data-testid="search-input"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button onClick={() => onChange('all')}>Filtro all</button>
      <button onClick={() => onChange('todo')}>Filtro todo</button>
      <button onClick={() => onChange('in_progress')}>Filtro in_progress</button>
      <button onClick={() => onChange('done')}>Filtro done</button>
    </div>
  ),
}));

describe('ProjectListContainer', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Proyecto Todo',
      description: 'Descripción 1',
      status: 'todo',
      priority: 'high',
      createdAt: '2026-01-01',
    },
    {
      id: '2',
      title: 'Proyecto En Progreso',
      description: 'Descripción 2',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2026-01-02',
    },
    {
      id: '3',
      title: 'Proyecto Done',
      description: 'Descripción 3',
      status: 'done',
      priority: 'low',
      createdAt: '2026-01-03',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el título, contador y botón para agregar', () => {
    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      error: null,
    });

    render(<ProjectListContainer />);

    expect(screen.getByText('Proyectos (3/3)')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
  });

  it('muestra loading cuando isLoading es true', () => {
    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: true,
      error: null,
    });

    render(<ProjectListContainer />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando ocurre uno', () => {
    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: false,
      error: new Error('Error de prueba'),
    });

    render(<ProjectListContainer />);

    expect(screen.getByText('Error al cargar los proyectos.')).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay projectos filtrados', () => {
    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: false,
      error: null,
    });

    render(<ProjectListContainer />);

    expect(screen.getByText('No hay proyectos con este filtro.')).toBeInTheDocument();
  });

  it('renderiza los proyectos filtrados en la lista', () => {
    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      error: null,
    });

    render(<ProjectListContainer />);

    expect(screen.getByText('Proyecto Todo')).toBeInTheDocument();
    expect(screen.getByText('Proyecto En Progreso')).toBeInTheDocument();
    expect(screen.getByText('Proyecto Done')).toBeInTheDocument();
  });

  it('renderiza los projectos en sus columnas', () => {
    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      error: null,
    });

    render(<ProjectListContainer />);

    expect(screen.getByText('Proyecto Todo')).toBeInTheDocument();
    expect(screen.getByText('Proyecto En Progreso')).toBeInTheDocument();
    expect(screen.getByText('Proyecto Done')).toBeInTheDocument();
    expect(screen.getAllByTestId('project-card')).toHaveLength(3);
  });

  it('filtra los projectos por status', () => {
    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      error: null,
    });

    render(<ProjectListContainer />);

    fireEvent.click(screen.getByText('Filtro todo'));

    expect(screen.getByText('Proyectos (1/3)')).toBeInTheDocument();
    expect(screen.getByText('Proyecto Todo')).toBeInTheDocument();
    expect(screen.queryByText('Proyecto En Progreso')).not.toBeInTheDocument();
    expect(screen.queryByText('Proyecto Done')).not.toBeInTheDocument();
  });

  it('filtra los projectos por búsqueda en el título', () => {
    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      error: null,
    });

    render(<ProjectListContainer />);

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Done' },
    });

    expect(screen.getByText('Proyectos (1/3)')).toBeInTheDocument();
    expect(screen.getByText('Proyecto Done')).toBeInTheDocument();
    expect(screen.queryByText('Proyecto Todo')).not.toBeInTheDocument();
    expect(screen.queryByText('Proyecto En Progreso')).not.toBeInTheDocument();
  });

  it('combina filtro por status y búsqueda', () => {
    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      error: null,
    });

    render(<ProjectListContainer />);

    fireEvent.click(screen.getByText('Filtro in_progress'));
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Progreso' },
    });

    expect(screen.getByText('Proyectos (1/3)')).toBeInTheDocument();
    expect(screen.getByText('Proyecto En Progreso')).toBeInTheDocument();
    expect(screen.queryByText('Proyecto Todo')).not.toBeInTheDocument();
    expect(screen.queryByText('Proyecto Done')).not.toBeInTheDocument();
  });
});