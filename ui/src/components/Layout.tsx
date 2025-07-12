import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Plus, Users, History } from 'lucide-react';
import { ROUTES } from '../constants/appConstants';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case ROUTES.HOME:
        return 'ScoreMate';
      case ROUTES.TEAMS:
        return 'Teams';
      case ROUTES.ADVANCED_SETTINGS:
        return 'Match Settings';
      case ROUTES.SELECT_PLAYERS:
        return 'Select Opening Players';
      case ROUTES.SCORING:
        return 'Live Scoring';
      case ROUTES.SCOREBOARD:
        return 'Scoreboard';
      case ROUTES.HISTORY:
        return 'Match History';
      default:
        return 'ScoreMate';
    }
  };

  const showBackButton = ![ROUTES.HOME, ROUTES.TEAMS, ROUTES.HISTORY].includes(location.pathname as any);
  const showBottomNav = [ROUTES.HOME, ROUTES.TEAMS, ROUTES.HISTORY].includes(location.pathname as any);

  return (
    <div className="min-h-screen bg-cricket-gray">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {location.pathname === ROUTES.HOME && (
              <button
                onClick={() => navigate(ROUTES.HISTORY)}
                className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
                aria-label="Match history"
              >
                <Home size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 ${showBottomNav ? 'pb-16' : ''}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
          <div className="flex justify-around max-w-md mx-auto">
            <button
              onClick={() => navigate(ROUTES.TEAMS)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                location.pathname === ROUTES.TEAMS 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <Plus size={20} />
              <span className="text-xs mt-1">New Match</span>
            </button>
            
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                location.pathname === ROUTES.HOME 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <Users size={20} />
              <span className="text-xs mt-1">Teams</span>
            </button>
            
            <button
              onClick={() => navigate(ROUTES.HISTORY)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                location.pathname === ROUTES.HISTORY 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <History size={20} />
              <span className="text-xs mt-1">History</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;