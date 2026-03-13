import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';















const colorMap = {
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20'
};

const StatCard = ({ title, value, icon: Icon, description, trend, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass overflow-hidden rounded-2xl p-6 border group hover:border-primary/30 transition-all duration-300">
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{value}</h3>
          
          {trend &&
          <div className="flex items-center gap-2">
              <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-xs text-slate-400">{trend.label}</span>
            </div>
          }
          
          {description && !trend &&
          <p className="text-xs text-slate-400">{description}</p>
          }
        </div>
        
        <div className={cn(
          "p-3 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110",
          colorMap[color]
        )}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Animated progress-like background bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>);

};

export default StatCard;