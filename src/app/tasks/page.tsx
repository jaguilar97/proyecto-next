//✅ Server Component — solo renderiza HTML
import { TaskListContainer } from '@/app/tasks/components/TaskListContainer';

export default async function TasksPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Tareas</h2>
      <TaskListContainer />
    </div>
  );
}