import { useCallback } from 'react';
import { useDataContext } from '@/contexts/DataContext';

export const useOptimisticUpdates = () => {
  const { triggerRefresh } = useDataContext();

  const withOptimisticUpdate = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      options: {
        entity: string;
        onSuccess?: (result: T) => void;
        onError?: (error: any) => void;
      }
    ): Promise<T> => {
      try {
        const result = await operation();
        
        // Trigger refresh for related entities
        triggerRefresh(options.entity);
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (error) {
        if (options.onError) {
          options.onError(error);
        }
        throw error;
      }
    },
    [triggerRefresh]
  );

  return { withOptimisticUpdate };
};