// src/hooks/useFiles.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useFiles = () => {
  return useQuery({
    queryKey: ['files'], // This helps React Query cache your data
    queryFn: async () => {
      const { data } = await api.get('/my-files');
      return data.files; // Backend returns { "files": [...] }
    },
  });
};
