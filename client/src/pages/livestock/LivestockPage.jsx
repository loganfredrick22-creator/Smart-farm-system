import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLivestock, createLivestock } from '../../store/slices/livestockSlice';
import toast from 'react-hot-toast';

const LivestockPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.livestock);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    tagId: '', species: 'cattle', breed: '', gender: 'male',
    dateOfBirth: '', weight: '', location: '', notes: '',
  });

  useEffect(() => { dispatch(fetchLivestock({ limit: 50 })); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createLivestock(form)).unwrap();
      toast.success('Livestock added');
      setShowForm(false);
      setForm({ tagId: '', species: 'cattle', breed: '', gender: 'male', dateOfBirth: '', weight: '', location: '', notes: '' });
    } catch (err) { toast.error(err); }
  };

  const getStatusBadge = (status) => {
    const map = { active: 'badge-success', sold: 'badge-info', dead: 'badge-danger', slaughtered: 'badge-warning' };
    return map[status] || 'badge-info';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Livestock</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Animal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tag ID</label>
            <input className="input-field" required value={form.tagId} onChange={(e) => setForm({ ...form, tagId: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Species</label>
            <select className="input-field" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })}>
              <option value="cattle">Cattle</option><option value="goat">Goat</option>
              <option value="sheep">Sheep</option><option value="pig">Pig</option>
              <option value="chicken">Chicken</option><option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Breed</label>
            <input className="input-field" required value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="male">Male</option><option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input type="date" className="input-field" required value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input type="number" className="input-field" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <input className="input-field" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full">Save</button>
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
                <th className="pb-3 font-medium">Tag ID</th>
                <th className="pb-3 font-medium">Species</th>
                <th className="pb-3 font-medium">Breed</th>
                <th className="pb-3 font-medium">Gender</th>
                <th className="pb-3 font-medium">Age</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Health</th>
              </tr>
            </thead>
            <tbody>
              {items.map((animal) => (
                <tr key={animal._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{animal.tagId}</td>
                  <td className="py-3 capitalize">{animal.species}</td>
                  <td className="py-3">{animal.breed}</td>
                  <td className="py-3 capitalize">{animal.gender}</td>
                  <td className="py-3">{Math.floor((new Date() - new Date(animal.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))}y</td>
                  <td className="py-3"><span className={getStatusBadge(animal.status)}>{animal.status}</span></td>
                  <td className="py-3"><span className={`badge ${animal.healthStatus === 'healthy' ? 'badge-success' : animal.healthStatus === 'sick' ? 'badge-danger' : 'badge-warning'}`}>{animal.healthStatus}</span></td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">No livestock records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LivestockPage;
