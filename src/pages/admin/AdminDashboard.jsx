import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CreditCard, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Patients', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Appointments Today', value: '42', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Revenue (Monthly)', value: '$12,450', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Doctors', value: '24', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of hospital operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-full`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Placeholder for charts or recent activity */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-md border border-dashed">
            <p className="text-muted-foreground">Activity Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
