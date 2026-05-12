import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrops, createCrop } from '../../store/slices/cropSlice';
import toast from 'react-hot-toast';

const CropsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.crops);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fieldName: '', cropType: '', variety: '', season: 'spring',
    year: new Date().getFullYear(), area: '', plantingDate: '',
    expectedHarvestDate: '', expectedYield: '', notes: '',
  });

  useEffect(() => { dispatch(fetchCrops({ limit: 50 })); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createCrop(form)).unwrap();
      toast.success('Crop record added');
      setShowForm(false);
      setForm({ fieldName: '', cropType: '', variety: '', season: 'spring', year: new Date().getFullYear(), area: '', plantingDate: '', expectedHarvestDate: '', expectedYield: '', notes: '' });
    } catch (err) { toast.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Crops</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Crop'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Field Name</label>
            <input className="input-field" required value={form.fieldName} onChange={(e) => setForm({ ...form, fieldName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Crop Type</label>
            <input className="input-field" required value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Variety</label>
            <input className="input-field" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Season</label>
            <select className="input-field" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
              <option value="spring">Spring</option><option value="summer">Summer</option>
              <option value="fall">Fall</option><option value="winter">Winter</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area (acres)</label>
            <input type="number" className="input-field" required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Planting Date</label>
            <input type="date" className="input-field" required value={form.plantingDate} onChange={(e) => setForm({ ...form, plantingDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Harvest</label>
            <input type="date" className="input-field" value={form.expectedHarvestDate} onChange={(e) => setForm({ ...form, expectedHarvestDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Yield (kg)</label>
            <input type="number" className="input-field" value={form.expectedYield} onChange={(e) => setForm({ ...form, expectedYield: e.target.value })} />
          </div>
          <div>
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
                <th className="pb-3 font-medium">Field</th>
                <th className="pb-3 font-medium">Crop</th>
                <th className="pb-3 font-medium">Season</th>
                <th className="pb-3 font-medium">Area</th>
                <th className="pb-3 font-medium">Planted</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Yield</th>
              </tr>
            </thead>
            <tbody>
              {items.map((crop) => (
                <tr key={crop._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{crop.fieldName}</td>
                  <td className="py-3">{crop.cropType}</td>
                  <td className="py-3 capitalize">{crop.season} {crop.year}</td>
                  <td className="py-3">{crop.area} {crop.areaUnit}</td>
                  <td className="py-3">{new Date(crop.plantingDate).toLocaleDateString()}</td>
                  <td className="py-3"><span className={`badge ${crop.status === 'harvested' ? 'badge-success' : crop.status === 'failed' ? 'badge-danger' : 'badge-info'}`}>{crop.status}</span></td>
                  <td className="py-3">{crop.actualYield || crop.expectedYield || '-'}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">No crop records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CropsPage;
