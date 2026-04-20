'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTasks } from '@/app/hooks/useTasks';
import { useForm } from '@/app/hooks/useForm';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '@/app/utils/mockDataTasks';
import { mockProjects } from '@/app/utils/mockDataProjects';

interface EditTaskFormProps {
  taskId: string;
}

function validateTaskForm(values: Record<string, string | boolean>) {
  const errors: Record<string, string> = {};

  const title = String(values.title ?? '').trim();
  const description = String(values.description ?? '').trim();
  const project = String(values.project ?? '').trim();
  const status = String(values.status ?? '').trim();
  const priority = String(values.priority ?? '').trim();

  if (!title) {
    errors.title = 'El título es requerido';
  } else if (title.length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres';
  }

  if (!description) {
    errors.description = 'La descripción es requerida';
  } else if (description.length < 5) {
    errors.description = 'La descripción debe tener al menos 5 caracteres';
  }

  if (!project) {
    errors.project = 'Debes seleccionar un proyecto';
  }

  if (!status) {
    errors.status = 'Debes seleccionar un estado';
  }

  if (!priority) {
    errors.priority = 'Debes seleccionar una prioridad';
  }

  return errors;
}

export function EditTaskForm({ taskId }: EditTaskFormProps) {
  const router = useRouter();
  const { getTaskById, updateTask } = useTasks();

  const task = getTaskById(taskId);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm({
    initialValues: {
      title: '',
      description: '',
      project: '',
      status: TASK_STATUSES.TODO,
      priority: TASK_PRIORITIES.MEDIUM,
    },
    validate: validateTaskForm,
    onSubmit: async (formData) => {
      await updateTask(taskId, {
        title: String(formData.title),
        description: String(formData.description),
        project: String(formData.project),
        status: String(formData.status) as
          | typeof TASK_STATUSES[keyof typeof TASK_STATUSES],
        priority: String(formData.priority) as
          | typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES],
      });

      router.push('/tasks');
    },
  });

  useEffect(() => {
    if (task) {
      setValues({
        title: task.title,
        description: task.description,
        project: task.project,
        status: task.status,
        priority: task.priority,
      });
    }
  }, [task, setValues]);

  if (!task) {
    return <p className="text-red-600">No se encontró la tarea.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1">
          Título
        </label>
        {errors.title && (
          <p className="text-red-600 text-sm mb-1">{errors.title}</p>
        )}
        <input
          id="title"
          name="title"
          type="text"
          value={String(values.title ?? '')}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">
          Descripción
        </label>
        {errors.description && (
          <p className="text-red-600 text-sm mb-1">{errors.description}</p>
        )}
        <textarea
          id="description"
          name="description"
          value={String(values.description ?? '')}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="status" className="block mb-1">
          Estado
        </label>
        {errors.status && (
          <p className="text-red-600 text-sm mb-1">{errors.status}</p>
        )}
        <select
          id="status"
          name="status"
          value={String(values.status ?? TASK_STATUSES.TODO)}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded px-3 py-2"
        >
          <option value={TASK_STATUSES.TODO}>To do</option>
          <option value={TASK_STATUSES.IN_PROGRESS}>In progress</option>
          <option value={TASK_STATUSES.DONE}>Done</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block mb-1">
          Prioridad
        </label>
        {errors.priority && (
          <p className="text-red-600 text-sm mb-1">{errors.priority}</p>
        )}
        <select
          id="priority"
          name="priority"
          value={String(values.priority ?? TASK_PRIORITIES.MEDIUM)}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded px-3 py-2"
        >
          <option value={TASK_PRIORITIES.LOW}>Low</option>
          <option value={TASK_PRIORITIES.MEDIUM}>Medium</option>
          <option value={TASK_PRIORITIES.HIGH}>High</option>
        </select>
      </div>

      <div>
        <label htmlFor="project" className="block mb-1">
          Proyecto
        </label>
        {errors.project && (
          <p className="text-red-600 text-sm mb-1">{errors.project}</p>
        )}
        <select
          id="project"
          name="project"
          value={String(values.project ?? '')}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Selecciona un proyecto</option>
          {mockProjects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.title}
            </option>
          ))}
        </select>
      </div>

      {errors.submit && (
        <p className="text-red-600 text-sm">{errors.submit}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Actualizar tarea'}
        </button>

        <Link
          href="/tasks"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}