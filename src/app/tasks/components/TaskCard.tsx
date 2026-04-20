import type { Task, TaskPriority, TaskStatus } from '@/app/utils/mockDataTasks';
import { mockProjects } from '@/app/utils/mockDataProjects';
import { useTasks } from '@/app/hooks/useTasks';
import Link from 'next/link';

const priorityColors: Record<TaskPriority, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
};
const statusLabels: Record<TaskStatus, string> = {
    todo: 'Por hacer',
    in_progress: 'En progreso',
    done: 'Completada',
};

interface TaskCardProps {
    task: Task;
    onStatusChange?: (taskId: string, newStatus: TaskStatus)
    => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps)
{
    const { deleteTask } = useTasks();

    const projectData = mockProjects.find((proj) => proj.id === task.project);
    const projectTitle = projectData?.title ?? 'Proyecto no encontrado';

    const handleDelete = async () => {
    const confirmed = window.confirm('¿Deseas eliminar esta tarea?');

    if (!confirmed) {
      return;
    }

    await deleteTask(task.id);
  };

    return (
            <div className='cardGen' style={{
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${priorityColors[task.priority]}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '8px',
                backgroundColor: '#fff',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{task.title}</h3>
                <span style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    }}>
                    {statusLabels[task.status]}
                </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '8px 0' }}>{task.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>{ projectTitle }</span>
                    <span>{task.createdAt}</span>
                </div>
                <div className="flex items-center gap-3 mt-4">
                    <Link
                        href={`/tasks/updateTask/${task.id}`}
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
}