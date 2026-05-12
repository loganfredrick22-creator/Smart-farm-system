import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineUserGroup, HiOutlineHomeModern, HiOutlineCurrencyDollar, HiOutlineHeart } from 'react-icons/hi2';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { livestockAPI, cropAPI, financeAPI, healthAPI, alertAPI } from '../../services/api';
import { formatKES } from '../../utils/format';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StatCard = ({ icon: Icon, label, value, color, link }) => (
  <Link to={link} className="card hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-2xl text-white" />
      </div>
    </div>
  </Link>
);

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ livestock: 0, crops: 0, income: 0, expenses: 0, openCases: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lRes, cRes, fRes, hRes, aRes] = await Promise.allSettled([
          livestockAPI.getStats(user?.farmId), cropAPI.getStats(user?.farmId),
          financeAPI.getSummary(user?.farmId), healthAPI.getOpenCases(user?.farmId),
          alertAPI.getActionRequired(user?.farmId),
        ]);
        setStats({
          livestock: lRes.value?.data?.data?.total || 0,
          crops: cRes.value?.data?.data?.total || 0,
          income: fRes.value?.data?.data?.income || 0,
          expenses: fRes.value?.data?.data?.expense || 0,
          openCases: hRes.value?.data?.data?.length || 0,
          alerts: aRes.value?.data?.data?.length || 0,
        });
      } finally { setLoading(false); }
    };
    fetchStats();
  }, [user]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 1500, 2200, 2800, 2400],
        fill: true,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [800, 1100, 900, 1400, 1600, 1200],
        fill: true,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-500">Here's your farm overview</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={HiOutlineUserGroup} label="Total Livestock" value={stats.livestock} color="bg-primary-600" link="/livestock" />
        <StatCard icon={HiOutlineHomeModern} label="Active Crops" value={stats.crops} color="bg-green-600" link="/crops" />
        <StatCard icon={HiOutlineCurrencyDollar} label="Income (MTD)" value={formatKES(stats.income)} color="bg-blue-600" link="/finance" />
        <StatCard icon={HiOutlineCurrencyDollar} label="Expenses (MTD)" value={formatKES(stats.expenses)} color="bg-orange-600" link="/finance" />
        <StatCard icon={HiOutlineHeart} label="Open Health Cases" value={stats.openCases} color="bg-red-600" link="/vet" />
        <StatCard icon={HiOutlineHeart} label="Pending Alerts" value={stats.alerts} color="bg-yellow-600" link="/alerts" />
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
        <div className="h-64">
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
