import React, { useEffect, useState } from "react";
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
import HeaderCard from "@/layouts/HeaderCard";
import CardWithTitle from "@/layouts/CardWithTitle";
import FieldWrapper from "@/components/FieldWrapper";
import { useMasterData } from "@/context/MasterDataContext";
import { getCity } from "@/services/CommonApiCall";
import HospitalService from "@/services/HospitalService";
import { useNavigate } from "react-router-dom";

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
//   pinCode: string;
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

export default function CreateHospital() {
    const { facilities = [], hospitalTypes = [], specialties = [], cities = [], states = [], countries = [] } = useMasterData();

    const [formData, setFormData] = useState({
        name: "",
        registrationNumber: "",
        legalName: "",
        typeId: "",
        statusId: "1",
        email: "",
        phone: "",
        emergencyPhone: "",
        website: "",
        address1: "",
        address2: "",
        cityId: "",
        stateId: "",
        pinCode: "",
        countryId: "",
        description: "",
        specialties: [],
        facilities: [],
        operatingHours: {
            monday: "08:00 AM - 06:00 PM",
            tuesday: "08:00 AM - 06:00 PM",
            wednesday: "08:00 AM - 06:00 PM",
            thursday: "08:00 AM - 06:00 PM",
            friday: "08:00 AM - 06:00 PM",
            saturday: "09:00 AM - 02:00 PM",
            sunday: "Closed"
        },
        bedCapacity: 0
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate()
    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value };
            if (field === "countryId") {
                next.stateId = "";
                next.cityId = "";
            } else if (field === "stateId") {
                next.cityId = "";
            }
            return next;
        });

        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                // Also clear dependent errors
                if (field === "countryId") {
                    delete newErrors.stateId;
                    delete newErrors.cityId;
                } else if (field === "stateId") {
                    delete newErrors.cityId;
                }
                return newErrors;
            });
        }
    };
    const filteredStates = formData.countryId
        ? states.filter(s => s.country?.id === parseInt(formData.countryId))
        : [];

    const filteredCities = formData.stateId
        ? cities.filter(c => c.state?.id === parseInt(formData.stateId))
        : [];

    const handleSpecialtyToggle = (specialty) => {
        setFormData(prev => {
            const current = prev.specialties;
            const updated = current.some(s => s.id === specialty.id)
                ? current.filter(s => s.id !== specialty.id)
                : [...current, { id: specialty.id, name: specialty.name }];
            return { ...prev, specialties: updated };
        });
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
        if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Registration Number is required";
        if (!formData.typeId) newErrors.typeId = "Hospital type is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.address1.trim()) newErrors.address1 = "Address is required";
        if (!formData.cityId) newErrors.cityId = "City is required";
        if (!formData.stateId) newErrors.stateId = "State/Province is required";
        if (!formData.countryId) newErrors.countryId = "Country is required";
        if (formData.bedCapacity < 0) newErrors.bedCapacity = "Bed capacity cannot be negative";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        // Simulate API call
        try {
            console.log("formdata", formData)
            const resp = await HospitalService.createHospital(formData);
            if (resp.success) navigate("/admin/hospitals")
            console.log("resp == ", resp)
        } catch (err) { }
        // await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        // setShowSuccess(true);

        // Reset after showing success
        // setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleCancel = () => {
        // Navigate back or reset form
        if (confirm("Are you sure you want to discard all changes?")) {
            window.history.back();
        }
    };

    // useEffect(() => {
    //     getCity()
    // }, [])

    return (
        <>
            <HeaderCard >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Create New Hospital</h1>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            iconType="ChevronLeft"
                            size="sm"
                            className="sm:h-9"
                        >
                            <span className="hidden sm:inline">Back</span>
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            iconType={isSubmitting ? "Loader2" : "Save"}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white sm:h-9"
                        >
                            {isSubmitting ? "Creating..." : "Create Hospital"}
                        </Button>
                    </div>
                </div>
            </HeaderCard>
            <div>
                {/* Success Toast */}
                {showSuccess && (
                    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <span className="font-medium">Hospital created successfully!</span>
                        </div>
                    </div>
                )}

                <div className="w-full">
                    <form onSubmit={handleSubmit} className=" flex flex-col gap-3 ">
                        {/* Basic Information */}
                        <CardWithTitle title="Basic Information" contentClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <FieldWrapper>
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
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="registrationNumber">
                                    Registration Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="registrationNumber"
                                    placeholder="e.g., 123456789"
                                    value={formData.registrationNumber}
                                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                                    className={errors.registrationNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.registrationNumber && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.registrationNumber}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
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
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="typeId">
                                    Hospital Type <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.typeId}
                                    onValueChange={(value) => handleInputChange("typeId", Number(value))}
                                >
                                    <SelectTrigger className={errors.typeId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hospitalTypes.length > 0 ? (
                                            hospitalTypes.map(type => (
                                                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>Data Not Found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.typeId && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.typeId}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="statusId">Status</Label>
                                <Select
                                    value={formData.statusId}
                                    onValueChange={(value) => handleInputChange("statusId", value)}
                                >
                                    {/* : "active" | "inactive" | "maintenance" */}
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                Active
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="2">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                                Inactive
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="3">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                Under Maintenance
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FieldWrapper>

                            <FieldWrapper>
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
                            </FieldWrapper>

                            {/* Accreditation select removed as it maps to dynamic facilities selection below */}

                            <FieldWrapper className="col-span-full">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of the hospital, its history, and mission..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </FieldWrapper>
                        </CardWithTitle>

                        {/* Contact Information */}
                        <CardWithTitle title="Contact Information" contentClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <FieldWrapper>
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
                            </FieldWrapper>

                            <FieldWrapper>
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
                            </FieldWrapper>

                            {/* <FieldWrapper>
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
                            </FieldWrapper> */}

                            <FieldWrapper>
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
                            </FieldWrapper>
                        </CardWithTitle>

                        <CardWithTitle title="Location" contentClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <FieldWrapper className="col-span-full">
                                <Label htmlFor="address1">
                                    Address Line 1 <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="address1"
                                        placeholder="123 Healthcare Avenue"
                                        className={`pl-10 ${errors.address1 ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.address1}
                                        onChange={(e) => handleInputChange("address1", e.target.value)}
                                    />
                                </div>
                                {errors.address1 && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.address1}
                                    </p>
                                )}
                            </FieldWrapper>
                            <FieldWrapper className="col-span-full">
                                <Label htmlFor="address2">
                                    Address Line 2
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="address2"
                                        placeholder="Suite 100"
                                        className={`pl-10 ${errors.address2 ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.address2}
                                        onChange={(e) => handleInputChange("address2", e.target.value)}
                                    />
                                </div>
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="countryId">
                                    Country <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.countryId}
                                    onValueChange={(value) => handleInputChange("countryId", value)}
                                >
                                    <SelectTrigger className={errors.countryId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.length > 0 ? (
                                            countries.map(country => (
                                                <SelectItem key={country.id} value={country.id.toString()}>{country.name}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>Data Not Found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.countryId && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.countryId}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="stateId">
                                    State / Province <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.stateId}
                                    onValueChange={(value) => handleInputChange("stateId", value)}
                                    disabled={!formData.countryId}
                                >
                                    <SelectTrigger className={errors.stateId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder={formData.countryId ? "Select state" : "Select country first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredStates.length > 0 ? (
                                            filteredStates.map(state => (
                                                <SelectItem key={state.id} value={state.id.toString()}>{state.name}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>Data Not Found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.stateId && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.stateId}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="cityId">
                                    City <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.cityId}
                                    onValueChange={(value) => handleInputChange("cityId", value)}
                                    disabled={!formData.stateId}
                                >
                                    <SelectTrigger className={errors.cityId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder={formData.stateId ? "Select city" : "Select state first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCities.length > 0 ? (
                                            filteredCities.map(city => (
                                                <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>Data Not Found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.cityId && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.cityId}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="pinCode">ZIP / Postal Code</Label>
                                <Input
                                    id="pinCode"
                                    placeholder="10001"
                                    value={formData.pinCode}
                                    onChange={(e) => handleInputChange("pinCode", e.target.value)}
                                />
                            </FieldWrapper>
                        </CardWithTitle>

                        <CardWithTitle title="Facilities & Services" contentClass="flex-col justify-start gap-3 ">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {facilities.length > 0 ? (
                                    facilities.map((facility) => (
                                        <div key={facility.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`facility-${facility.id}`}
                                                checked={formData.facilities.some(f => f.id === facility.id)}
                                                onCheckedChange={(checked) => {
                                                    setFormData(prev => {
                                                        const current = prev.facilities;
                                                        const updated = checked
                                                            ? [...current, { id: facility.id, name: facility.name }]
                                                            : current.filter(f => f.id !== facility.id);
                                                        return { ...prev, facilities: updated };
                                                    });
                                                }}
                                            />
                                            <Label htmlFor={`facility-${facility.id}`} className="cursor-pointer font-normal">
                                                {facility.name}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-500 dark:text-slate-400 text-sm col-span-full">
                                        Data Not Found
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="w-full">
                                <Label className="mb-3 block">Medical Specialties</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
                                    {specialties.length > 0 ? (
                                        specialties.map((specialty) => (
                                            <Badge
                                                key={specialty.id}
                                                variant={formData.specialties.some((spec) => spec.id === specialty.id) ? "default" : "outline"}
                                                className={`cursor-pointer py-1 flex justify-between text-xs transition-all hover:scale-105 ${formData.specialties.some((spec) => spec.id === specialty.id)
                                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    }`}
                                                onClick={() => handleSpecialtyToggle(specialty)}
                                            >
                                                {specialty.name}
                                                {formData.specialties.includes(specialty.name) && (
                                                    <CheckCircle2 className="ml-1 h-3 w-3" />
                                                )}
                                            </Badge>
                                        ))
                                    ) : (
                                        <div className="text-slate-500 dark:text-slate-400 text-sm col-span-full">
                                            Data Not Found
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-slate-500">
                                    Click to select the specialties offered by this hospital
                                </p>
                            </div>
                        </CardWithTitle>

                        {/* Operating Hours */}
                        <CardWithTitle title="Operating Hours" contentClass="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(formData.operatingHours).map(([day, hours]) => (
                                <div key={day} className="space-y-2">
                                    <Label htmlFor={day} className="capitalize font-medium">
                                        {day}
                                    </Label>
                                    <Input
                                        id={day}
                                        placeholder="e.g., 08:00 AM - 06:00 PM"
                                        value={hours}
                                        onChange={(e) => handleHoursChange(day, e.target.value)}
                                    />
                                </div>
                            ))}
                        </CardWithTitle>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleCancel}
                                iconType="ChevronLeft"
                                size="sm"
                                className="sm:h-9"
                            >
                                <span className="hidden sm:inline">Cancel</span>
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                iconType={isSubmitting ? "Loader2" : "Save"}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white sm:h-9 min-w-[120px]"
                            >
                                {isSubmitting ? "Creating..." : "Create Hospital"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
}