import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthRecords } from '../../store/slices/healthSlice';
import { livestockAPI, healthAPI } from '../../services/api';
import toast from 'react-hot-toast';

const VetPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.health);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [livestock, setLivestock] = useState([]);
  const [form, setForm] = useState({
    livestockId: '', checkType: 'routine', diagnosis: '',
    symptoms: '', temperature: '', weight: '', treatment: '', notes: '',
  });

  useEffect(() => {
    dispatch(fetchHealthRecords({ limit: 50 }));
    livestockAPI.list({ limit: 100 }).then((res) => setLivestock(res.data.items || [])).catch(() => {});
  }, [dispatch]);

  const isVet = user?.role === 'vet';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await healthAPI.create(form);
      toast.success('Health record created');
      setShowForm(false);
      dispatch(fetchHealthRecords({ limit: 50 }));
    } catch (err) { toast.error('Failed to create record'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Veterinary Services</h1>
        {isVet && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'New Checkup'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Animal</label>
            <select className="input-field" value={form.livestockId} onChange={(e) => setForm({ ...form, livestockId: e.target.value })} required>
              <option value="">Select animal...</option>
              {livestock.map((a) => <option key={a._id} value={a._id}>{a.tagId} - {a.species}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Check Type</label>
            <select className="input-field" value={form.checkType} onChange={(e) => setForm({ ...form, checkType: e.target.value })}>
              <option value="routine">Routine</option><option value="emergency">Emergency</option>
              <option value="follow_up">Follow Up</option><option value="vaccination">Vaccination</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temperature</label>
            <input type="number" step="0.1" className="input-field" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Diagnosis</label>
            <input className="input-field" required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1">Treatment</label>
            <input className="input-field" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea className="input-field" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full">Save Record</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Animal</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Diagnosis</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((record) => (
                <tr key={record._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3">{new Date(record.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 font-medium">{record.livestockId?.tagId || 'N/A'}</td>
                  <td className="py-3 capitalize">{record.checkType?.replace(/_/g, ' ')}</td>
                  <td className="py-3">{record.diagnosis}</td>
                  <td className="py-3"><span className={`badge ${record.status === 'open' ? 'badge-warning' : record.status === 'closed' ? 'badge-success' : 'badge-info'}`}>{record.status?.replace(/_/g, ' ')}</span></td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No health records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VetPage;
