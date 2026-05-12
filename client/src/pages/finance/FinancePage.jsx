import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, createTransaction } from '../../store/slices/financeSlice';
import toast from 'react-hot-toast';
import { formatKES } from '../../utils/format';

const FinancePage = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.finance);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('transactions');
  const [form, setForm] = useState({
    type: 'expense', category: 'feed', amount: '', description: '', date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => { dispatch(fetchTransactions({ limit: 50 })); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTransaction(form)).unwrap();
      toast.success('Transaction added');
      setShowForm(false);
      setForm({ type: 'expense', category: 'feed', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    } catch (err) { toast.error(err); }
  };

  const incomeCategories = ['livestock_sale', 'crop_sale', 'milk_sale', 'egg_sale', 'other_income'];
  const expenseCategories = ['feed', 'vet_care', 'supplies', 'equipment', 'labor', 'utilities', 'transport', 'insurance', 'tax', 'loan_payment', 'maintenance', 'other_expense'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Finance</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      <div className="flex gap-2 border-b">
        <button onClick={() => setTab('transactions')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'transactions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Transactions</button>
        <button onClick={() => setTab('budgets')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'budgets' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Budgets</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: '' })}>
              <option value="income">Income</option><option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              {(form.type === 'income' ? incomeCategories : expenseCategories).map((c) => (
                <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount (KSh)</label>
            <input type="number" step="0.01" className="input-field" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" className="input-field" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full">Save</button>
          </div>
        </form>
      )}

      {tab === 'transactions' && (
        <>
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="py-3"><span className={`badge ${tx.type === 'income' ? 'badge-success' : 'badge-danger'}`}>{tx.type}</span></td>
                      <td className="py-3 capitalize">{tx.category.replace(/_/g, ' ')}</td>
                      <td className="py-3 text-gray-500">{tx.description || '-'}</td>
                      <td className={`py-3 text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatKES(tx.amount)}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">No transactions yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'budgets' && (
        <div className="card">
          <p className="text-gray-500 text-center py-8">Budget management coming soon</p>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
