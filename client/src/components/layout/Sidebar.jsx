import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineHome, HiOutlineUserGroup, HiOutlineHomeModern, HiOutlineCurrencyDollar,
  HiOutlineHeart, HiOutlineChatBubbleLeftRight, HiOutlineBell, HiOutlineUsers,
} from 'react-icons/hi2';

const farmerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/livestock', label: 'Livestock', icon: HiOutlineUserGroup },
  { to: '/crops', label: 'Crops', icon: HiOutlineHomeModern },
  { to: '/finance', label: 'Finance', icon: HiOutlineCurrencyDollar },
  { to: '/vet', label: 'Vet Services', icon: HiOutlineHeart },
  { to: '/messaging', label: 'Messages', icon: HiOutlineChatBubbleLeftRight },
  { to: '/alerts', label: 'Alerts', icon: HiOutlineBell },
];

const vetLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/vet', label: 'Health Records', icon: HiOutlineHeart },
  { to: '/messaging', label: 'Messages', icon: HiOutlineChatBubbleLeftRight },
  { to: '/alerts', label: 'Alerts', icon: HiOutlineBell },
];

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/livestock', label: 'Livestock', icon: HiOutlineUserGroup },
  { to: '/crops', label: 'Crops', icon: HiOutlineHomeModern },
  { to: '/finance', label: 'Finance', icon: HiOutlineCurrencyDollar },
  { to: '/vet', label: 'Vet Services', icon: HiOutlineHeart },
  { to: '/messaging', label: 'Messages', icon: HiOutlineChatBubbleLeftRight },
  { to: '/alerts', label: 'Alerts', icon: HiOutlineBell },
  { to: '/admin', label: 'Admin', icon: HiOutlineUsers },
];

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const links = user?.role === 'admin' ? adminLinks : user?.role === 'vet' ? vetLinks : farmerLinks;

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <span className="text-xl font-bold text-primary-700 whitespace-nowrap">
          {sidebarOpen ? 'SmartFarm' : 'SF'}
        </span>
      </div>
      <nav className="p-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <link.icon className="text-xl flex-shrink-0" />
            {sidebarOpen && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
