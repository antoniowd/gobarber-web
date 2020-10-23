import React, { createContext, useContext, useCallback, useState } from 'react';
import ToastContainer from '../components/ToastContainer';
import { v4 } from 'uuid';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info',
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(messages: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
    const toast = {
      id: v4(),
      type,
      title,
      description
    };

    setMessages((state) => [...state, toast])

  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be within a ToastProvider');
  }

  return context;
}
