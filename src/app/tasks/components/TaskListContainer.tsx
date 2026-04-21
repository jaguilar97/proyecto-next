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

      <TaskFilters current={filter} onChange={setFilter} search={search} onSearchChange={setSearch} />

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
        filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  );
}