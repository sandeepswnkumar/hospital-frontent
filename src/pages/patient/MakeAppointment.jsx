import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export default function MakeAppointment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    department: '',
    date: '',
    timeSlot: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking appointment:", formData);
    alert('Appointment booked successfully!');
    navigate('/patient/dashboard');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/patient/dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book Appointment</h1>
          <p className="text-muted-foreground">Schedule a visit with our doctors.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Select the patient, department, and your preferred time.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="patientId">Select Patient</Label>
              <Select value={formData.patientId} onValueChange={(value) => setFormData({ ...formData, patientId: value })}>
                <SelectTrigger id="patientId">
                  <SelectValue placeholder="Who is this appointment for?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">John Doe (Self)</SelectItem>
                  <SelectItem value="spouse">Jane Doe (Spouse)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select medical department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Medicine</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeSlot">Time Slot</Label>
                <Select value={formData.timeSlot} onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}>
                  <SelectTrigger id="timeSlot">
                    <SelectValue placeholder="Select available time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10:30">10:30 AM - 11:30 AM</SelectItem>
                    <SelectItem value="13:00">01:00 PM - 02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM - 04:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => navigate('/patient/dashboard')}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Confirm Booking</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
