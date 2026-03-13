import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell } from
'recharts';

const data = [
{ name: 'Mon', completed: 400, active: 240 },
{ name: 'Tue', completed: 300, active: 139 },
{ name: 'Wed', completed: 200, active: 980 },
{ name: 'Thu', completed: 278, active: 390 },
{ name: 'Fri', completed: 189, active: 480 },
{ name: 'Sat', completed: 239, active: 380 },
{ name: 'Sun', completed: 349, active: 430 }];


export const CompletionTrendChart = () =>
<div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#94A3B8', fontSize: 12 }}
        dy={10} />
      
        <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#94A3B8', fontSize: 12 }} />
      
        <Tooltip
        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
      
        <Area
        type="monotone"
        dataKey="completed"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorCompleted)" />
      
      </AreaChart>
    </ResponsiveContainer>
  </div>;


const batchData = [
{ name: 'Batch A', progress: 85, color: '#6366f1' },
{ name: 'Batch B', progress: 65, color: '#a855f7' },
{ name: 'Batch C', progress: 45, color: '#ec4899' },
{ name: 'Batch D', progress: 90, color: '#10b981' }];


export const BatchProgressChart = () =>
<div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={batchData} layout="vertical">
        <XAxis type="number" hide />
        <YAxis
        dataKey="name"
        type="category"
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#64748b', fontSize: 12 }}
        width={80} />
      
        <Tooltip
        cursor={{ fill: 'transparent' }}
        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
      
        <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={20}>
          {batchData.map((entry, index) =>
        <Cell key={`cell-${index}`} fill={entry.color} />
        )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>;