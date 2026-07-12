'use client';

import { useState, useEffect } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

type ToastListener = (toast: Toast) => void;
const listeners = new Set<ToastListener>();

export function toast(props: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = { ...props, id };
  listeners.forEach((listener) => listener(newToast));
  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const addToast: ToastListener = (t) => {
      setToasts((current) => [...current, t]);
      
      // Auto-dismiss toast after 3 seconds
      setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== t.id));
      }, 3000);
    };

    listeners.add(addToast);
    return () => {
      listeners.delete(addToast);
    };
  }, []);

  const dismiss = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  return {
    toasts,
    toast,
    dismiss,
  };
}
