import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../lib/axios';
import {  
  BudgetSummary,
  BudgetAnalysis,
  CreateMonthlyBudgetData,
  CreateYearlyBudgetData,
  UpdateMonthlyBudgetData,
  UpdateYearlyBudgetData
} from '../types/budget';

// Get budget summaries
export const useBudgetSummary = () => {
  return useQuery<BudgetSummary>({
    queryKey: ['budget-summary'],
    queryFn: async () => {
      const [monthlyResponse, yearlyResponse] = await Promise.all([
        apiClient.get('/budgets/monthly'),
        apiClient.get('/budgets/yearly')
      ]);
      return {
        monthly: monthlyResponse.data || { upcoming: [], past: [] },
        yearly: yearlyResponse.data || { upcoming: [], past: [] }
      };
    },
  });
};

// Get budget analysis
export const useBudgetAnalysis = (budgetId: string, type: 'monthly' | 'yearly') => {
  console.log('useBudgetAnalysis called with budgetId:', budgetId, 'and type:', type);
  return useQuery<BudgetAnalysis>({
    queryKey: ['budget-analysis', budgetId, type],
    queryFn: async () => {
      const endpoint = type === 'monthly' ? `/budgets/${budgetId}` : `/budgets/${budgetId}`;
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    enabled: !!budgetId,
  });
};

// Create budgets
export const useCreateMonthlyBudget = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateMonthlyBudgetData) => {
      const response = await apiClient.post('/budgets/monthly', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      addToast({
        type: 'success',
        title: 'Monthly budget created',
        message: 'Your monthly budget has been created successfully.',
      });
      navigate('/budgets');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to create budget',
        message: 'Please try again.',
      });
    },
  });
};

export const useCreateYearlyBudget = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateYearlyBudgetData) => {
      const response = await apiClient.post('/budgets/yearly', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      addToast({
        type: 'success',
        title: 'Yearly budget created',
        message: 'Your yearly budget has been created successfully.',
      });
      navigate('/budgets');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to create budget',
        message: 'Please try again.',
      });
    },
  });
};

// Update budgets
export const useUpdateMonthlyBudget = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMonthlyBudgetData }) => {
      const response = await apiClient.put(`/budgets/monthly/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      queryClient.invalidateQueries({ queryKey: ['budget-analysis'] });
      addToast({
        type: 'success',
        title: 'Budget updated',
        message: 'Your monthly budget has been updated successfully.',
      });
      navigate('/budgets');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update budget',
        message: 'Please try again.',
      });
    },
  });
};

export const useUpdateYearlyBudget = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateYearlyBudgetData }) => {
      const response = await apiClient.put(`/budgets/yearly/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      queryClient.invalidateQueries({ queryKey: ['budget-analysis'] });
      addToast({
        type: 'success',
        title: 'Budget updated',
        message: 'Your yearly budget has been updated successfully.',
      });
      navigate('/budgets');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update budget',
        message: 'Please try again.',
      });
    },
  });
};

// Delete budget
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      queryClient.invalidateQueries({ queryKey: ['budget-analysis'] });
      addToast({
        type: 'success',
        title: 'Budget deleted',
        message: 'The budget has been deleted successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to delete budget',
        message: 'Please try again.',
      });
    },
  });
};