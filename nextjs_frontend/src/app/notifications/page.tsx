import NotificationList from '@/components/NotificationsList';
import apiService from '@/libs/apiService';


export default async function NotificationsPage() {
  const notifications = await apiService.get(`/api/notifications/`);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      <div className="main-center col-span-3 space-y-4">
        <h1 className="text-2xl font-bold">Notifications</h1>

        {notifications && notifications.length > 0 ? (
          <NotificationList initialNotifications={notifications} />
        ) : (
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            You don't have any unread notifications
          </div>
        )}
      </div>
    </div>
  );
}
