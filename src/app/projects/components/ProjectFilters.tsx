//✅ Server Component — solo renderiza HTML
import { useEffect, useState } from 'react';
import { ProjectStatus } from "@/app/utils/mockDataProjects";
import { useDebounce } from '@/app/hooks/useDebounce';

type FilterValue = ProjectStatus | 'all';

interface FilterOption {
    value: FilterValue;
    label: string;
}

const filters: FilterOption[] = [
    { value: 'all', label: 'Todos' },
    { value: 'todo', label: 'Por hacer' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'done', label: 'Completados' },
];
interface ProjectFiltersProps {
    current: FilterValue;
    onChange: (value: FilterValue) => void;
    search: string;
    onSearchChange: (value: string) => void;
}

export function ProjectFilters({ current, onChange, search, onSearchChange }: ProjectFiltersProps) {
    const [searchInput, setSearchInput] = useState(search);
    const debouncedSearch = useDebounce(searchInput, 500);

    useEffect(() => {
        onSearchChange(debouncedSearch);
    }, [debouncedSearch, onSearchChange]);

    return (
        <div style={{ marginBottom: '16px' }}>
      
            <input
                type="text"
                placeholder="Buscar por título..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                marginBottom: '12px',
                }}
            />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {filters.map(f => (
                    <button
                    key={f.value}
                    onClick={() => onChange(f.value)}
                    style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: current === f.value ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: current === f.value ? '#eff6ff' : '#fff', color: current === f.value ? '#3b82f6' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '14px',
                    }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );

}