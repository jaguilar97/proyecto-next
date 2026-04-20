//✅ Server Component — solo renderiza HTML
import { AddProjectForm } from './components/AddProjectForm';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default async function AddProjectPage() {
  await delay(1500);
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Agregar proyecto
      </h2>
      <AddProjectForm />
    </div>
  );
}