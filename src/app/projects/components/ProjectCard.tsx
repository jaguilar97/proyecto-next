//✅ Server Component — solo renderiza HTML
import type { Project, ProjectStatus, ProjectPriority } from '@/app/utils/mockDataProjects';

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
    onStatusChange?: (taskId: string, newStatus: ProjectStatus)
    => void;
}

export function ProjectCard({ project, onStatusChange }: ProjectCardProps)
{
    return (
        <div className='cardGen'>
            <div style={{
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>{project.createdAt}</span>
                </div>
            </div>
        </div>
    );
}