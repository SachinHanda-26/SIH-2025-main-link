import { useState } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...props };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (props.duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, props.duration || 5000);
    }
    
    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toast,
    dismiss,
    toasts
  };
}