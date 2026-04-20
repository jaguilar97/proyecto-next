//✅ Client Component — usa useRouter, useProjects, useForm
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjects } from '@/app/hooks/useProjects';
import { useForm } from '@/app/hooks/useForm';
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
} from '@/app/utils/mockDataProjects';

const initialValues = {
  title: '',
  description: '',
  status: PROJECT_STATUSES.TODO,
  priority: PROJECT_PRIORITIES.MEDIUM,
};

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

export function AddProjectForm() {
  const router = useRouter();
  const { addProject } = useProjects();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues,
    validate: validateProjectForm,
    onSubmit: async (formData) => {
      await addProject({
        id: crypto.randomUUID(),
        title: String(formData.title),
        description: String(formData.description),
        status: String(formData.status) as
          | typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES],
        priority: String(formData.priority) as
          | typeof PROJECT_PRIORITIES[keyof typeof PROJECT_PRIORITIES],
        createdAt: Date.now().toString(),
      });

      router.push('/projects');
    },
  });

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
          placeholder="Título"
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
          placeholder="Descripción"
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
          style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar proyecto'}
        </button>

        <span className="bg-red-600 text-white px-10 py-2.5 rounded">
          <Link href="/projects">Cancelar</Link>
        </span>
      </div>
    </form>
  );
}