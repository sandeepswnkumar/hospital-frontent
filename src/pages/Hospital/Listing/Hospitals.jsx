import React, { useEffect, useReducer, useState } from "react";
import HospitalColumns from "./HospitalColumn";
import DataTable from "@/components/Datatable";
import BodyCard from "@/layouts/BodyCard";
import HospitalService from "@/services/HospitalService";

const Hospitals = () => {
    const [deleteId, setDeleteId] = useState([]);
    const [event, updateEvent] = useReducer((prev, next) => ({ ...prev, ...next }), {
        isPageLoading: false,
        hospitalList: []
    })
    const data = [
        {
            sl: 1,
            contactPerson: "Sandeep Kumar",
            designation: "Software Developer",
            client: "Test Corp",
        },
        {
            sl: 2,
            contactPerson: "Priya Sharma",
            designation: "Project Manager",
            client: "Infosys",
        },
        {
            sl: 3,
            contactPerson: "Rahul Verma",
            designation: "UI/UX Designer",
            client: "TCS",
        },
        {
            sl: 4,
            contactPerson: "Anjali Mehta",
            designation: "QA Engineer",
            client: "Wipro",
        },
        {
            sl: 5,
            contactPerson: "Vikram Singh",
            designation: "Business Analyst",
            client: "Accenture",
        },
        {
            sl: 6,
            contactPerson: "Neha Reddy",
            designation: "HR Executive",
            client: "Capgemini",
        },
        {
            sl: 7,
            contactPerson: "Arjun Patel",
            designation: "DevOps Engineer",
            client: "Cognizant",
        },
        {
            sl: 8,
            contactPerson: "Sneha Iyer",
            designation: "Data Analyst",
            client: "HCL",
        },
        {
            sl: 9,
            contactPerson: "Karan Malhotra",
            designation: "System Administrator",
            client: "IBM",
        },
        {
            sl: 10,
            contactPerson: "Meera Nair",
            designation: "Frontend Developer",
            client: "Tech Mahindra",
        },
        {
            sl: 1,
            contactPerson: "Sandeep Kumar",
            designation: "Software Developer",
            client: "Test Corp",
        },
        {
            sl: 2,
            contactPerson: "Priya Sharma",
            designation: "Project Manager",
            client: "Infosys",
        },
        {
            sl: 3,
            contactPerson: "Rahul Verma",
            designation: "UI/UX Designer",
            client: "TCS",
        },
        {
            sl: 4,
            contactPerson: "Anjali Mehta",
            designation: "QA Engineer",
            client: "Wipro",
        },
        {
            sl: 5,
            contactPerson: "Vikram Singh",
            designation: "Business Analyst",
            client: "Accenture",
        },
        {
            sl: 6,
            contactPerson: "Neha Reddy",
            designation: "HR Executive",
            client: "Capgemini",
        },
        {
            sl: 7,
            contactPerson: "Arjun Patel",
            designation: "DevOps Engineer",
            client: "Cognizant",
        },
        {
            sl: 8,
            contactPerson: "Sneha Iyer",
            designation: "Data Analyst",
            client: "HCL",
        },
        {
            sl: 9,
            contactPerson: "Karan Malhotra",
            designation: "System Administrator",
            client: "IBM",
        },
        {
            sl: 10,
            contactPerson: "Meera Nair",
            designation: "Frontend Developer",
            client: "Tech Mahindra",
        },
    ];

    const getHospitals = async () => {
        try {
            const resp = await HospitalService.getHospitals();
            if (resp.success) {
                const formattedData = resp.data.map(hospital => ({
                    ...hospital,
                    hospitalType: hospital.hospitalType?.name ?? '',
                    status: hospital.status?.name ?? ''
                }));
                updateEvent({ hospitalList: formattedData })
            }
        } catch (err) { }
    }

    useEffect(() => {
        updateEvent({ isPageLoading: true })
        getHospitals()
    }, [])

    console.log("event.hospitalList == ", event.hospitalList)

    return (
        <BodyCard className="">
            <DataTable
                columns={HospitalColumns()}
                title="Hospitals"
                data={event.hospitalList}
                // showCheckBox={false}
                totalDataCount={event.hospitalList.length}
                allcheck={false}
                deleteId={deleteId}
                setDeleteId={setDeleteId}
                createRecordUrl="/admin/hospital/create"
                redirectUrl="/admin/hospital"
            />

        </BodyCard>
    );
};

export default Hospitals;
