import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlerts, setUnreadCount } from '../../store/slices/alertSlice';
import { alertAPI } from '../../services/api';
import { connectAlertSocket, getAlertSocket } from '../../socket';
import toast from 'react-hot-toast';

const AlertIcon = ({ type }) => {
  const colors = {
    health: 'bg-red-100 text-red-600',
    weather: 'bg-blue-100 text-blue-600',
    breeding: 'bg-purple-100 text-purple-600',
    vaccination: 'bg-green-100 text-green-600',
    financial: 'bg-yellow-100 text-yellow-600',
    system: 'bg-gray-100 text-gray-600',
    task: 'bg-orange-100 text-orange-600',
  };
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${colors[type] || colors.system}`}>
      {type[0].toUpperCase()}
    </div>
  );
};

const AlertsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, unreadCount } = useSelector((state) => state.alerts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAlerts({ limit: 50 }));
    dispatch(setUnreadCount(0));

    let token = '';
    try {
      const cookies = document.cookie.split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=');
        acc[k] = v;
        return acc;
      }, {});
      token = cookies.accessToken || '';
    } catch { /* ignore */ }

    const socket = connectAlertSocket(token);
    if (socket && user?.farmId) {
      socket.emit('subscribe-farm', user.farmId);
      socket.on('new-alert', (alert) => {
        toast(alert.title, { icon: '🔔' });
        dispatch(fetchAlerts({ limit: 50 }));
      });
    }

    return () => { socket?.off('new-alert'); };
  }, [dispatch, user]);

  const handleMarkRead = async (id) => {
    try {
      await alertAPI.markRead(id);
      dispatch(fetchAlerts({ limit: 50 }));
    } catch { toast.error('Failed to mark as read'); }
  };

  const handleMarkAllRead = async () => {
    try {
      await alertAPI.markAllRead();
      dispatch(fetchAlerts({ limit: 50 }));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const handleResolve = async (id) => {
    try {
      await alertAPI.resolve(id);
      dispatch(fetchAlerts({ limit: 50 }));
      toast.success('Alert resolved');
    } catch { toast.error('Failed to resolve'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-sm text-gray-500">{unreadCount} unread</p>
        </div>
        <button onClick={handleMarkAllRead} className="btn-secondary text-sm">Mark All Read</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((alert) => (
            <div key={alert._id} className={`card flex gap-4 items-start ${!alert.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}>
              <AlertIcon type={alert.type} />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{alert.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                  </div>
                  <span className={`badge ${alert.severity === 'critical' ? 'badge-danger' : alert.severity === 'warning' ? 'badge-warning' : 'badge-info'}`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {!alert.isRead && (
                    <button onClick={() => handleMarkRead(alert._id)} className="btn-ghost text-xs">Mark Read</button>
                  )}
                  {!alert.isResolved && (
                    <button onClick={() => handleResolve(alert._id)} className="btn-ghost text-xs text-green-600">Resolve</button>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{new Date(alert.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="card text-center py-12 text-gray-400">
              <p className="text-lg mb-1">All clear!</p>
              <p className="text-sm">No alerts to show</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
