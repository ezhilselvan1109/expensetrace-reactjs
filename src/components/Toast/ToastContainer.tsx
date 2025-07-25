import { useToast } from '../../contexts/ToastContext';
import ToastItem from './ToastItem';

export default function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="
        fixed top-4 right-4
        sm:top-6 sm:right-6
        md:top-8 md:right-8
        lg:top-10 lg:right-10
        z-50 space-y-2
        w-full max-w-sm sm:max-w-md md:max-w-lg
      "
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}