import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Phone,
    Mail,
    MapPin,
    Globe,
    Stethoscope,
    Clock,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    Save,
    X
} from "lucide-react";

// Types
// interface HospitalFormData {
//   name: string;
//   legalName: string;
//   type: string;
//   status: "active" | "inactive" | "maintenance";
//   email: string;
//   phone: string;
//   emergencyPhone: string;
//   website: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   description: string;
//   specialties: string[];
//   operatingHours: {
//     monday: string;
//     tuesday: string;
//     wednesday: string;
//     thursday: string;
//     friday: string;
//     saturday: string;
//     sunday: string;
//   };
//   hasEmergency: boolean;
//   hasICU: boolean;
//   hasPharmacy: boolean;
//   bedCapacity: number;
//   accreditation: string;
// }

const SPECIALTIES = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Oncology",
    "Radiology",
    "Dermatology",
    "Psychiatry",
    "Emergency Medicine",
    "General Surgery",
    "Internal Medicine",
    "Obstetrics & Gynecology",
    "Ophthalmology",
    "Urology",
    "Pulmonology",
    "Nephrology",
    "Gastroenterology",
    "Endocrinology",
    "Rheumatology",
    "Infectious Disease"
];

const HOSPITAL_TYPES = [
    "General Hospital",
    "Specialty Hospital",
    "Teaching Hospital",
    "Children's Hospital",
    "Psychiatric Hospital",
    "Rehabilitation Center",
    "Clinic",
    "Trauma Center",
    "Community Hospital",
    "Research Hospital"
];

const ACCREDITATIONS = [
    "JCI (Joint Commission International)",
    "ISO 9001",
    "NABH (India)",
    "CAP (College of American Pathologists)",
    "HIMSS Stage 7",
    "Magnet Recognition",
    "Leapfrog Grade A",
    "Local Health Authority",
    "None"
];

export default function CreateHospital() {
    const [formData, setFormData] = useState({
        name: "",
        legalName: "",
        type: "",
        status: "active",
        email: "",
        phone: "",
        emergencyPhone: "",
        website: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        description: "",
        specialties: [],
        operatingHours: {
            monday: "08:00 - 18:00",
            tuesday: "08:00 - 18:00",
            wednesday: "08:00 - 18:00",
            thursday: "08:00 - 18:00",
            friday: "08:00 - 18:00",
            saturday: "09:00 - 14:00",
            sunday: "Closed"
        },
        hasEmergency: false,
        hasICU: false,
        hasPharmacy: false,
        bedCapacity: 0,
        accreditation: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSpecialtyToggle = (specialty) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }));
    };

    const handleHoursChange = (day, value) => {
        setFormData(prev => ({
            ...prev,
            operatingHours: {
                ...prev.operatingHours,
                [day]: value
            }
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Hospital name is required";
        if (!formData.legalName.trim()) newErrors.legalName = "Legal name is required";
        if (!formData.type) newErrors.type = "Hospital type is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State/Province is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (formData.bedCapacity < 0) newErrors.bedCapacity = "Bed capacity cannot be negative";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setShowSuccess(true);

        // Reset after showing success
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleCancel = () => {
        // Navigate back or reset form
        if (confirm("Are you sure you want to discard all changes?")) {
            window.history.back();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">Hospital created successfully!</span>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            className="mb-2 -ml-4 text-slate-600 hover:text-slate-900"
                            onClick={handleCancel}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Back to Hospitals
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Create New Hospital
                        </h1>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">
                            Register a new healthcare facility in the system
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="hidden sm:flex"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Creating..." : "Create Hospital"}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="h-5 w-5 text-emerald-600" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>
                                Essential details about the hospital facility
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="name">
                                    Hospital Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., St. Mary's General Hospital"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="legalName">
                                    Legal/Registered Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="legalName"
                                    placeholder="e.g., St. Mary's Healthcare System, Inc."
                                    value={formData.legalName}
                                    onChange={(e) => handleInputChange("legalName", e.target.value)}
                                    className={errors.legalName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.legalName && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.legalName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">
                                    Hospital Type <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => handleInputChange("type", value)}
                                >
                                    <SelectTrigger className={errors.type ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HOSPITAL_TYPES.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.type}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleInputChange("status", value)}
                                >
                                    {/* : "active" | "inactive" | "maintenance" */}
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                Active
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                                Inactive
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="maintenance">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                Under Maintenance
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bedCapacity">Bed Capacity</Label>
                                <Input
                                    id="bedCapacity"
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 250"
                                    value={formData.bedCapacity || ""}
                                    onChange={(e) => handleInputChange("bedCapacity", parseInt(e.target.value) || 0)}
                                    className={errors.bedCapacity ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accreditation">Accreditation</Label>
                                <Select
                                    value={formData.accreditation}
                                    onValueChange={(value) => handleInputChange("accreditation", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select accreditation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ACCREDITATIONS.map(acc => (
                                            <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of the hospital, its history, and mission..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Phone className="h-5 w-5 text-blue-600" />
                                Contact Information
                            </CardTitle>
                            <CardDescription>
                                How to reach the hospital administration
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email Address <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@hospital.com"
                                        className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Phone Number <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        className={`pl-10 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emergencyPhone">Emergency Hotline</Label>
                                <div className="relative">
                                    <AlertCircle className="absolute left-3 top-2.5 h-4 w-4 text-red-400" />
                                    <Input
                                        id="emergencyPhone"
                                        type="tel"
                                        placeholder="911 or local emergency number"
                                        className="pl-10"
                                        value={formData.emergencyPhone}
                                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="website"
                                        type="url"
                                        placeholder="https://www.hospital.com"
                                        className="pl-10"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5 text-rose-600" />
                                Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="address">
                                    Street Address <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="address"
                                        placeholder="123 Healthcare Avenue, Suite 100"
                                        className={`pl-10 ${errors.address ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                    />
                                </div>
                                {errors.address && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">
                                    City <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="city"
                                    placeholder="New York"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    className={errors.city ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.city && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.city}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">
                                    State / Province <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="state"
                                    placeholder="NY"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange("state", e.target.value)}
                                    className={errors.state ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.state && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.state}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                                <Input
                                    id="zipCode"
                                    placeholder="10001"
                                    value={formData.zipCode}
                                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">
                                    Country <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="country"
                                    placeholder="United States"
                                    value={formData.country}
                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                    className={errors.country ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.country && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.country}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Facilities & Services */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Stethoscope className="h-5 w-5 text-violet-600" />
                                Facilities & Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="emergency"
                                        checked={formData.hasEmergency}
                                        onCheckedChange={(checked) => handleInputChange("hasEmergency", checked)}
                                    />
                                    <Label htmlFor="emergency" className="cursor-pointer font-normal">
                                        24/7 Emergency Department
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="icu"
                                        checked={formData.hasICU}
                                        onCheckedChange={(checked) => handleInputChange("hasICU", checked)}
                                    />
                                    <Label htmlFor="icu" className="cursor-pointer font-normal">
                                        Intensive Care Unit (ICU)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="pharmacy"
                                        checked={formData.hasPharmacy}
                                        onCheckedChange={(checked) => handleInputChange("hasPharmacy", checked)}
                                    />
                                    <Label htmlFor="pharmacy" className="cursor-pointer font-normal">
                                        On-site Pharmacy
                                    </Label>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label className="mb-3 block">Medical Specialties</Label>
                                <div className="flex flex-wrap gap-2">
                                    {SPECIALTIES.map((specialty) => (
                                        <Badge
                                            key={specialty}
                                            variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                                            className={`cursor-pointer transition-all hover:scale-105 ${formData.specialties.includes(specialty)
                                                ? "bg-emerald-600 hover:bg-emerald-700"
                                                : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                                }`}
                                            onClick={() => handleSpecialtyToggle(specialty)}
                                        >
                                            {specialty}
                                            {formData.specialties.includes(specialty) && (
                                                <CheckCircle2 className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="mt-2 text-sm text-slate-500">
                                    Click to select the specialties offered by this hospital
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operating Hours */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="h-5 w-5 text-amber-600" />
                                Operating Hours
                            </CardTitle>
                            <CardDescription>
                                Regular visiting and outpatient hours
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(formData.operatingHours).map(([day, hours]) => (
                                <div key={day} className="space-y-2">
                                    <Label htmlFor={day} className="capitalize font-medium">
                                        {day}
                                    </Label>
                                    <Input
                                        id={day}
                                        placeholder="e.g., 08:00 - 18:00"
                                        value={hours}
                                        onChange={(e) => handleHoursChange(day, e.target.value)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Footer Actions */}
                    <CardFooter className="flex justify-end gap-4 px-0">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleCancel}
                            className="sm:hidden"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleCancel}
                            className="hidden sm:inline-flex"
                        >
                            Discard Changes
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Hospital
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </div>
        </div>
    );
}