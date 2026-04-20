//✅ Server Component — solo renderiza HTML
import { EditProjectForm } from '@/app/projects/updateProject/components/updateProjectForm';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar proyecto</h2>
      <EditProjectForm projectId={id} />
    </div>
  );
}