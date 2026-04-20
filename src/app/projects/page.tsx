//✅ Server Component — solo renderiza HTML
import { ProjectListContainer } from '@/app/projects/components/ProjectListContainer';
import { mockProjects } from '@/app/utils/mockDataProjects';

function retrasoManual(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function TasksPage() {
   await retrasoManual(300);
   return (
   <div>
      <h2 className="text-2xl font-bold text-gray-900 mb6">Mis Proyectos</h2>
      <ProjectListContainer projects={mockProjects} />
   </div>
   );
}
