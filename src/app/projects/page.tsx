//✅ Server Component — solo renderiza HTML
import { ProjectListContainer } from '@/app/projects/components/ProjectListContainer';

export default async function ProjectsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Proyectos</h2>
      <ProjectListContainer />
    </div>
  );
}