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
import {
    User,
    Phone,
    Mail,
    MapPin,
    Globe,
    Stethoscope,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    Save,
    Building2,
    DollarSign,
    Award
} from "lucide-react";
import HeaderCard from "@/layouts/HeaderCard";
import CardWithTitle from "@/layouts/CardWithTitle";
import FieldWrapper from "@/components/FieldWrapper";
import { useMasterData } from "@/context/MasterDataContext";
import HospitalService from "@/services/HospitalService";
import MedicalSpecialtyService from "@/services/MedicalSpecialtyService";
import DoctorService from "@/services/DoctorService";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "@/components/ui/SearchableSelect";

export default function CreateDoctor() {
    const { cities = [], states = [], countries = [] } = useMasterData();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        licenseNumber: "",
        consultationFee: 0,
        experienceYears: "",
        statusId: 1,
        specialtyId: "",
        hospitalId: "",
        address1: "",
        address2: "",
        countryId: "",
        stateId: "",
        cityId: "",
        pinCode: "",
        description: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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

    // Specialty search from backend
    const handleSpecialtySearch = async (query) => {
        try {
            const resp = await MedicalSpecialtyService.getMedicalSpecialties({ search: query });
            if (resp.success && Array.isArray(resp.data)) {
                return resp.data.map(spec => ({
                    value: spec.id,
                    label: spec.name
                }));
            }
        } catch (err) {
            console.error("Failed to search specialties", err);
        }
        return [];
    };

    // Hospital search from backend
    const handleHospitalSearch = async (query) => {
        try {
            const resp = await HospitalService.getHospitals({ search: query });
            if (resp.success && Array.isArray(resp.data)) {
                return resp.data.map(hosp => ({
                    value: hosp.id,
                    label: hosp.name
                }));
            }
        } catch (err) {
            console.error("Failed to search hospitals", err);
        }
        return [];
    };

    const filteredStates = formData.countryId
        ? states.filter(s => s.country?.id === parseInt(formData.countryId))
        : [];

    const filteredCities = formData.stateId
        ? cities.filter(c => c.state?.id === parseInt(formData.stateId))
        : [];

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.specialtyId) newErrors.specialtyId = "Specialty is required";
        if (!formData.hospitalId) newErrors.hospitalId = "Hospital assignment is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
        if (formData.consultationFee < 0) newErrors.consultationFee = "Consultation fee cannot be negative";
        if (!formData.experienceYears.trim()) newErrors.experienceYears = "Experience is required";
        if (!formData.address1.trim()) newErrors.address1 = "Address is required";
        if (!formData.cityId) newErrors.cityId = "City is required";
        if (!formData.stateId) newErrors.stateId = "State/Province is required";
        if (!formData.countryId) newErrors.countryId = "Country is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            console.log("Submitting Create Doctor Data:", formData);
            const resp = await DoctorService.createDoctor(formData);
            console.log("doctor resp ===== ", resp)
            if (resp.success) {
                setShowSuccess(true);
                navigate("/admin/doctors");
                // setTimeout(() => {
                // }, 1500);
            }
        } catch (err) {
            console.error("Error creating doctor:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (confirm("Are you sure you want to discard all changes?")) {
            window.history.back();
        }
    };

    return (
        <>
            <HeaderCard >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Add New Doctor</h1>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            iconType="ChevronLeft"
                            size="sm"
                            className="sm:h-9"
                            type="button"
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
                            {isSubmitting ? "Creating..." : "Create Doctor"}
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
                            <span className="font-medium">Doctor added successfully!</span>
                        </div>
                    </div>
                )}

                <div className="w-full">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        {/* Basic Information */}
                        <CardWithTitle title="Basic Information" contentClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <FieldWrapper>
                                <Label htmlFor="firstName">
                                    First Name <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="firstName"
                                        placeholder="e.g., Jane"
                                        className={`pl-10 ${errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.firstName}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="middleName">Middle Name</Label>
                                <Input
                                    id="middleName"
                                    placeholder="e.g., Marie"
                                    value={formData.middleName}
                                    onChange={(e) => handleInputChange("middleName", e.target.value)}
                                />
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="e.g., Smith"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                />
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => handleInputChange("gender", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="licenseNumber">
                                    License/Registration Number <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="licenseNumber"
                                        placeholder="e.g., LIC123456"
                                        className={`pl-10 ${errors.licenseNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.licenseNumber}
                                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                    />
                                </div>
                                {errors.licenseNumber && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.licenseNumber}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="statusId">Status</Label>
                                <Select
                                    value={formData.statusId ? formData.statusId.toString() : "1"}
                                    onValueChange={(value) => handleInputChange("statusId", Number(value))}
                                >
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
                                    </SelectContent>
                                </Select>
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="consultationFee">
                                    Consultation Fee (₹) <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="consultationFee"
                                        type="number"
                                        min="0"
                                        placeholder="e.g., 500"
                                        className={`pl-10 ${errors.consultationFee ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.consultationFee || ""}
                                        onChange={(e) => handleInputChange("consultationFee", parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                {errors.consultationFee && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.consultationFee}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="experienceYears">
                                    Experience (Years/Text) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="experienceYears"
                                    placeholder="e.g., 8 years"
                                    className={errors.experienceYears ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    value={formData.experienceYears}
                                    onChange={(e) => handleInputChange("experienceYears", e.target.value)}
                                />
                                {errors.experienceYears && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.experienceYears}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper className="col-span-full">
                                <Label htmlFor="description">Biography/Professional Statement</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Dr. Smith has over 10 years of experience in cardiology..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </FieldWrapper>
                        </CardWithTitle>

                        {/* Professional Assignment */}
                        <CardWithTitle title="Professional Placement" contentClass="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FieldWrapper>
                                <Label htmlFor="specialtyId">
                                    Specialty <span className="text-red-500">*</span>
                                </Label>
                                <SearchableSelect
                                    value={formData.specialtyId}
                                    onChange={(value) => handleInputChange("specialtyId", value)}
                                    onSearch={handleSpecialtySearch}
                                    placeholder="Search & select specialty..."
                                    searchPlaceholder="Type specialty name..."
                                />
                                {errors.specialtyId && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.specialtyId}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label htmlFor="hospitalId">
                                    Hospital Assignment <span className="text-red-500">*</span>
                                </Label>
                                <SearchableSelect
                                    value={formData.hospitalId}
                                    onChange={(value) => handleInputChange("hospitalId", value)}
                                    onSearch={handleHospitalSearch}
                                    placeholder="Search & select hospital..."
                                    searchPlaceholder="Type hospital name..."
                                />
                                {errors.hospitalId && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.hospitalId}
                                    </p>
                                )}
                            </FieldWrapper>
                        </CardWithTitle>

                        {/* Contact Information */}
                        <CardWithTitle title="Contact Information" contentClass="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FieldWrapper>
                                <Label htmlFor="email">
                                    Email Address <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="doctor@hospital.com"
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
                        </CardWithTitle>

                        {/* Location */}
                        <CardWithTitle title="Location" contentClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <FieldWrapper className="col-span-full">
                                <Label htmlFor="address1">
                                    Address Line 1 <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="address1"
                                        placeholder="123 Doctor Plaza"
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
                                <Label htmlFor="address2">Address Line 2</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="address2"
                                        placeholder="Suite 404"
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
                                    value={formData.countryId ? formData.countryId.toString() : ""}
                                    onValueChange={(value) => handleInputChange("countryId", value)}
                                >
                                    <SelectTrigger className={errors.countryId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.length > 0 ? (
                                            countries.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
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
                                    value={formData.stateId ? formData.stateId.toString() : ""}
                                    onValueChange={(value) => handleInputChange("stateId", value)}
                                    disabled={!formData.countryId}
                                >
                                    <SelectTrigger className={errors.stateId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder={formData.countryId ? "Select state" : "Select country first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredStates.length > 0 ? (
                                            filteredStates.map(s => (
                                                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
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
                                    value={formData.cityId ? formData.cityId.toString() : ""}
                                    onValueChange={(value) => handleInputChange("cityId", value)}
                                    disabled={!formData.stateId}
                                >
                                    <SelectTrigger className={errors.cityId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder={formData.stateId ? "Select city" : "Select state first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCities.length > 0 ? (
                                            filteredCities.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
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
                                {isSubmitting ? "Creating..." : "Create Doctor"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
