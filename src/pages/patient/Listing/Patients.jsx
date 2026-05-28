import React, { useState } from 'react'
import PatientColumns from './PatientColumn'
import DataTable from '@/components/Datatable'

const Patients = () => {
    const [deleteId, setDeleteId] = useState([]);

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

    return (
        <DataTable
            columns={PatientColumns()}
            data={data}
            totalDataCount={data.length}
            allcheck={false}
            deleteId={deleteId}
            setDeleteId={setDeleteId}
        />
    )
}

export default Patients