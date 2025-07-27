import React from 'react';
import { useApp } from '../hooks/useApp';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { state, dispatch } = useApp();

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', toastId: id });
  };

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      {state.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer; 