import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { 
  useCreateBankAccount, 
  useCreateWallet, 
  useCreateCreditCard,
  useUpdateBankAccount,
  useUpdateWallet,
  useUpdateCreditCard,
  useAccount 
} from '../hooks/useAccounts';
import { 
  CreateBankAccountData, 
  CreateWalletData, 
  CreateCreditCardData,
  CreatePaymentModeData,
  PAYMENT_MODE_TYPES
} from '../types/account';
import PaymentModeModal from '../components/PaymentModeModal';

const tabs = ['Bank Account', 'Wallet', 'Credit Card'];

interface FormData {
  name: string;
  currentBalance?: number;
  currentAvailableLimit?: number;
  totalCreditLimit?: number;
  billingCycleStartDate?: string;
  paymentDueDate?: string;
}

function AccountForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [activeTab, setActiveTab] = useState(0);
  const [paymentModes, setPaymentModes] = useState<CreatePaymentModeData[]>([]);
  const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = useState(false);
  
  const { data: account, isLoading: accountLoading } = useAccount(id || '');
  const createBankAccount = useCreateBankAccount();
  const createWallet = useCreateWallet();
  const createCreditCard = useCreateCreditCard();
  const updateBankAccount = useUpdateBankAccount();
  const updateWallet = useUpdateWallet();
  const updateCreditCard = useUpdateCreditCard();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      currentBalance: 0,
      currentAvailableLimit: 0,
      totalCreditLimit: 0,
      billingCycleStartDate: '',
      paymentDueDate: ''
    }
  });

  // Load existing account data for editing
  useEffect(() => {
    if (isEditing && account) {
      setValue('name', account.name);
      
      if (account.type === 1) {
        setActiveTab(0);
        setValue('currentBalance', account.currentBalance || 0);
        if (account.linkedPaymentModes) {
          setPaymentModes(account.linkedPaymentModes.map(pm => ({
            name: pm.name,
            type: pm.type
          })));
        }
      } else if (account.type === 2) {
        setActiveTab(1);
        setValue('currentBalance', account.currentBalance || 0);
      } else if (account.type === 3) {
        setActiveTab(2);
        setValue('currentAvailableLimit', account.currentAvailableLimit || 0);
        setValue('totalCreditLimit', account.totalCreditLimit || 0);
        setValue('billingCycleStartDate', account.billingCycleStartDate || '');
        setValue('paymentDueDate', account.paymentDueDate || '');
      }
    }
  }, [isEditing, account, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && id) {
        // Update existing account
        if (activeTab === 0) {
          await updateBankAccount.mutateAsync({ 
            id, 
            data: { 
              name: data.name, 
              currentBalance: data.currentBalance,
              linkedPaymentModes: paymentModes 
            } 
          });
        } else if (activeTab === 1) {
          await updateWallet.mutateAsync({ 
            id, 
            data: { 
              name: data.name, 
              currentBalance: data.currentBalance 
            } 
          });
        } else if (activeTab === 2) {
          await updateCreditCard.mutateAsync({ 
            id, 
            data: { 
              name: data.name,
              currentAvailableLimit: data.currentAvailableLimit,
              totalCreditLimit: data.totalCreditLimit,
              billingCycleStartDate: data.billingCycleStartDate,
              paymentDueDate: data.paymentDueDate
            } 
          });
        }
      } else {
        // Create new account
        if (activeTab === 0) {
          const bankData: CreateBankAccountData = {
            name: data.name,
            currentBalance: data.currentBalance || 0,
            linkedPaymentModes: paymentModes
          };
          await createBankAccount.mutateAsync(bankData);
        } else if (activeTab === 1) {
          const walletData: CreateWalletData = {
            name: data.name,
            currentBalance: data.currentBalance || 0
          };
          await createWallet.mutateAsync(walletData);
        } else if (activeTab === 2) {
          const creditCardData: CreateCreditCardData = {
            name: data.name,
            currentAvailableLimit: data.currentAvailableLimit || 0,
            totalCreditLimit: data.totalCreditLimit || 0,
            billingCycleStartDate: data.billingCycleStartDate || '',
            paymentDueDate: data.paymentDueDate || ''
          };
          await createCreditCard.mutateAsync(creditCardData);
        }
      }
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  const handlePaymentModeAdded = (paymentMode: CreatePaymentModeData) => {
    setPaymentModes(prev => [...prev, paymentMode]);
  };

  const removePaymentMode = (index: number) => {
    setPaymentModes(prev => prev.filter((_, i) => i !== index));
  };

  const isPending = createBankAccount.isPending || createWallet.isPending || createCreditCard.isPending ||
                   updateBankAccount.isPending || updateWallet.isPending || updateCreditCard.isPending;

  if (isEditing && accountLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
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
          onClick={() => navigate('/accounts')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Accounts
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Account' : 'Add Account'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update account details' : 'Create a new account for tracking your finances'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Account Type Tabs */}
        {!isEditing && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Account Type
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {tabs.map((tab, index) => {
                const active = activeTab === index;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`flex-1 text-sm font-medium rounded-lg py-2 transition-all duration-200 ${
                      active
                        ? "bg-white shadow text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Account Name */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Account Name
          </label>
          <input
            {...register('name', { required: 'Account name is required' })}
            type="text"
            id="name"
            placeholder="Enter account name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Bank Account Fields */}
        {activeTab === 0 && (
          <>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <label htmlFor="currentBalance" className="block text-sm font-medium text-gray-700 mb-2">
                Current Balance
              </label>
              <input
                {...register('currentBalance', { 
                  required: 'Current balance is required',
                  min: { value: 0, message: 'Balance cannot be negative' }
                })}
                type="number"
                step="0.01"
                id="currentBalance"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.currentBalance && (
                <p className="mt-1 text-sm text-red-600">{errors.currentBalance.message}</p>
              )}
            </div>

            {/* Linked Payment Modes */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Linked Payment Modes (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setIsPaymentModeModalOpen(true)}
                  className="inline-flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              
              {paymentModes.length === 0 ? (
                <p className="text-gray-500 text-sm">No payment modes added yet</p>
              ) : (
                <div className="space-y-2">
                  {paymentModes.map((mode, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{mode.name}</p>
                        <p className="text-sm text-gray-500">{PAYMENT_MODE_TYPES[mode.type]}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePaymentMode(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Wallet Fields */}
        {activeTab === 1 && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <label htmlFor="currentBalance" className="block text-sm font-medium text-gray-700 mb-2">
              Current Balance
            </label>
            <input
              {...register('currentBalance', { 
                required: 'Current balance is required',
                min: { value: 0, message: 'Balance cannot be negative' }
              })}
              type="number"
              step="0.01"
              id="currentBalance"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.currentBalance && (
              <p className="mt-1 text-sm text-red-600">{errors.currentBalance.message}</p>
            )}
          </div>
        )}

        {/* Credit Card Fields */}
        {activeTab === 2 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <label htmlFor="currentAvailableLimit" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Available Limit
                </label>
                <input
                  {...register('currentAvailableLimit', { 
                    required: 'Available limit is required',
                    min: { value: 0, message: 'Limit cannot be negative' }
                  })}
                  type="number"
                  step="0.01"
                  id="currentAvailableLimit"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.currentAvailableLimit && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentAvailableLimit.message}</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <label htmlFor="totalCreditLimit" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Credit Limit
                </label>
                <input
                  {...register('totalCreditLimit', { 
                    required: 'Total credit limit is required',
                    min: { value: 0, message: 'Limit cannot be negative' }
                  })}
                  type="number"
                  step="0.01"
                  id="totalCreditLimit"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.totalCreditLimit && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalCreditLimit.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <label htmlFor="billingCycleStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Cycle Start Date
                </label>
                <input
                  {...register('billingCycleStartDate', { required: 'Billing cycle start date is required' })}
                  type="date"
                  id="billingCycleStartDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.billingCycleStartDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingCycleStartDate.message}</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <label htmlFor="paymentDueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Due Date
                </label>
                <input
                  {...register('paymentDueDate', { required: 'Payment due date is required' })}
                  type="date"
                  id="paymentDueDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.paymentDueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentDueDate.message}</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Error Messages */}
        {(createBankAccount.error || createWallet.error || createCreditCard.error ||
          updateBankAccount.error || updateWallet.error || updateCreditCard.error) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">
              Failed to save account. Please try again.
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
            {isPending ? 'Saving...' : isEditing ? 'Update Account' : 'Create Account'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/accounts')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Payment Mode Modal */}
      <PaymentModeModal
        isOpen={isPaymentModeModalOpen}
        onClose={() => setIsPaymentModeModalOpen(false)}
        accountId={isEditing ? id ?? '' : ''} // Not needed for form creation
        onPaymentModeAdded={handlePaymentModeAdded}
      />
    </div>
  );
}

export default AccountForm;