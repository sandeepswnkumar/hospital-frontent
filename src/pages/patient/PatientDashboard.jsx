import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Activity, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const navigate = useNavigate();
  // Mock associated patients (family members)
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', relation: 'Self', age: 35 },
    { id: 2, name: 'Jane Doe', relation: 'Spouse', age: 32 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your family members and appointments.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/patient/add-member')}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Family Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Linked Patients</CardTitle>
            <CardDescription>People managed under your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.relation} • {p.age} yrs</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed">
              <Calendar className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-600">No upcoming appointments</p>
              <Button variant="link" className="text-blue-600" onClick={() => navigate('/patient/make-appointment')}>Book Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
