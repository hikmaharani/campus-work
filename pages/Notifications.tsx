import React, { useState } from 'react';
import { useApp } from '../App';
import { Bell, Check, Trash2, Calendar } from 'lucide-react';
import { Button, Modal } from '../components/UI';
import { Notification } from '../types';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useApp();
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  const handleNotificationClick = (n: Notification) => {
      markAsRead(n.id);
      setSelectedNotif(n);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
            {notifications.length > 0 && (
                <Button variant="ghost" onClick={markAllAsRead} size="sm">
                    <Check className="w-4 h-4 mr-2" /> Tandai semua dibaca
                </Button>
            )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
            {notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                    {notifications.map((n) => (
                        <div 
                            key={n.id} 
                            onClick={() => handleNotificationClick(n)}
                            className={`p-5 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/40' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                <Bell className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h4>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{n.date}</span>
                                </div>
                                <p className={`text-sm line-clamp-2 ${!n.isRead ? 'text-gray-800' : 'text-gray-500'}`}>{n.message}</p>
                            </div>
                            {!n.isRead && (
                                <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-gray-300" />
                    </div>
                    <p>Belum ada notifikasi terbaru.</p>
                </div>
            )}
        </div>

        {/* Detail Modal */}
        <Modal 
            isOpen={!!selectedNotif}
            onClose={() => setSelectedNotif(null)}
            title="Detail Notifikasi"
            footer={<Button onClick={() => setSelectedNotif(null)}>Tutup</Button>}
        >
            {selectedNotif && (
                <div className="space-y-4">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        {selectedNotif.date}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedNotif.title}</h3>
                    <div className="p-4 bg-gray-50 rounded-xl text-gray-700 leading-relaxed">
                        {selectedNotif.message}
                    </div>
                </div>
            )}
        </Modal>
    </div>
  );
};

export default Notifications;