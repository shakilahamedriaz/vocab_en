import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useAppStore } from '../stores';
import {
  BookOpen, Brain, LayoutDashboard, Library, LogOut,
  Moon, Sun, RotateCcw, Sparkles, Gamepad2
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vocabulary', label: 'Library', icon: Library },
  { path: '/flashcards', label: 'Flashcards', icon: BookOpen },
  { path: '/quiz', label: 'Quiz', icon: Brain },
  { path: '/review', label: 'Practice', icon: RotateCcw },
  { path: '/arena', label: 'Arena', icon: Gamepad2 },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme, srsStats } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 flex flex-col z-40">

        {/* Logo */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-surface-900 dark:text-white text-base tracking-tight">VocabAI</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 flex-1 space-y-0.5">
          <p className="section-label px-3 mt-1 mb-2">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={isActive ? 'nav-item-active' : 'nav-item-default'}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
                {item.path === '/review' && (srsStats?.due_today ?? 0) > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                    {srsStats!.due_today}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-surface-100 dark:border-surface-800 pt-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="nav-item-default w-full"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4 flex-shrink-0" />
              : <Moon className="w-4 h-4 flex-shrink-0" />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
            <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-surface-400 dark:text-surface-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-surface-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
