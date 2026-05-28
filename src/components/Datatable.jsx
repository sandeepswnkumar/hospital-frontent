import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Checkbox } from './ui/checkbox'

const DataTableEnumType = {
    PROJECT: 'PROJECT',
    CLIENT: 'CLIENT',
    DAILY_WORK_LOG: 'DAILY_WORK_LOG',
    BILLING_ENTITY: 'BILLING_ENTITY',
    SHIFT_REQUEST: 'SHIFT_REQUEST',
    CLIENT_ADDRESS: 'CLIENT_ADDRESS',
    INVOICE: 'INVOICE',
    INVOICE_GENERATE: 'INVOICE_GENERATE'
};

// Pure JS date formatter to avoid date-fns dependency issues
const formatDate = (value) => {
    if (!value) return '';
    try {
        const d = new Date(value);
        if (isNaN(d.getTime())) return String(value);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return String(value);
    }
}

// Helpers for styling
const getColWidthClass = (columnId) => {
    const id = columnId.toLowerCase();
    if (id === 'selection') return 'w-12';
    if (id === 'sl') return 'w-12';
    if (id === 'name' || id === 'contactperson' || id === 'contact_person') return 'w-64';
    if (id === 'status') return 'w-40';
    if (id === 'date' || id === 'appointmentdate' || id === 'invoicedate') return 'w-32';
    if (id === 'created_at' || id === 'createdat') return 'w-32';
    if (id === 'amount' || id === 'price') return 'w-24 justify-end text-right';
    if (id === 'designation') return 'w-48';
    if (id === 'client') return 'w-40';
    return 'flex-1';
};

const getAvatarBg = (name) => {
    if (!name) return 'bg-blue-500';
    const charCode = name.charCodeAt(0) || 0;
    const colors = [
        'bg-blue-500 dark:bg-blue-600',
        'bg-teal-500 dark:bg-teal-600',
        'bg-indigo-500 dark:bg-indigo-600',
        'bg-purple-500 dark:bg-purple-600',
        'bg-emerald-500 dark:bg-emerald-600',
        'bg-rose-500 dark:bg-rose-600',
        'bg-amber-500 dark:bg-amber-600'
    ];
    return colors[charCode % colors.length];
};

const getSubtext = (rowOriginal) => {
    if (rowOriginal.designation) return rowOriginal.designation;
    if (rowOriginal.email) return rowOriginal.email;
    const idVal = rowOriginal.id || rowOriginal.sl;
    if (idVal !== undefined) {
        const num = Number(idVal);
        const formattedId = !isNaN(num) ? String(num).padStart(4, '0') : idVal;
        return `ID: #${formattedId}`;
    }
    return '';
};

const getStatusClasses = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'active' || s === 'completed' || s === 'success') {
        return {
            badge: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400',
            dot: 'bg-green-500'
        };
    }
    if (s === 'pending' || s === 'warning') {
        return {
            badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
            dot: 'bg-amber-500'
        };
    }
    if (s === 'inactive' || s === 'cancelled' || s === 'failed') {
        return {
            badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400',
            dot: 'bg-rose-500'
        };
    }
    return {
        badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500'
    };
};

const formatSl = (val) => {
    const num = Number(val);
    if (!isNaN(num)) {
        return num < 10 ? `0${num}` : String(num);
    }
    return String(val);
};

const Datatable = ({ columns, data = [], totalDataCount, type, allcheck, setDeleteId, deleteId, pagination, onPageChange }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(location.search)

    // Page size state
    const [pageSize, setPageSize] = useState(pagination?.limit || 10)
    const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'

    const tbodyRef = useRef(null)
    const [isScrollable, setIsScrollable] = useState(false)

    // Calculate current page & counts
    const currentPage = pagination?.page || parseInt(searchParams.get('page') || 1)
    const totalRecords = totalDataCount !== undefined ? totalDataCount : (pagination?.total !== undefined ? pagination.total : data.length)
    const totalPages = Math.ceil(totalRecords / pageSize)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: pageSize,
    })

    useEffect(() => {
        const checkIfScrollable = () => {
            if (tbodyRef.current) {
                const isScrollable = tbodyRef.current.scrollHeight > tbodyRef.current.clientHeight
                setIsScrollable(isScrollable)
            }
        }
        checkIfScrollable()
        window.addEventListener('resize', checkIfScrollable)
        return () => {
            window.removeEventListener('resize', checkIfScrollable)
        }
    }, [])

    const handleCheckboxChange = (event, row) => {
        const identifier = row.name || row.sl || row.id;
        if (event) {
            if (!deleteId?.includes(identifier)) {
                setDeleteId?.((prevDeleteId) => [...(prevDeleteId || []), identifier])
            }
        } else {
            if (deleteId?.includes(identifier)) {
                setDeleteId?.((prevDeleteId) => (prevDeleteId || []).filter((item) => item !== identifier))
            }
        }
    }

    const handleCheckboxClick = (event) => {
        event.stopPropagation()
    }

    const handleAllChange = (event, rows) => {
        if (event) {
            const identifiers = rows.map((row) => row.original.name || row.original.sl || row.original.id)
            setDeleteId?.(identifiers)
        } else {
            setDeleteId?.([])
        }
    }

    const changePage = (page) => {
        if (page < 1 || page > totalPages) return;
        if (onPageChange) {
            onPageChange(page)
        } else {
            searchParams.set('page', String(page))
            navigate({ search: searchParams.toString() })
        }
    }

    const handlePageSizeChange = (event) => {
        const newSize = parseInt(event.target.value)
        setPageSize(newSize)
        if (onPageChange) {
            onPageChange(1)
        } else {
            searchParams.set('page', '1')
            searchParams.set('limit', String(newSize))
            navigate({ search: searchParams.toString() })
        }
    }

    const getPageNumbers = () => {
        const range = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) range.push(i);
        } else {
            if (currentPage <= 3) {
                range.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                range.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return range;
    };

    // Determine if checkbox column should show
    const showCheckbox = Array.isArray(deleteId);

    return (
        <div className="flex flex-col h-[calc(100vh-92px)] md:h-[calc(100vh-100px)] bg-white dark:bg-[#191c24] rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden text-slate-800 dark:text-slate-100 transition-colors">
            {/* Toolbar */}
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">All Records</span>
                    <span className="bg-gray-100 dark:bg-black/25 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-md font-medium">
                        {totalRecords}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 21h5v-5" />
                        </svg>
                    </button>
                    <button
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors"
                        title="Settings"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx={12} cy={12} r={3} />
                        </svg>
                    </button>
                    <div className="w-px h-4 bg-gray-200 dark:bg-slate-800 mx-1" />
                    <button
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40'}`}
                        title="Grid View"
                        onClick={() => setViewMode('grid')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width={7} height={7} x={3} y={3} rx={1} />
                            <rect width={7} height={7} x={14} y={3} rx={1} />
                            <rect width={7} height={7} x={14} y={14} rx={1} />
                            <rect width={7} height={7} x={3} y={14} rx={1} />
                        </svg>
                    </button>
                    <button
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40'}`}
                        title="List View"
                        onClick={() => setViewMode('list')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1={8} x2={21} y1={6} y2={6} />
                            <line x1={8} x2={21} y1={12} y2={12} />
                            <line x1={8} x2={21} y1={18} y2={18} />
                            <line x1={3} x2="3.01" y1={6} y2={6} />
                            <line x1={3} x2="3.01" y1={12} y2={12} />
                            <line x1={3} x2="3.01" y1={18} y2={18} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5 flex-1 min-h-0 overflow-auto bg-gray-50/50 dark:bg-black/10">
                    {data?.length === 0 ? (
                        <div className="col-span-full flex justify-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                            No Data
                        </div>
                    ) : (
                        table.getRowModel().rows.map((row) => {
                            const nameVal = row.original.contactPerson || row.original.name || `Record #${row.original.sl || row.original.id}`;
                            const isChecked = allcheck || deleteId?.includes(row.original.name || row.original.sl || row.original.id);

                            return (
                                <div
                                    key={row.id}
                                    className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#1f222b] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg ${getAvatarBg(nameVal)} flex items-center justify-center text-white text-sm font-bold`}>
                                                {String(nameVal).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                                    {nameVal}
                                                </h4>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                    {getSubtext(row.original)}
                                                </p>
                                            </div>
                                        </div>
                                        {showCheckbox && (
                                            <Checkbox
                                                className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer bg-white dark:bg-[#191c24]"
                                                onClick={handleCheckboxClick}
                                                onCheckedChange={(event) => handleCheckboxChange(event, row.original)}
                                                checked={isChecked}
                                            />
                                        )}
                                    </div>

                                    {/* Additional info */}
                                    <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-slate-800/60">
                                        {row.getVisibleCells().map((cell) => {
                                            const id = cell.column.id;
                                            if (id === 'sl' || id === 'contactPerson' || id === 'name') return null;

                                            const cellVal = cell.getValue();
                                            return (
                                                <div key={cell.id} className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-400 dark:text-gray-500 font-medium">
                                                        {flexRender(cell.column.columnDef.header, cell.getContext())}
                                                    </span>
                                                    <span className="font-semibold text-gray-700 dark:text-slate-350">
                                                        {id === 'status' ? (
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClasses(cellVal).badge}`}>
                                                                <span className={`w-1 h-1 rounded-full ${getStatusClasses(cellVal).dot}`} />
                                                                {cellVal}
                                                            </span>
                                                        ) : id === 'date' || id === 'created_at' || id === 'invoiceDate' ? (
                                                            formatDate(cellVal)
                                                        ) : (
                                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                /* List/Table View */
                <div className="flex-1 min-h-0 overflow-auto" ref={tbodyRef}>
                    <div className="min-w-max w-full">
                        {/* Header */}
                        <div className="flex border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#191c24] z-10">
                            {showCheckbox && (
                                <div className="w-12 px-3 py-3 flex items-center">
                                    <Checkbox
                                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer bg-white dark:bg-[#191c24]"
                                        onCheckedChange={(event) => handleAllChange(event, table.getRowModel().rows)}
                                        checked={allcheck || (data.length > 0 && deleteId?.length === data.length)}
                                    />
                                </div>
                            )}
                            {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => {
                                    const widthClass = getColWidthClass(header.id);
                                    const isSortable = header.id !== 'sl';
                                    return (
                                        <div
                                            key={header.id}
                                            className={`${widthClass} px-3 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-slate-200`}
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            {isSortable && (
                                                <svg
                                                    className="w-3 h-3 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m21 16-4 4-4-4" />
                                                    <path d="m21 8-4-4-4 4" />
                                                    <path d="M21 12H9" />
                                                </svg>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Body */}
                        <div>
                            {data?.length === 0 ? (
                                <div className="flex justify-center py-8 w-full bg-white dark:bg-[#191c24] text-slate-500 dark:text-slate-400 font-medium">
                                    No Data
                                </div>
                            ) : (
                                table.getRowModel().rows.map((row) => {
                                    const identifier = row.original.name || row.original.sl || row.original.id;
                                    const isChecked = allcheck || deleteId?.includes(identifier);
                                    return (
                                        <div
                                            key={row.id}
                                            className="flex border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-800/10 transition-colors cursor-pointer"
                                        >
                                            {showCheckbox && (
                                                <div className="w-12 px-3 py-4 flex items-center">
                                                    <Checkbox
                                                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer bg-white dark:bg-[#191c24]"
                                                        onClick={handleCheckboxClick}
                                                        onCheckedChange={(event) => handleCheckboxChange(event, row.original)}
                                                        checked={isChecked}
                                                    />
                                                </div>
                                            )}
                                            {row.getVisibleCells().map((cell) => {
                                                const widthClass = getColWidthClass(cell.column.id);
                                                const cellValue = cell.getValue();

                                                return (
                                                    <div
                                                        key={cell.id}
                                                        className={`${widthClass} px-3 py-4 flex items-center text-sm text-gray-600 dark:text-slate-350`}
                                                    >
                                                        {cell.column.id === 'sl' ? (
                                                            <span className="font-medium text-gray-600 dark:text-slate-400">
                                                                {formatSl(cellValue)}
                                                            </span>
                                                        ) : cell.column.id === 'contactPerson' || cell.column.id === 'name' ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-9 h-9 rounded-lg ${getAvatarBg(cellValue)} flex items-center justify-center text-white text-sm font-bold`}>
                                                                    {String(cellValue || '').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {cellValue}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                                        {getSubtext(row.original)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : cell.column.id === 'status' ? (
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(cellValue).badge}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusClasses(cellValue).dot}`} />
                                                                {cellValue}
                                                            </span>
                                                        ) : cell.column.id === 'date' || cell.column.id === 'invoiceDate' ? (
                                                            <span className="text-sm text-gray-600 dark:text-slate-350 flex items-center gap-1.5">
                                                                <svg
                                                                    className="w-3.5 h-3.5 text-gray-400"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <rect width={18} height={18} x={3} y={4} rx={2} ry={2} />
                                                                    <line x1={16} x2={16} y1={2} y2={6} />
                                                                    <line x1={8} x2={8} y1={2} y2={6} />
                                                                    <line x1={3} x2={21} y1={10} y2={10} />
                                                                </svg>
                                                                {formatDate(cellValue)}
                                                            </span>
                                                        ) : cell.column.id === 'created_at' || cell.column.id === 'createdat' ? (
                                                            <span className="text-sm text-gray-500 dark:text-slate-400">
                                                                {formatDate(cellValue)}
                                                            </span>
                                                        ) : cell.column.id === 'amount' || cell.column.id === 'price' ? (
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white w-full text-right">
                                                                {cellValue}
                                                            </span>
                                                        ) : (
                                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Show</span>
                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="bg-white dark:bg-[#191c24] border border-gray-200 dark:border-slate-800 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 dark:text-slate-350"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span>of {totalRecords} records</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => changePage(1)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === 1}
                    >
                        <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m11 17-5-5 5-5" />
                            <path d="m18 17-5-5 5-5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === 1}
                    >
                        <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>

                    {getPageNumbers().map((pageNum, idx) => {
                        if (pageNum === '...') {
                            return (
                                <span key={`dots-${idx}`} className="text-gray-400 px-1 select-none">
                                    ...
                                </span>
                            );
                        }

                        const isActive = pageNum === currentPage;
                        return (
                            <button
                                key={`page-${pageNum}`}
                                onClick={() => changePage(pageNum)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => changePage(currentPage + 1)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={() => changePage(totalPages)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m13 17 5-5-5-5" />
                            <path d="m6 17 5-5-5-5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Datatable
