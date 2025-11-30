
import React, { useEffect } from 'react';
import { Notification } from '../types';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationToastProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-24 right-4 z-[150] flex flex-col gap-2 pointer-events-none">
      {notifications.map(notification => (
        <ToastItem key={notification.id} notification={notification} removeNotification={removeNotification} />
      ))}
    </div>
  );
};

const ToastItem = ({ notification, removeNotification }: { notification: Notification, removeNotification: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(notification.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification.id, removeNotification]);

  const bgColors = {
    success: 'bg-teal-500/20 border-teal-500/30 text-teal-200',
    error: 'bg-red-500/20 border-red-500/30 text-red-200',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-200'
  };

  const Icon = notification.type === 'success' ? CheckCircle : notification.type === 'error' ? AlertCircle : Info;

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg animate-slide-in transition-all ${bgColors[notification.type]} min-w-[300px]`}>
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium flex-1">{notification.message}</p>
      <button 
        onClick={() => removeNotification(notification.id)}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
