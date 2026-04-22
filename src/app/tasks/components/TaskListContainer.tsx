//✅ Client Component — usa useState, useMemo
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Task } from '@/app/utils/mockDataTasks';
import { useTasks } from '@/app/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { LoadingSkeleton } from '@/app/components/atoms/LoadingSkeleton';

type FilterValue = 'all' | Task['status'];

const statusColumns: { status: Task['status']; label: string }[] = [
  { status: 'todo', label: 'Por hacer' },
  { status: 'in_progress', label: 'En progreso' },
  { status: 'done', label: 'Completadas' },
];

export function TaskListContainer() {
  const { tasks, isLoading, error } = useTasks();
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
      return tasks.filter(task => {
        const matchesStatus =
          filter === 'all' ? true : task.status === filter;

        const matchesSearch = task.title
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
      });
    }, [filter, tasks, search],
  );

  const totalCount = useMemo(() => tasks.length, [tasks]);
  const filteredCount = useMemo(() => filteredTasks.length, [filteredTasks]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ margin: 0 }}>
          Tareas ({filteredCount}/{totalCount})
        </h2>

        <Link
          href="/tasks/addTask"
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Agregar
        </Link>
      </div>

      <TaskFilters
        current={filter}
        onChange={setFilter}
        search={search}
        onSearchChange={setSearch}
      />

      {isLoading ? (
        <LoadingSkeleton count={5} />
      ) : error ? (
        <p
          style={{
            color: 'red',
            textAlign: 'center',
            padding: '32px',
          }}
        >
          Error al cargar las tareas.
        </p>
      ) : filteredTasks.length === 0 ? (
        <p
          style={{
            color: '#94a3b8',
            textAlign: 'center',
            padding: '32px',
          }}
        >
          No hay tareas con este filtro.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          {statusColumns.map((column) => {
            const columnTasks = filteredTasks.filter(
              (task) => task.status === column.status,
            );

            return (
              <div
                key={column.status}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px',
                  minHeight: '420px',
                }}
              >
                <div
                  style={{
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '15px',
                      color: '#0f172a',
                    }}
                  >
                    {column.label}
                  </h3>

                  <span
                    style={{
                      fontSize: '12px',
                      backgroundColor: '#e2e8f0',
                      color: '#334155',
                      borderRadius: '999px',
                      padding: '2px 8px',
                    }}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                {columnTasks.length === 0 ? (
                  <p
                    style={{
                      color: '#94a3b8',
                      textAlign: 'center',
                      padding: '24px 8px',
                      fontSize: '14px',
                    }}
                  >
                    Sin tareas
                  </p>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}