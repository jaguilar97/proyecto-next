import { TaskContextProvider } from '@/app/tasks/context/taskContext';
import { ProjectContextProvider } from '@/app/projects/context/projectContext';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectContextProvider>
      <TaskContextProvider>
        {children}
      </TaskContextProvider>
    </ProjectContextProvider>);
}