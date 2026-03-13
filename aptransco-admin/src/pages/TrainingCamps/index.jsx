import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Plus, X, Search,
  CheckCircle2, Clock, Edit2, Trash2, UserPlus,
  Tent, ChevronDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';
import StatCard from '@/components/StatCard';

const statusColors = {
  upcoming: 'bg-blue-50 text-blue-600 border-blue-100',
  ongoing:  'bg-emerald-50 text-emerald-600 border-emerald-100',
  completed:'bg-slate-100 text-slate-500 border-slate-200',
};

export default function TrainingCamps() {
  const [camps, setCamps] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [assignModal, setAssignModal] = useState(null); // camp being assigned
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', startDate: '', endDate: '', capacity: '', description: '' });

  useEffect(() => {
    api.getTrainingCamps().then(setCamps);
    api.getEmployees().then(setEmployees);
  }, []);

  const filtered = camps.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: camps.length,
    upcoming: camps.filter(c => c.status === 'upcoming').length,
    ongoing: camps.filter(c => c.status === 'ongoing').length,
    completed: camps.filter(c => c.status === 'completed').length,
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const newCamp = await api.createTrainingCamp(form);
    setCamps(prev => [newCamp, ...prev]);
    setShowModal(false);
    setForm({ name: '', location: '', startDate: '', endDate: '', capacity: '', description: '' });
  };

  const handleAssign = async () => {
    await api.assignEmployeesToCamp(assignModal.id, selectedEmployees);
    setCamps(prev => prev.map(c =>
      c.id === assignModal.id
        ? { ...c, enrolledCount: (c.enrolledCount || 0) + selectedEmployees.length }
        : c
    ));
    setAssignModal(null);
    setSelectedEmployees([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Offline Training Camps</h2>
          <p className="text-slate-500 text-sm">Organize and manage offline training sessions for employees.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Create Camp
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} title="Total Camps"    value={stats.total}     icon={Tent}         color="blue" />
        <StatCard index={1} title="Upcoming"       value={stats.upcoming}  icon={Calendar}     color="purple" />
        <StatCard index={2} title="Ongoing"        value={stats.ongoing}   icon={Clock}        color="emerald" />
        <StatCard index={3} title="Completed"      value={stats.completed} icon={CheckCircle2} color="orange" />
      </div>

      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search camps..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm w-full focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Camps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((camp, i) => (
          <motion.div
            key={camp.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass border-none shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{camp.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin size={12} /> {camp.location}
                    </div>
                  </div>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase', statusColors[camp.status] || statusColors.upcoming)}>
                    {camp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{camp.description}</p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar size={13} className="text-primary/70" />
                    <span>{camp.startDate} → {camp.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Users size={13} className="text-primary/70" />
                    <span>{camp.enrolledCount || 0} / {camp.capacity} enrolled</span>
                  </div>
                </div>

                {/* Capacity bar */}
                <div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((camp.enrolledCount || 0) / camp.capacity) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => { setAssignModal(camp); setSelectedEmployees([]); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    <UserPlus size={14} /> Assign Employees
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600">
                    <Edit2 size={15} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            <Tent size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No training camps found</p>
          </div>
        )}
      </div>

      {/* Create Camp Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-bold">Create Training Camp</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Camp Name</label>
                    <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-transparent" placeholder="e.g. Safety Training Camp 2025" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Location</label>
                    <input required value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-transparent" placeholder="City, Venue" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Start Date</label>
                    <input type="date" required value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-transparent" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">End Date</label>
                    <input type="date" required value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-transparent" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Capacity</label>
                    <input type="number" required value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-transparent" placeholder="50" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-transparent resize-none" placeholder="What will be covered..." />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90">Create Camp</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Employees Modal */}
      <AnimatePresence>
        {assignModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-lg font-bold">Assign Employees</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{assignModal.name}</p>
                </div>
                <button onClick={() => setAssignModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-3 max-h-72 overflow-y-auto">
                {employees.map(emp => (
                  <label key={emp.id} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-primary/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={e => setSelectedEmployees(prev =>
                        e.target.checked ? [...prev, emp.id] : prev.filter(id => id !== emp.id)
                      )}
                      className="accent-primary w-4 h-4"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-[10px] text-slate-400">{emp.email}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="p-6 border-t flex gap-3">
                <button onClick={() => setAssignModal(null)} className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button
                  onClick={handleAssign}
                  disabled={selectedEmployees.length === 0}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-40"
                >
                  Assign {selectedEmployees.length > 0 ? `(${selectedEmployees.length})` : ''}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
