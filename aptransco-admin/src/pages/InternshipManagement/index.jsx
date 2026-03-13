import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, CheckCircle2, XCircle, Eye,
  FileDown, Clock, UserPlus, BookOpen, X, ExternalLink
} from 'lucide-react';
import { api } from '@/services/api';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn, formatDate } from '@/lib/utils';
import StatCard from '@/components/StatCard';

export default function InternshipManagement() {
  const [apps, setApps]             = useState([]);
  const [filteredApps, setFiltered] = useState([]);
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [viewApp, setViewApp]       = useState(null);  // detail modal
  const [approveApp, setApproveApp] = useState(null);  // approval + course assign modal
  const [selectedCourse, setSelectedCourse] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    Promise.all([api.getInternshipApplications(), api.getCourses()]).then(([apps, crs]) => {
      setApps(apps);
      setFiltered(apps);
      setCourses(crs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = apps;
    if (filter !== 'all') result = result.filter(a => a.status === filter);
    if (search) {
      result = result.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.college.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [filter, search, apps]);

  const stats = {
    total:    apps.length,
    pending:  apps.filter(a => a.status === 'pending').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  // Approve: changes status, auto creates intern account, assigns course
  const handleApprove = async () => {
    if (!approveApp) return;
    setProcessing(true);
    await api.approveIntern(approveApp.id);
    if (selectedCourse) {
      await api.assignCourseToIntern(approveApp.id, selectedCourse);
    }
    setApps(prev => prev.map(a => a.id === approveApp.id ? { ...a, status: 'approved' } : a));
    setProcessing(false);
    setApproveApp(null);
    setSelectedCourse('');
  };

  const handleReject = async (id) => {
    await api.rejectIntern(id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Internship Management</h2>
          <p className="text-slate-500 text-sm">Review applications from the Internship Portal and manage intern accounts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm font-medium hover:bg-slate-50">
          <FileDown size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} title="Total Applications" value={stats.total}    icon={Filter}       color="blue" />
        <StatCard index={1} title="Approved"           value={stats.approved} icon={CheckCircle2} color="emerald" />
        <StatCard index={2} title="Rejected"           value={stats.rejected} icon={XCircle}      color="pink" />
        <StatCard index={3} title="Pending Review"     value={stats.pending}  icon={Clock}        color="orange" />
      </div>

      <Card className="glass border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-0 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 gap-4">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize',
                    filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  )}
                >
                  {f} {f !== 'all' && <span className="ml-1 text-[10px] font-bold">{apps.filter(a => a.status === f).length}</span>}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text" placeholder="Search name, college..."
                className="pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border rounded-lg text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="font-bold">Student</TableHead>
                <TableHead className="font-bold">College</TableHead>
                <TableHead className="font-bold hidden md:table-cell">Degree / CGPA</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold hidden md:table-cell">Applied</TableHead>
                <TableHead className="text-right font-bold w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-400">Loading applications...</TableCell></TableRow>
              ) : filteredApps.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-400">No applications found.</TableCell></TableRow>
              ) : (
                filteredApps.map(app => (
                  <TableRow key={app.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-sm block">{app.name}</span>
                          <span className="text-[10px] text-slate-400">{app.phone || ''}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{app.college}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-slate-500">
                      {app.degree || '—'} {app.cgpa ? <span className="text-xs text-emerald-600 font-bold ml-1">CGPA {app.cgpa}</span> : ''}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      )}>
                        {app.status === 'approved' && <CheckCircle2 size={11} />}
                        {app.status === 'rejected' && <XCircle size={11} />}
                        {app.status === 'pending'  && <Clock size={11} />}
                        <span className="capitalize">{app.status}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400 font-mono text-xs hidden md:table-cell">
                      {formatDate(app.dateApplied)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 outline-none">•••</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => setViewApp(app)} className="cursor-pointer">
                            <Eye size={14} className="mr-2" /> View Details
                          </DropdownMenuItem>
                          {app.status === 'pending' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => { setApproveApp(app); setSelectedCourse(''); }}
                                className="cursor-pointer text-emerald-600 focus:text-emerald-600"
                              >
                                <UserPlus size={14} className="mr-2" /> Approve & Assign
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(app.id)} className="cursor-pointer text-red-600 focus:text-red-600">
                                <XCircle size={14} className="mr-2" /> Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <AnimatePresence>
        {viewApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h3 className="text-lg font-bold">Application Details</h3>
                <button onClick={() => setViewApp(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 flex items-center justify-center font-black text-2xl">
                    {viewApp.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black">{viewApp.name}</h4>
                    <p className="text-sm text-slate-500">{viewApp.college}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Degree',   value: viewApp.degree || '—' },
                    { label: 'CGPA',     value: viewApp.cgpa || '—' },
                    { label: 'Phone',    value: viewApp.phone || '—' },
                    { label: 'Applied',  value: formatDate(viewApp.dateApplied) },
                    { label: 'Status',   value: viewApp.status },
                  ].map(f => (
                    <div key={f.label} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{f.label}</p>
                      <p className="font-semibold capitalize">{f.value}</p>
                    </div>
                  ))}
                </div>
                {viewApp.skills?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {viewApp.skills.map((s, i) => (
                        <span key={i} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve & Assign Course Modal */}
      <AnimatePresence>
        {approveApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-lg font-bold">Approve &amp; Assign Training</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{approveApp.name}</p>
                </div>
                <button onClick={() => setApproveApp(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={18} /></button>
              </div>

              <div className="p-6 space-y-3">
                <p className="text-xs text-slate-500 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  ✓ An intern account will be automatically created and the selected training course assigned upon approval.
                </p>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Training Course</p>
                {courses.map(c => (
                  <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedCourse === c.id ? 'border-primary bg-primary/5' : 'hover:border-slate-200'}`}>
                    <input type="radio" name="course" value={c.id} checked={selectedCourse === c.id} onChange={() => setSelectedCourse(c.id)} className="accent-primary" />
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-[10px] text-slate-400">{c.category} • {c.duration}</p>
                    </div>
                  </label>
                ))}
                <p className="text-[10px] text-slate-400 italic">You can skip course assignment and assign later from Employee Management.</p>
              </div>

              <div className="p-6 border-t flex gap-3">
                <button onClick={() => setApproveApp(null)} className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? 'Processing...' : <><CheckCircle2 size={16} /> Approve</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}