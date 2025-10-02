import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, Send, RefreshCw } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'promo' | 'alert';
  created_at: string;
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'info' as Notification['type'] });
  const [isSending, setIsSending] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(10);
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setNotifications(data as Notification[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    const { error: insertError } = await supabase.from('notifications').insert(newNotif);
    if (insertError) {
      setError(insertError.message);
    } else {
      setNewNotif({ title: '', message: '', type: 'info' });
      fetchNotifications();
    }
    setIsSending(false);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-medium text-gray-800 mb-6">Send Notification</h2>
        <form onSubmit={handleSend} className="space-y-4 p-6 bg-white rounded-lg shadow">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={newNotif.title}
              onChange={e => setNewNotif(p => ({ ...p, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              value={newNotif.message}
              onChange={e => setNewNotif(p => ({ ...p, message: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              value={newNotif.type}
              onChange={e => setNewNotif(p => ({ ...p, type: e.target.value as Notification['type'] }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="info">Info</option>
              <option value="promo">Promo</option>
              <option value="alert">Alert</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={isSending} className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50">
            <Send className="w-5 h-5" />
            <span>{isSending ? 'Sending...' : 'Send Notification'}</span>
          </button>
        </form>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800">Recent Notifications</h2>
          <button onClick={fetchNotifications} disabled={loading} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
        <div className="space-y-3">
          {loading ? <p>Loading...</p> : notifications.map(notif => (
            <div key={notif.id} className="bg-white p-4 rounded-lg shadow flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center"><Bell className="w-5 h-5 text-gray-600" /></div>
              <div>
                <p className="font-medium text-gray-800">{notif.title}</p>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;
