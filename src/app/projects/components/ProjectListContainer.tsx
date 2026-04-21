//✅ Client Component — usa useState, useMemo, useProjects
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Project } from '@/app/utils/mockDataProjects';
import { useProjects } from '@/app/hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import { ProjectFilters } from './ProjectFilters';

type FilterValue = 'all' | Project['status'];

export function ProjectListContainer() {
  const { projects, isLoading, error } = useProjects();
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');

  const filteredProjects = useMemo(() => {
      return projects.filter(task => {
        const matchesStatus =
          filter === 'all' ? true : task.status === filter;

        const matchesSearch = task.title
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
      });
    }, [filter, projects, search],
  );

  const totalCount = useMemo(() => projects.length, [projects]);
  const filteredCount = useMemo(() => filteredProjects.length, [filteredProjects]);

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
          Proyectos ({filteredCount}/{totalCount})
        </h2>

        <Link
          href="/projects/addProject"
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

      <ProjectFilters current={filter} onChange={setFilter} search={search} onSearchChange={setSearch} />

      {isLoading ? (
        <p
          style={{
            color: '#94a3b8',
            textAlign: 'center',
            padding: '32px',
          }}
        >
          Cargando proyectos...
        </p>
      ) : error ? (
        <p
          style={{
            color: 'red',
            textAlign: 'center',
            padding: '32px',
          }}
        >
          Error al cargar los proyectos.
        </p>
      ) : filteredProjects.length === 0 ? (
        <p
          style={{
            color: '#94a3b8',
            textAlign: 'center',
            padding: '32px',
          }}
        >
          No hay proyectos con este filtro.
        </p>
      ) : (
        filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
      )}
    </div>
  );
}