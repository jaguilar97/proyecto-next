'use client';

import { TaskContextProvider } from '@/app/tasks/context/taskContext';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TaskContextProvider>{children}</TaskContextProvider>;
}