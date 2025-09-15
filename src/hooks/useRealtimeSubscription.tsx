import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealtimeSubscription = (
  table: string,
  onInsert?: (payload: any) => void,
  onUpdate?: (payload: any) => void,
  onDelete?: (payload: any) => void
) => {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = () => {
      channel = supabase
        .channel(`realtime-${table}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: table
          },
          (payload) => {
            console.log(`${table} inserted:`, payload);
            onInsert?.(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: table
          },
          (payload) => {
            console.log(`${table} updated:`, payload);
            onUpdate?.(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: table
          },
          (payload) => {
            console.log(`${table} deleted:`, payload);
            onDelete?.(payload);
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, onInsert, onUpdate, onDelete]);
};