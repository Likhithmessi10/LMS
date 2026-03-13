import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Layers,
  Megaphone,
  Video,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  Tent,
  TrendingUp,
} from 'lucide-react';
import { authService } from '@/services/authService';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const navItems = [
  { name: 'Dashboard',          path: '/dashboard',         icon: LayoutDashboard },
  { name: 'Internship Mgmt',    path: '/internships',       icon: UserCheck },
  { name: 'Employee Mgmt',      path: '/employees',         icon: Users },
  { name: 'Course Mgmt',        path: '/courses',           icon: BookOpen },
  { name: 'Batch Mgmt',         path: '/batches',           icon: Layers },
  { name: 'Training Progress',  path: '/training-progress', icon: TrendingUp },
  { name: 'Training Camps',     path: '/training-camps',    icon: Tent },
  { name: 'Announcements',      path: '/announcements',     icon: Megaphone },
  { name: 'Live Sessions',      path: '/live-sessions',     icon: Video },
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { t } = useTranslation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      className={cn(
        'relative h-screen flex flex-col glass border-r z-50 transition-colors duration-300',
        'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 mb-2 mt-2 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground shrink-0 shadow-lg shadow-primary/20">
            <GraduationCap size={22} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <p className="font-black text-base whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  APTRANSCO
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">
                  LMS Admin
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm whitespace-nowrap"
              >
                {t(item.name)}
              </motion.span>
            )}
            {isCollapsed && (
              <div className="absolute left-16 hidden group-hover:flex px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs rounded-md whitespace-nowrap z-[60] shadow-lg">
                {t(item.name)}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Buttons */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1 shrink-0">
        <button
          onClick={() => authService.login()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
        >
          <LogOut size={18} className="rotate-180 shrink-0" />
          {!isCollapsed && <span className="text-sm">Connect Open edX</span>}
        </button>
        <button
          onClick={() => authService.logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>{t('Log out')}</span>}
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="mx-3 mb-4 p-2.5 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span className="ml-2 font-medium text-sm">Collapse</span></>}
      </button>
    </motion.aside>
  );
};

export default Sidebar;