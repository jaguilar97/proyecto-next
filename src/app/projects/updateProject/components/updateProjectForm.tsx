//✅ Client Component — usa useEffect, useRouter, useProjects, useForm
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjects } from '@/app/hooks/useProjects';
import { useForm } from '@/app/hooks/useForm';
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
} from '@/app/utils/mockDataProjects';

interface EditProjectFormProps {
  projectId: string;
}

function validateProjectForm(values: Record<string, string | boolean>) {
  const errors: Record<string, string> = {};

  const title = String(values.title ?? '').trim();
  const description = String(values.description ?? '').trim();
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

  if (!status) {
    errors.status = 'Debes seleccionar un estado';
  }

  if (!priority) {
    errors.priority = 'Debes seleccionar una prioridad';
  }

  return errors;
}

export function EditProjectForm({ projectId }: EditProjectFormProps) {
  const router = useRouter();
  const { getProjectById, updateProject } = useProjects();

  const project = getProjectById(projectId);

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
      status: PROJECT_STATUSES.TODO,
      priority: PROJECT_PRIORITIES.MEDIUM,
    },
    validate: validateProjectForm,
    onSubmit: async (formData) => {
      await updateProject(projectId, {
        title: String(formData.title),
        description: String(formData.description),
        status: String(formData.status) as
          | typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES],
        priority: String(formData.priority) as
          | typeof PROJECT_PRIORITIES[keyof typeof PROJECT_PRIORITIES],
      });

      router.push('/projects');
    },
  });

  useEffect(() => {
    if (project) {
      setValues({
        title: project.title,
        description: project.description,
        status: project.status,
        priority: project.priority,
      });
    }
  }, [project, setValues]);

  if (!project) {
    return <p className="text-red-600">No se encontró el proyecto.</p>;
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
          value={String(values.status ?? PROJECT_STATUSES.TODO)}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded px-3 py-2"
        >
          <option value={PROJECT_STATUSES.TODO}>To do</option>
          <option value={PROJECT_STATUSES.IN_PROGRESS}>In progress</option>
          <option value={PROJECT_STATUSES.DONE}>Done</option>
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
          value={String(values.priority ?? PROJECT_PRIORITIES.MEDIUM)}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded px-3 py-2"
        >
          <option value={PROJECT_PRIORITIES.LOW}>Low</option>
          <option value={PROJECT_PRIORITIES.MEDIUM}>Medium</option>
          <option value={PROJECT_PRIORITIES.HIGH}>High</option>
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
          {isSubmitting ? 'Guardando...' : 'Actualizar proyecto'}
        </button>

        <Link
          href="/projects"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}