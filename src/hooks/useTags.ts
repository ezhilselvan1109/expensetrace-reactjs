import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../lib/axios';
import { UpdateTagData, MergeTagData, PaginatedTags } from '../types/tag';

/**
 * 🔍 Search Tags
 * Calls: GET /api/v1/tags/search?key={key}&page={page}&size={size}
 */
export const useTags = (key = '', page = 0, size = 10) => {
  return useQuery<PaginatedTags>({
    queryKey: ['tags', key, page, size],
    queryFn: async () => {
      const response = await apiClient.get(
        `/tags/search?key=${encodeURIComponent(key)}&page=${page}&size=${size}`
      );

      // Handle empty / unexpected API data safely
      return (
        response.data.data || {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size,
          number: page,
          first: true,
          last: true,
        }
      );
    },
    keepPreviousData: true, // smooth UI updates while searching
  });
};

/**
 * ✏️ Update Tag
 * Calls: PUT /api/v1/tags/{id}
 */
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTagData }) => {
      const response = await apiClient.put(`/tags/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      addToast({ type: 'success', message: 'Tag updated successfully' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update tag' });
    },
  });
};

/**
 * 🔗 Merge Tags
 * Calls: POST /api/v1/tags/merge?sourceTagId={id}&targetTagId={data.tagId}
 */
export const useMergeTag = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MergeTagData }) => {
      const response = await apiClient.post(
        `/tags/merge?sourceTagId=${id}&targetTagId=${data.tagId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      addToast({ type: 'success', message: 'Tags merged successfully' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to merge tags' });
    },
  });
};

/**
 * 🗑️ Delete Tag
 * Calls: DELETE /api/v1/tags/{id}
 */
export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      addToast({ type: 'success', message: 'Tag deleted successfully' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to delete tag' });
    },
  });
};