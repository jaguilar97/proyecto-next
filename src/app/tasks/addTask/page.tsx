import { AddTaskForm } from './components/AddTaskForm';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default async function AddTaskPage() {
  await delay(1500);
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Agregar tarea
      </h2>
      <AddTaskForm />
    </div>
  );
}