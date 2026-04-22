/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Student } from '../lib/firebase';
import { Users, GraduationCap, TrendingUp, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  students: Student[];
}

export default function DashboardOverview({ students }: Props) {
  const totalStudents = students.length;
  const avgCGPA = students.length > 0 
    ? (students.reduce((acc, s) => acc + s.cgpa, 0) / students.length).toFixed(2)
    : '0.00';

  // Dept Distribution
  const deptData = students.reduce((acc: any, s) => {
    const dept = s.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(deptData).map(name => ({
    name,
    value: deptData[name]
  }));

  // CGPA Distribution
  const cgpaRanges = [
    { range: '0-5', count: 0 },
    { range: '5-7', count: 0 },
    { range: '7-8', count: 0 },
    { range: '8-9', count: 0 },
    { range: '9-10', count: 0 },
  ];

  students.forEach(s => {
    if (s.cgpa < 5) cgpaRanges[0].count++;
    else if (s.cgpa < 7) cgpaRanges[1].count++;
    else if (s.cgpa < 8) cgpaRanges[2].count++;
    else if (s.cgpa < 9) cgpaRanges[3].count++;
    else cgpaRanges[4].count++;
  });

  const COLORS = ['#F27D26', '#FFFFFF', '#404040', '#808080', '#A0A0A0'];

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-zinc-950 border border-white/10 p-8 flex flex-col gap-4">
      <div className={cn("w-12 h-12 flex items-center justify-center bg-zinc-900 border border-white/5", color)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{label}</p>
        <p className="display-text text-4xl">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Enrollment" value={totalStudents} color="text-orange-500" />
        <StatCard icon={GraduationCap} label="Average CGPA" value={avgCGPA} color="text-white" />
        <StatCard icon={TrendingUp} label="High Achievers" value={students.filter(s => s.cgpa >= 9).length} color="text-green-500" />
        <StatCard icon={BookOpen} label="Departments" value={pieData.length} color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dept Chart */}
        <div className="bg-zinc-950 border border-white/10 p-10">
          <p className="section-label mb-8">01. Department Distribution</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '10px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-[10px] font-black uppercase text-zinc-500">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* performance Chart */}
        <div className="bg-zinc-950 border border-white/10 p-10">
          <p className="section-label mb-8">02. Academic Performance Spread</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpaRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="range" 
                  stroke="#444" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontWeight: 900, textTransform: 'uppercase' }}
                />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff', fontSize: '10px' }} />
                <Bar dataKey="count" fill="#F27D26" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
