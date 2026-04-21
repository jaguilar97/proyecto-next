//✅ Server Component — solo renderiza HTML
import React from 'react';
import type { Project, ProjectPriority, ProjectStatus } from '@/app/utils/mockDataProjects';
import { useProjects } from '@/app/hooks/useProjects';
import Link from 'next/link';

const priorityColors: Record<ProjectPriority, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
};
const statusLabels: Record<ProjectStatus, string> = {
    todo: 'Por hacer',
    in_progress: 'En progreso',
    done: 'Completada',
};

interface ProjectCardProps {
    project: Project;
    onStatusChange?: (projectId: string, newStatus: ProjectStatus)
    => void;
}

export const ProjectCard = React.memo(function ProjectCard({ project, onStatusChange }: ProjectCardProps)
{
    const { deleteProject } = useProjects();

    const handleDelete = async () => {
    const confirmed = window.confirm('¿Deseas eliminar este proyecto?');

    if (!confirmed) {
      return;
    }

    await deleteProject(project.id);
  };

    return (
            <div className='cardGen' style={{
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${priorityColors[project.priority]}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '8px',
                backgroundColor: '#fff',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{project.title}</h3>
                <span style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    }}>
                    {statusLabels[project.status]}
                </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '8px 0' }}>{project.description}</p>
                <div className="flex items-center gap-3 mt-4">
                    <Link
                        href={`/projects/updateProject/${project.id}`}
                        className="bg-yellow-500 text-white px-14 py-1 rounded"
                    >
                    Editar
                    </Link>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                    Eliminar
                    </button>
                </div>
            </div>
    );
});