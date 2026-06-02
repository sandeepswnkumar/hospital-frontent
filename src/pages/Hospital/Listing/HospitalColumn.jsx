import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';

export default function HospitalColumns() {
    return [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'name',
            header: 'Hospital Name',
        },
        {
            accessorKey: 'registrationNumber',
            header: 'Registration No',
        },
        {
            accessorKey: 'hospitalType',
            header: 'Hospital Type',
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
                        <Link to={`/admin/hospitals/edit/${id}`} onClick={(e) => e.stopPropagation()}>
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
