import React from 'react';
import { Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorColumns() {
    return [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'name',
            header: 'Doctor Name',
        },
        {
            accessorKey: 'specialty',
            header: 'Specialty',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
        },
        {
            accessorKey: 'consultationFee',
            header: 'Consultation Fee',
            cell: ({ getValue }) => {
                const charge = getValue();
                return charge !== undefined && charge !== null ? `₹${charge}` : '';
            }
        },
        {
            accessorKey: 'experienceYears',
            header: 'Experience',
        },
        {
            accessorKey: 'status',
            header: 'Status',
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const id = row.original.id;
                return (
                    <div className="flex items-center gap-2">
                        <Link to={`/admin/doctor/${id}`} onClick={(e) => e.stopPropagation()}>
                            <button className="p-1.5 text-slate-500 hover:text-emerald-600 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                                <Pencil className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                );
            }
        }
    ]
}
