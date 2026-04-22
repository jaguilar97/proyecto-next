//✅ Server Component — solo renderiza HTML
import React from 'react';
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

export const TaskCard = React.memo(function TaskCard({ task, onStatusChange }: TaskCardProps)
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
        <div
            className="cardGen"
            style={{
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${priorityColors[task.priority]}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '8px',
                backgroundColor: '#fff',
                width: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}
            >
            <div
                style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: '8px',
                flexWrap: 'wrap',
                }}
            >
                <h3
                style={{
                    margin: 0,
                    fontSize: '16px',
                    wordBreak: 'break-word',
                    flex: 1,
                }}
                >
                {task.title}
                </h3>

                <span
                style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    whiteSpace: 'nowrap',
                }}
                >
                {statusLabels[task.status]}
                </span>
            </div>

            <p
                style={{
                color: '#64748b',
                fontSize: '14px',
                margin: '8px 0',
                wordBreak: 'break-word',
                }}
            >
                {task.description}
            </p>

            <div
                style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#94a3b8',
                gap: '8px',
                flexWrap: 'wrap',
                }}
            >
                <span style={{ wordBreak: 'break-word' }}>{projectTitle}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{task.createdAt}</span>
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <Link
                href={`/tasks/updateTask/${task.id}`}
                className="bg-yellow-500 text-white py-1 rounded text-center w-full"
                >
                Editar
                </Link>

                <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white py-1 rounded w-full"
                >
                Eliminar
                </button>
            </div>
        </div>
    );
});