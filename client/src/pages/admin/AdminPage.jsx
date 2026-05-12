import { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userAPI.list({ limit: 100 });
        setUsers(res.data.users || []);
      } catch { toast.error('Failed to load users'); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const action = currentStatus ? 'deactivate' : 'activate';
      await userAPI.toggleStatus(userId, action);
      toast.success(`User ${action}d`);
      const res = await userAPI.list({ limit: 100 });
      setUsers(res.data.users || []);
    } catch { toast.error('Failed to update user'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-500">Manage users and system settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{users.filter((u) => u.role === 'farmer').length}</p>
          <p className="text-sm text-gray-500">Farmers</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">{users.filter((u) => u.role === 'vet').length}</p>
          <p className="text-sm text-gray-500">Veterinarians</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-gray-600">{users.filter((u) => !u.isActive).length}</p>
          <p className="text-sm text-gray-500">Inactive</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">All Users</h3>
        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium">{u.firstName} {u.lastName}</td>
                    <td className="py-3 text-gray-500">{u.email}</td>
                    <td className="py-3"><span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'vet' ? 'badge-info' : 'badge-success'}`}>{u.role}</span></td>
                    <td className="py-3"><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleStatus(u._id, u.isActive)}
                        className={`btn-ghost text-xs ${u.isActive ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
