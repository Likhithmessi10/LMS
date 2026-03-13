import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Bell,
  User,
  Search,
  Sun,
  Moon,
  Languages } from
'lucide-react';
import { authService } from '@/services/authService';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'te' : 'en');
  };

  const navItems = [
  { title: 'Dashboard',        icon: LayoutDashboard, path: '/dashboard' },
  { title: 'My Courses',       icon: BookOpen,        path: '/catalog' },
  { title: 'Progress',         icon: Award,           path: '/progress' },
  { title: 'History',          icon: Award,           path: '/history' },
  { title: 'Certificates',     icon: Award,           path: '/certificates' },
  ];


  return (
    <nav className="h-20 border-b glass fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white uppercase">APTRANSCO</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">LMS Portal</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) =>
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200",
              pathname === item.path ?
              "text-primary bg-primary/5" :
              "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-slate-100 dark:hover:bg-slate-800"
            )}>
            
              <item.icon size={18} />
              {t(item.title === 'Home' ? 'Dashboard' : item.title === 'All Courses' ? 'Catalog' : item.title)}
              {pathname === item.path &&
            <motion.div
              layoutId="activeNav"
              className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }} />

            }
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center relative group">
          <Search size={16} className="absolute left-3 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all" />
          
        </div>

        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
        </button>

        {/* Language Toggle */}
        <button onClick={toggleLanguage} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 font-bold">
          <Languages size={20} />
          <span className="text-xs uppercase">{i18n.language.substring(0,2)}</span>
        </button>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

        <button
          onClick={() => authService.login()}
          className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-primary text-white hover:opacity-90 transition-colors shadow-lg shadow-primary/10">
          
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs border border-white/20">
            <User size={16} />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-black uppercase tracking-widest leading-none">Login with edX</p>
          </div>
        </button>
      </div>
    </nav>);

};

export default Navbar;