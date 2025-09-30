'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/libs/apiService';
import { NotificationType } from '@/types';


export default function NotificationList({ initialNotifications }: { initialNotifications: NotificationType[] }) {
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);
  const router = useRouter();

  const readNotification = async (notification: NotificationType) => {
    try {
      await apiService.post(`/api/notifications/read/${notification.id}/`, {});

      if (notification.type_of_notification === 'post_like' || notification.type_of_notification === 'post_comment') {
        router.push(`/post/${notification.post_id}`);
      } else {
        router.push(`/profile/${notification.created_for_id}`);
      }

      setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== notification.id));

    } catch (error) {
      console.error('Error reading notification:', error);
    }
  };

  return (
    <>
      {notifications.map((notification) => (
        <div key={notification.id} className="p-4 bg-white border border-gray-200 rounded-lg">
          <p>{notification.body}</p>
          <button 
            onClick={() => readNotification(notification)} 
            className="underline text-blue-600 hover:text-blue-800"
          >
            See more
          </button>
        </div>
      ))}
    </>
  );
}

