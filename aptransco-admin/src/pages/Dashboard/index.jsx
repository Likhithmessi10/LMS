import { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  UserCheck,
  Video,
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink } from
'lucide-react';
import StatCard from '@/components/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CompletionTrendChart, BatchProgressChart } from '@/components/DashboardCharts';
import { api } from '@/services/api';

import { formatDate, cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const [recentApps, setRecentApps] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apps, ann, ses] = await Promise.all([
        api.getInternshipApplications(),
        api.getAnnouncements(),
        api.getLiveSessions()]
        );
        setRecentApps(apps.slice(0, 3));
        setAnnouncements(ann.slice(0, 3));
        setSessions(ses.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('Overview')}</h2>
          <p className="text-slate-500 text-sm">{t("Welcome back, Admin. Here's what's happening today.")}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          title="Total Employees"
          value="1,248"
          icon={Users}
          trend={{ value: 12, label: 'vs last month', isPositive: true }}
          color="blue" />
        
        <StatCard
          index={1}
          title="Active Courses"
          value="24"
          icon={BookOpen}
          description="4 new this week"
          color="purple" />
        
        <StatCard
          index={2}
          title="Internship Apps"
          value="86"
          icon={UserCheck}
          trend={{ value: 5, label: 'vs yesterday', isPositive: true }}
          color="orange" />
        
        <StatCard
          index={3}
          title="Live Sessions"
          value="12"
          icon={Video}
          description="Pending for today"
          color="emerald" />
        
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Course Completion Trend</CardTitle>
              <TrendingUp className="text-slate-400" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <CompletionTrendChart />
          </CardContent>
        </Card>

        <Card className="glass border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Batch Progress Statistics</CardTitle>
              <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase">Real-time</div>
            </div>
          </CardHeader>
          <CardContent>
            <BatchProgressChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Internship Applications */}
        <Card className="glass border-none shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              Recent Internship Apps
              <button className="text-primary text-xs hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApps.map((app) =>
            <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">{app.name}</h4>
                    <p className="text-[10px] text-slate-500">{app.college}</p>
                  </div>
                </div>
                <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-medium",
                app.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
              )}>
                  {app.status}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="glass border-none shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((ann) =>
            <div key={ann.id} className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-semibold mb-1">{ann.title}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1">{ann.description}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock size={10} />
                  {formatDate(ann.date)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Live Sessions */}
        <Card className="glass border-none shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Upcoming Live Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map((session) =>
            <div key={session.id} className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold">{session.title}</h4>
                  <span className="text-[10px] font-bold text-primary">{session.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 italic">By {session.instructor}</span>
                  <a href={session.link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default Dashboard;