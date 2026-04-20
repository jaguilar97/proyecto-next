import { EditTaskForm } from '@/app/tasks/updateTask/components/updateTaskForm';

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar tarea</h2>
      <EditTaskForm taskId={id} />
    </div>
  );
}