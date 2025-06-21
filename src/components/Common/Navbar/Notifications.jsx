import React from 'react'
import  useUserData from '../../Context/UserContext';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';

const Notifications = () => {
  const { userData } = useUserData();

  const formatISTDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors" />
          {userData?.notifications?.some(n => !n.read) && (
            <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end"
        className="w-96 p-0 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
      >
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Notifications
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {userData?.notifications?.length ? (
            userData.notifications.map((notification) => (
              <div
                key={notification._id}
                className={cn(
                  "flex items-start gap-4 p-4 border-b dark:border-gray-700",
                  "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                  !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                )}
              >
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {notification.message}
                  </p>
                  <time className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    {formatISTDate(notification.createdAt)}
                  </time>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Notifications;