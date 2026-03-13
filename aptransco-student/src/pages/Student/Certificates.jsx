import { Award, Download, ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Certificates = () => {
  const certificates = [
  {
    id: 'cert_1',
    title: 'Power Systems Fundamentals',
    date: 'Jan 15, 2026',
    grade: 'A+',
    issuer: 'APTRANSCO Academy',
    id_code: 'APT-2026-9901'
  },
  {
    id: 'cert_2',
    title: 'Safety Protocol & First Aid',
    date: 'Dec 10, 2025',
    grade: 'Pass',
    issuer: 'Safety Board',
    id_code: 'APT-SAFE-4421'
  }];


  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Achievements</h1>
        <p className="text-sm text-slate-500 font-bold mt-2">View and download your earned certificates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {certificates.map((cert, i) =>
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}>
          
            <Card className="glass shadow-none border-none overflow-hidden group hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 border border-white/10">
              <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center shrink-0 border border-primary/20 shadow-xl shadow-primary/5 uppercase font-black text-2xl">
                  <Award size={48} />
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{cert.title}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {cert.date}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-primary uppercase tracking-widest">{cert.issuer}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">ID: {cert.id_code}</p>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                  <button className="p-3 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                    <Download size={18} />
                  </button>
                  <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>);

};

export default Certificates;