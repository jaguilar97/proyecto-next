import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskListContainer } from '../TaskListContainer';
import type { Task } from '@/app/utils/mockDataTasks';

const mockUseTasks = vi.fn();

vi.mock('@/app/hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
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

vi.mock('../TaskCard', () => ({
  TaskCard: ({ task }: { task: Task }) => (
    <div data-testid="task-card">{task.title}</div>
  ),
}));

vi.mock('@/app/components/atoms/LoadingSkeleton', () => ({
  LoadingSkeleton: ({ count }: { count: number }) => (
    <div data-testid="loading-skeleton">Loading {count}</div>
  ),
}));

vi.mock('../TaskFilters', () => ({
  TaskFilters: ({
    current,
    onChange,
    search,
    onSearchChange,
  }: {
    current: string;
    onChange: (value: 'all' | Task['status']) => void;
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

describe('TaskListContainer', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Tarea Todo',
      description: 'Descripción 1',
      status: 'todo',
      priority: 'high',
      project: '1',
      createdAt: '2026-01-01',
    },
    {
      id: '2',
      title: 'Tarea En Progreso',
      description: 'Descripción 2',
      status: 'in_progress',
      priority: 'medium',
      project: '1',
      createdAt: '2026-01-02',
    },
    {
      id: '3',
      title: 'Tarea Done',
      description: 'Descripción 3',
      status: 'done',
      priority: 'low',
      project: '2',
      createdAt: '2026-01-03',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el título, contador y botón para agregar', () => {
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
    });

    render(<TaskListContainer />);

    expect(screen.getByText('Tareas (3/3)')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
  });

  it('muestra loading cuando isLoading es true', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: true,
      error: null,
    });

    render(<TaskListContainer />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando ocurre uno', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: new Error('Error de prueba'),
    });

    render(<TaskListContainer />);

    expect(screen.getByText('Error al cargar las tareas.')).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay tareas filtradas', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: null,
    });

    render(<TaskListContainer />);

    expect(screen.getByText('No hay tareas con este filtro.')).toBeInTheDocument();
  });

  it('renderiza las tres columnas del tablero kanban', () => {
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
    });

    render(<TaskListContainer />);

    expect(screen.getByText('Por hacer')).toBeInTheDocument();
    expect(screen.getByText('En progreso')).toBeInTheDocument();
    expect(screen.getByText('Completadas')).toBeInTheDocument();
  });

  it('renderiza las tareas en sus columnas', () => {
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
    });

    render(<TaskListContainer />);

    expect(screen.getByText('Tarea Todo')).toBeInTheDocument();
    expect(screen.getByText('Tarea En Progreso')).toBeInTheDocument();
    expect(screen.getByText('Tarea Done')).toBeInTheDocument();
    expect(screen.getAllByTestId('task-card')).toHaveLength(3);
  });

  it('filtra las tareas por status', () => {
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
    });

    render(<TaskListContainer />);

    fireEvent.click(screen.getByText('Filtro todo'));

    expect(screen.getByText('Tareas (1/3)')).toBeInTheDocument();
    expect(screen.getByText('Tarea Todo')).toBeInTheDocument();
    expect(screen.queryByText('Tarea En Progreso')).not.toBeInTheDocument();
    expect(screen.queryByText('Tarea Done')).not.toBeInTheDocument();
  });

  it('filtra las tareas por búsqueda en el título', () => {
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
    });

    render(<TaskListContainer />);

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Done' },
    });

    expect(screen.getByText('Tareas (1/3)')).toBeInTheDocument();
    expect(screen.getByText('Tarea Done')).toBeInTheDocument();
    expect(screen.queryByText('Tarea Todo')).not.toBeInTheDocument();
    expect(screen.queryByText('Tarea En Progreso')).not.toBeInTheDocument();
  });

  it('combina filtro por status y búsqueda', () => {
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
    });

    render(<TaskListContainer />);

    fireEvent.click(screen.getByText('Filtro in_progress'));
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Progreso' },
    });

    expect(screen.getByText('Tareas (1/3)')).toBeInTheDocument();
    expect(screen.getByText('Tarea En Progreso')).toBeInTheDocument();
    expect(screen.queryByText('Tarea Todo')).not.toBeInTheDocument();
    expect(screen.queryByText('Tarea Done')).not.toBeInTheDocument();
  });
});