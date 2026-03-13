import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, UserPlus, Upload, X,
  Mail, BookOpen, CheckCircle2, BarChart2
} from 'lucide-react';
import { api } from '@/services/api';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import StatCard from '@/components/StatCard';

const chartData = [
  { name: 'Completed',   value: 35, color: '#10b981' },
  { name: 'In Progress', value: 45, color: '#6366f1' },
  { name: 'Not Started', value: 20, color: '#f59e0b' },
];

export default function EmployeeManagement() {
  const [employees, setEmployees]   = useState([]);
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssign, setShowAssign]     = useState(null); // employee being assigned
  const [csvResult, setCsvResult]       = useState(null);
  const [importing, setImporting]       = useState(false);
  const [assignCourseId, setAssignCourseId] = useState('');
  const [form, setForm] = useState({ name: '', email: '', department: '' });
  const csvRef = useRef(null);

  useEffect(() => {
    Promise.all([api.getEmployees(), api.getCourses()]).then(([emps, crs]) => {
      setEmployees(emps);
      setCourses(crs);
      setLoading(false);
    });
  }, []);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCSVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setCsvResult(null);
    const result = await api.importEmployeesCSV(file);
    setImporting(false);
    setCsvResult(result);
    // Re-fetch employees
    const fresh = await api.getEmployees();
    setEmployees(fresh);
  };

  const handleAddEmployee = async (ev) => {
    ev.preventDefault();
    const emp = await api.createEmployee(form);
    setEmployees(prev => [...prev, emp]);
    setShowAddModal(false);
    setForm({ name: '', email: '', department: '' });
  };

  const handleAssignCourse = async () => {
    if (!assignCourseId || !showAssign) return;
    await api.assignCourseToEmployee(showAssign.id, assignCourseId);
    setShowAssign(null);
    setAssignCourseId('');
  };

  const stats = {
    total:    employees.length,
    complete: employees.filter(e => e.overallProgress === 100).length,
    active:   employees.filter(e => e.overallProgress > 0 && e.overallProgress < 100).length,
    pending:  employees.filter(e => e.overallProgress === 0).length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Employee Management</h2>
          <p className="text-slate-500 text-sm">Monitor learning paths and completion across departments.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => csvRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Upload size={16} /> {importing ? 'Importing...' : 'Import CSV'}
          </button>
          <input ref={csvRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleCSVUpload} />
          <button
            onClick={() => csvRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <UserPlus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* CSV result banner */}
      <AnimatePresence>
        {csvResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700"
          >
            <CheckCircle2 size={18} />
            <p>Successfully imported <strong>{csvResult.imported}</strong> employees.</p>
            <button onClick={() => setCsvResult(null)} className="ml-auto"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} title="Total Employees" value={stats.total}    icon={UserPlus}     color="blue" />
        <StatCard index={1} title="Completed"        value={stats.complete} icon={CheckCircle2} color="emerald" />
        <StatCard index={2} title="In Progress"      value={stats.active}   icon={BarChart2}    color="purple" />
        <StatCard index={3} title="Not Started"      value={stats.pending}  icon={BookOpen}     color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="glass border-none shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData} cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                  >
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Total Enrolled</span><span className="font-bold">{employees.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Avg. Progress</span>
                <span className="font-bold">
                  {employees.length ? Math.round(employees.reduce((s, e) => s + (e.overallProgress || 0), 0) / employees.length) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="glass border-none shadow-sm lg:col-span-2 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base font-bold">Employee Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text" placeholder="Search..."
                  className="pl-9 pr-4 py-1.5 bg-slate-100/50 dark:bg-slate-800/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 w-52 outline-none"
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="font-bold">Employee</TableHead>
                  <TableHead className="font-bold">Progress</TableHead>
                  <TableHead className="font-bold text-center">Courses</TableHead>
                  <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center text-slate-400">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center text-slate-400">No employees found.</TableCell></TableRow>
                ) : (
                  filtered.map(emp => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{emp.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Mail size={10} /> {emp.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[180px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-medium">
                            <span className="text-primary">{emp.overallProgress}%</span>
                            <span className="text-slate-400">{emp.department || 'General'}</span>
                          </div>
                          <Progress value={emp.overallProgress} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold">{emp.assignmentsCompleted}/{emp.totalAssignments}</span>
                          <span className="text-[10px] text-slate-400 uppercase">Units</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => { setShowAssign(emp); setAssignCourseId(''); }}
                          className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-white transition-all"
                        >
                          Assign Course
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-bold">Add Employee</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={18} /></button>
              </div>
              <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
                {[
                  { label: 'Full Name',   key: 'name',       type: 'text',  placeholder: 'e.g. Ravi Kumar' },
                  { label: 'Email',       key: 'email',      type: 'email', placeholder: 'employee@aptransco.com' },
                  { label: 'Department',  key: 'department', type: 'text',  placeholder: 'e.g. IT, Operations' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{f.label}</label>
                    <input
                      required type={f.type} placeholder={f.placeholder}
                      value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-transparent"
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90">Create Employee</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Course Modal */}
      <AnimatePresence>
        {showAssign && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-lg font-bold">Assign Course</h3>
                  <p className="text-xs text-slate-500 mt-0.5">To: {showAssign.name}</p>
                </div>
                <button onClick={() => setShowAssign(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-3">
                {courses.map(c => (
                  <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${assignCourseId === c.id ? 'border-primary bg-primary/5' : 'hover:border-slate-300'}`}>
                    <input type="radio" name="course" value={c.id} checked={assignCourseId === c.id} onChange={() => setAssignCourseId(c.id)} className="accent-primary" />
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-[10px] text-slate-400">{c.category} • {c.duration}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="p-6 border-t flex gap-3">
                <button onClick={() => setShowAssign(null)} className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={handleAssignCourse} disabled={!assignCourseId}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-40">
                  Assign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}