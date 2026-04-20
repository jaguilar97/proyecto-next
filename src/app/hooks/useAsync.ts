import { useEffect, useState, useRef, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFn: (signal: AbortSignal) => Promise<T>,
  immediate: boolean = true,
): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
  });

  const controllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const execute = useCallback(
    async (showLoading: boolean = true) => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      if (showLoading) {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));
      }

      try {
        const result = await asyncFn(controller.signal);

        if (isMountedRef.current && !controller.signal.aborted) {
          setState({
            data: result,
            isLoading: false,
            error: null,
          });
        }
      } catch (error: unknown) {
        const isAbortError =
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === 'AbortError') ||
          (error instanceof Error && error.name === 'AbortError');

        if (isAbortError) {
          return;
        }

        if (isMountedRef.current) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Error desconocido'),
          });
        }
      }
    },
    [asyncFn],
  );

  useEffect(() => {
    isMountedRef.current = true;

    if (immediate) {
      execute(false).catch(() => {
        // Los errores ya se manejan dentro de execute
      });
    }

    return () => {
      isMountedRef.current = false;

      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [execute, immediate]);

  return {
    ...state,
    refetch: () => {
      execute(true).catch(() => {
        // Los errores ya se manejan dentro de execute
      });
    },
  };
}