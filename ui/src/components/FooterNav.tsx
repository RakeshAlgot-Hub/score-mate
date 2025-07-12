import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Users, Clock } from 'lucide-react';

const FooterNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'new-match',
      label: 'New Match',
      icon: Plus,
      path: '/new-match',
      color: 'text-blue-600'
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: Users,
      path: '/teams',
      color: 'text-gray-400'
    },
    {
      id: 'history',
      label: 'History',
      icon: Clock,
      path: '/history',
      color: 'text-blue-600'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex-1 py-4 px-4 text-center hover:bg-blue-50 transition-colors ${
                active ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <Icon 
                  className={`w-6 h-6 mb-1 ${
                    active ? 'text-blue-600' : 'text-gray-400'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium ${
                    active ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FooterNav;