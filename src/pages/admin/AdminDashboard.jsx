import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  FileText,
  Cloud,
  Clock,
  Mail,
  Layout,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Patients', value: '1,234', percent: '+12%', desc: 'Potential growth', trend: 'up', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Appointments Today', value: '42', percent: '+4.5%', desc: 'Weekly average', trend: 'up', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Revenue (Monthly)', value: '$12,450', percent: '+11%', desc: 'Revenue current', trend: 'up', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Active Doctors', value: '24', percent: '-2.4%', desc: 'Daily attendance', trend: 'down', color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const projects = [
    { title: 'Admin dashboard design', desc: 'Broadcast web app mockup', time: '15 minutes ago', tasks: '30 tasks, 5 issues', icon: FileText, color: 'bg-blue-500 text-white' },
    { title: 'Wordpress Development', desc: 'Upload new design', time: '1 hour ago', tasks: '23 tasks, 5 issues', icon: Cloud, color: 'bg-emerald-500 text-white' },
    { title: 'Project meeting', desc: 'New project discussion', time: '35 minutes ago', tasks: '15 tasks, 2 issues', icon: Clock, color: 'bg-purple-500 text-white' },
    { title: 'Broadcast Mail', desc: 'Sent release details to team', time: '55 minutes ago', tasks: '35 tasks, 7 issues', icon: Mail, color: 'bg-red-500 text-white' },
    { title: 'UI Design', desc: 'New application planning', time: '50 minutes ago', tasks: '27 tasks, 4 issues', icon: Layout, color: 'bg-amber-500 text-white' },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* CORONA Refreshing Look Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-800 via-pink-700 to-red-500 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-6">
          {/* Banner Illustration Icon */}
          <div className="hidden lg:flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center backdrop-blur-md shrink-0">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">New refreshing look</h2>
            <p className="text-pink-100 text-sm max-w-xl">
              Corona admin template now with a new facelift for enhanced legibility and aesthetics!
            </p>
          </div>
        </div>
        <button className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs px-5 py-3 rounded-xl border border-white/20 transition-all shrink-0">
          Get Started
        </button>
      </div>

      {/* CORONA Style Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-slate-200 dark:border-none bg-white dark:bg-[#191c24] text-slate-800 dark:text-white rounded-2xl shadow-md p-5 flex flex-col justify-between h-36">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</span>
                  <span className={`text-xs font-semibold ${stat.color}`}>{stat.percent}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">{stat.desc}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid: Transaction History & Open Projects */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Transaction History */}
        <div className="lg:col-span-4 bg-white dark:bg-[#191c24] border border-slate-200 dark:border-none rounded-2xl p-6 shadow-md flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Transaction History</h3>
            <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* SVG Donut Chart */}
          <div className="flex flex-col items-center justify-center py-6 relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="40" fill="transparent" className="stroke-slate-100 dark:stroke-[#0f1015]" strokeWidth="12" />
                {/* Segment 1: Green */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00d25b" strokeWidth="12" 
                  strokeDasharray="251.2" strokeDashoffset="100.48" /> {/* 60% */}
                {/* Segment 2: Yellow */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffab00" strokeWidth="12" 
                  strokeDasharray="251.2" strokeDashoffset="200.96" /> {/* 20% */}
              </svg>
              {/* Inner Circle content */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-slate-800 dark:text-white">$1200</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Total</span>
              </div>
            </div>
          </div>

          {/* Transfer List */}
          <div className="space-y-4 mt-auto">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-none">
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Transfer to Paypal</h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">07 Jan 2019, 09:12AM</span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">$236</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-none">
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Transfer to Stripe</h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">07 Jan 2019, 09:12AM</span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">$593</span>
            </div>
          </div>
        </div>

        {/* Right Column: Open Projects */}
        <div className="lg:col-span-8 bg-white dark:bg-[#191c24] border border-slate-200 dark:border-none rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Open Projects</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Your data status</p>
            </div>
            <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Projects List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${proj.color} shrink-0`}>
                    <proj.icon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{proj.title}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{proj.desc}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 text-right w-full sm:w-auto">
                  <div className="flex flex-col text-left sm:text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{proj.time}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{proj.tasks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
