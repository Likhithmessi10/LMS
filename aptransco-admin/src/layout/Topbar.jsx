import { Bell, Search, User, LogOut, Settings, Sun, Moon, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'@/components/ui/dropdown-menu';

import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';


const Topbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'te' : 'en');
  };

  const getPageTitle = (path) => {
    const p = path.split('/')[1];
    if (!p) return 'Dashboard';
    return p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-16 glass-dark bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border-b px-4 md:px-6 flex items-center justify-between z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 hidden md:block">
          {t(getPageTitle(location.pathname))}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 w-40 md:w-64 transition-all" />
          
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        {/* Language Toggle */}
        <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors flex items-center gap-1 font-bold">
          <Languages size={20} />
          <span className="text-xs uppercase">{i18n.language.substring(0,2)}</span>
        </button>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="hidden md:block text-right mr-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-none">Admin User</p>
                <p className="text-xs text-slate-500 leading-none mt-1">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white shadow-md">
                <User size={20} />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 glass border-slate-200 dark:border-slate-800">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>);

};

export default Topbar;