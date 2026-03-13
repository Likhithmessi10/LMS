import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      <main className="pt-20 lg:pt-20 min-h-screen">
        <div className="max-w-[1600px] mx-auto p-6 lg:p-12">
          <Outlet />
        </div>
      </main>
      
      {/* Footer / Contact Support */}
      <footer className="py-12 px-6 lg:px-12 border-t bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">APTRANSCO</h2>
          <p className="text-xs text-slate-500 mt-1">© 2026 Transmission Corporation of Andhra Pradesh. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-8 text-xs font-bold text-slate-400">
          <a href="#" className="hover:text-primary transition-colors">Support Center</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>);

};

export default MainLayout;