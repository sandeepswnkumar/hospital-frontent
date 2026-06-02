import React, { useEffect, useReducer, useState } from "react";
import DoctorColumns from "./DoctorColumn";
import DataTable from "@/components/Datatable";
import BodyCard from "@/layouts/BodyCard";
import DoctorService from "@/services/DoctorService";

const Doctors = () => {
    const [deleteId, setDeleteId] = useState([]);
    const [event, updateEvent] = useReducer((prev, next) => ({ ...prev, ...next }), {
        isPageLoading: false,
        doctorList: []
    });

    const getDoctors = async () => {
        try {
            updateEvent({ isPageLoading: true });
            const resp = await DoctorService.getDoctors();
            if (resp.success) {
                const formattedData = resp.data.map(doctor => ({
                    ...doctor,
                    specialty: doctor.specialty?.name || doctor.medicalSpecialty?.name || doctor.specialty || '',
                    status: doctor.status?.name || doctor.status || ''
                }));
                updateEvent({ doctorList: formattedData });
            }
        } catch (err) {
            console.error("Error fetching doctors list", err);
        } finally {
            updateEvent({ isPageLoading: false });
        }
    }

    useEffect(() => {
        getDoctors();
    }, []);

    return (
        <BodyCard className="">
            <DataTable
                columns={DoctorColumns()}
                title="Doctors"
                data={event.doctorList}
                totalDataCount={event.doctorList.length}
                allcheck={false}
                deleteId={deleteId}
                setDeleteId={setDeleteId}
                createRecordUrl="/admin/doctor/create"
                redirectUrl="/admin/doctor"
            />
        </BodyCard>
    );
};

export default Doctors;
