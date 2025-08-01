import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useCreateDebtRecord, useUpdateDebtRecord, useDebtRecord } from '../hooks/useDebts';
import { useAccounts, useDefaultPaymentMode } from '../hooks/useAccounts';
import { CreateDebtRecordData } from '../types/debt';
import AccountSelectModal from '../components/AccountSelectModal';

interface FormData {
  date: string;
  amount: number;
  description: string;
  accountId: string;
  type: '1' | '2';
}

function DebtRecordForm() {
  const { debtId, recordId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(recordId);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const recordType = location.state?.recordType as '1' | '2' | undefined;

  const { data: record, isLoading: recordLoading } = useDebtRecord(recordId || '');
  const { data: accounts = [] } = useAccounts();
  const createRecord = useCreateDebtRecord();
  const updateRecord = useUpdateDebtRecord();
  const { data: defaultPaymentMode } = useDefaultPaymentMode();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      description: '',
      accountId: defaultPaymentMode?.id,
      type: recordType || '1'
    }
  });

  const watchedValues = watch();
  const selectedAccount = accounts.find(acc => acc.id === watchedValues.accountId);
  // accounts.find(acc => acc.id === watch('accountId'));

  // Load existing record data for editing
  useEffect(() => {
    if (isEditing && record) {
      setValue('date', record.date);
      setValue('amount', record.amount);
      setValue('description', record.description);
      setValue('accountId', record.accountId);
      setValue('type', record.type);
    }
  }, [isEditing, record, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const recordData: CreateDebtRecordData = {
        date: data.date,
        amount: data.amount,
        description: data.description,
        accountId: data.accountId,
        type: data.type
      };

      if (isEditing && recordId) {
        await updateRecord.mutateAsync({ id: recordId, data: recordData });
      } else if (debtId) {
        await createRecord.mutateAsync({ debtId, data: recordData });
      }

      navigate(`/debts/${debtId}/records`);
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  };

  const isPending = createRecord.isPending || updateRecord.isPending;

  if (isEditing && recordLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate(`/debts/${debtId}/records`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Records
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Record' : 'Add Record'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update record details' : 'Add a new debt record'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Record Type */}
        {!isEditing && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Record Type
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setValue('type', '1')}
                className={`flex-1 text-sm font-medium rounded-lg py-2 transition-all duration-200 ${register('type').value === '1' || recordType === '1'
                    ? "bg-white shadow text-black"
                    : "text-gray-500 hover:text-black"
                  }`}
              >
                Money Paid
              </button>
              <button
                type="button"
                onClick={() => setValue('type', '2')}
                className={`flex-1 text-sm font-medium rounded-lg py-2 transition-all duration-200 ${register('type').value === '2' || recordType === '2'
                    ? "bg-white shadow text-black"
                    : "text-gray-500 hover:text-black"
                  }`}
              >
                Money Received
              </button>
            </div>
          </div>
        )}

        {/* Date and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              id="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
              type="number"
              step="0.01"
              id="amount"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            id="description"
            rows={3}
            placeholder="Enter record description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Account */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Account
            </label>
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Change
            </button>
          </div>

          {selectedAccount ? (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {selectedAccount.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedAccount.name}</p>
                <p className="text-sm text-gray-500 capitalize">{selectedAccount.type}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
              No account selected
            </div>
          )}

          {errors.accountId && (
            <p className="mt-1 text-sm text-red-600">{errors.accountId.message}</p>
          )}
        </div>

        {/* Error Messages */}
        {(createRecord.error || updateRecord.error) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">
              Failed to save record. Please try again.
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPending ? 'Saving...' : isEditing ? 'Update Record' : 'Create Record'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/debts/${debtId}/records`)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Account Selection Modal */}
      <AccountSelectModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => setValue('accountId', account.id)}
        selectedAccount={selectedAccount}
        title="Select Account"
      />
    </div>
  );
}

export default DebtRecordForm;