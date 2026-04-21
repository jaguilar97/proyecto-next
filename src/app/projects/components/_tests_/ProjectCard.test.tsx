import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProjectCard } from '../ProjectCard';
import { Project } from '@/app/utils/mockDataProjects';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/app/hooks/useProjects', () => ({
  useProjects: () => ({
    deleteProject: vi.fn(),
  }),
}));

describe('componente TaskCard', () => {
  const mockProject: Project = {
    id: '1',
    title: 'Proyecto de prueba',
    description: 'Esto es un proyecto de prueba',
    status: 'in_progress',
    priority: 'high',
    createdAt: Date.now().toString(),
  };

  it('renderiza el título del proyecto', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Proyecto de prueba')).toBeInTheDocument();
  });

  it('renderiza la descripción del proyecto', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Esto es un proyecto de prueba')).toBeInTheDocument();
  });

  it('muestra el estado del proyecto', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText(/En progreso/i)).toBeInTheDocument();
  });

  it('aplica el color correcto según la prioridad', () => {
    render(<ProjectCard project={mockProject} />);

    const card = document.querySelector('.cardGen');
    expect(card).toHaveStyle('border-left: 4px solid #ef4444');
});

  it('muestra los botones de editar y eliminar', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText(/editar/i)).toBeInTheDocument();
    expect(screen.getByText(/eliminar/i)).toBeInTheDocument();
  });
});