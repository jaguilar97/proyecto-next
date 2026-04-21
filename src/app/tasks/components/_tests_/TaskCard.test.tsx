import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '../TaskCard';
import type { Task } from '@/app/utils/mockDataTasks';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/app/hooks/useTasks', () => ({
  useTasks: () => ({
    deleteTask: vi.fn(),
  }),
}));

describe('componente TaskCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Tarea de prueba',
    description: 'Esto es un test de prueba',
    status: 'in_progress',
    priority: 'high',
    project: '1',
    createdAt: Date.now().toString(),
  };

  it('renderiza el título de la tarea', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
  });

  it('renderiza la descripción de la tarea', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText('Esto es un test de prueba')).toBeInTheDocument();
  });

  it('muestra el estado de la tarea', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText(/En progreso/i)).toBeInTheDocument();
  });

  it('aplica el color correcto según la prioridad', () => {
    render(<TaskCard task={mockTask} />);

    const card = document.querySelector('.cardGen');
    expect(card).toHaveStyle('border-left: 4px solid #ef4444');
});

  it('muestra los botones de editar y eliminar', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText(/editar/i)).toBeInTheDocument();
    expect(screen.getByText(/eliminar/i)).toBeInTheDocument();
  });
});