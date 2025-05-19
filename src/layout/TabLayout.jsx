// TabLayout.js
import { useLocation, useNavigate } from 'react-router-dom';

const TabLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Agent Commissions', path: '/commission' },
    { label: 'Payments Requests', path: '/payment-requests' },
    { label: 'Payment History', path: '/payment-history' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.path}
              className={`py-3 px-1 ${
                location.pathname === tab.path
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
};

export default TabLayout;
