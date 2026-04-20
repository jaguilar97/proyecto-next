export const PROJECT_STATUSES = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
} as const;

export const PROJECT_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
} as const;

export type ProjectStatus = typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES];
export type ProjectPriority = typeof PROJECT_PRIORITIES[keyof typeof PROJECT_PRIORITIES];
export interface Project {
    id: string;
    title: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    createdAt: string;
}

export const mockProjects: Project[] = [
    {
        id: '1',
        title: 'Plataforma de pago UI',
        description: 'Diseñar la página web de la compañía Patitos S.A',
        status: PROJECT_STATUSES.IN_PROGRESS,
        priority: PROJECT_PRIORITIES.HIGH,
        createdAt: '2026-03-30',
    },
    {
        id: '2',
        title: 'Plataforma de pago Backend',
        description: 'Crear API de la compañía Patitos S.A',
        status: PROJECT_STATUSES.TODO,
        priority: PROJECT_PRIORITIES.HIGH,
        createdAt: '2026-03-30',
    },
    {
        id: '3',
        title: 'Plataforma de pago BD',
        description: 'Migrar a SQL la base de datos de la compañía Patitos S.A',
        status: PROJECT_STATUSES.TODO,
        priority: PROJECT_PRIORITIES.HIGH,
        createdAt: '2026-03-30',
    }
];