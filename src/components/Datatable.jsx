import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { LayoutGrid, List, PlusSquareIcon, RefreshCcw, Filter, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from './ui/sheet'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

// Import subcomponents and utilities
import DatatableGrid from './DatatableGrid'
import DatatableList from './DatatableList'
import NoRecords from './ui/no-records'

// const DataTableEnumType = {
//     PROJECT: 'PROJECT',
//     CLIENT: 'CLIENT',
//     DAILY_WORK_LOG: 'DAILY_WORK_LOG',
//     BILLING_ENTITY: 'BILLING_ENTITY',
//     SHIFT_REQUEST: 'SHIFT_REQUEST',
//     CLIENT_ADDRESS: 'CLIENT_ADDRESS',
//     INVOICE: 'INVOICE',
//     INVOICE_GENERATE: 'INVOICE_GENERATE'
// };

const Datatable = ({ columns, data = [], totalDataCount, allcheck, showCheckbox = true, setDeleteId, deleteId, pagination, onPageChange, onFilterChange }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(location.search)

    // Page size state
    const [pageSize, setPageSize] = useState(pagination?.limit || 10)
    const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'

    const tbodyRef = useRef(null)

    // Filter states
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [tempFilters, setTempFilters] = useState({});

    // Sync temp filters when opening sheet
    useEffect(() => {
        if (isSheetOpen) {
            setTempFilters(filters);
        }
    }, [isSheetOpen, filters]);

    const handleFilterChange = (columnKey, value) => {
        setTempFilters(prev => ({
            ...prev,
            [columnKey]: value
        }));
    };

    const applyFilters = () => {
        setFilters(tempFilters);
        setIsSheetOpen(false);
        if (onFilterChange) {
            onFilterChange(tempFilters);
        }
    };

    const resetFilters = () => {
        setTempFilters({});
        setFilters({});
        setIsSheetOpen(false);
        if (onFilterChange) {
            onFilterChange({});
        }
    };

    // Filterable columns are those with accessorKey that are not serial number (sl), id, or action
    const filterableColumns = Array.isArray(columns)
        ? columns.filter(col => col.accessorKey && col.accessorKey !== 'sl' && col.accessorKey !== 'id' && col.header)
        : [];

    const filteredData = React.useMemo(() => {
        if (!data || !Array.isArray(data)) return [];
        return data.filter(row => {
            return Object.entries(filters).every(([key, val]) => {
                if (!val) return true;
                const cellValue = row[key];
                if (cellValue === undefined || cellValue === null) return false;
                return String(cellValue).toLowerCase().includes(String(val).toLowerCase());
            });
        });
    }, [data, filters]);

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    // Calculate current page & counts
    const currentPage = pagination?.page || parseInt(searchParams.get('page') || 1)
    const totalRecords = totalDataCount !== undefined ? totalDataCount : (pagination?.total !== undefined ? pagination.total : filteredData.length)
    const totalPages = Math.ceil(totalRecords / pageSize)

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: pageSize,
    })



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
    // const showCheckbox = Array.isArray(deleteId);
    //  h-[calc(100vh-92px)] md:h-[calc(100vh-100px)]
    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#191c24] overflow-hidden text-slate-800 dark:text-slate-100 transition-colors">
            {/* Toolbar */}
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">All Records</span>
                    <span className="bg-gray-100 dark:bg-black/25 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-md font-medium">
                        {totalRecords}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <div className="flex items-center ">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors"
                                        aria-label="Refresh"
                                    >
                                        <RefreshCcw className="size-4 p-0 m-0" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Refresh</p>
                                </TooltipContent>
                            </Tooltip>
                            {/* Filter */}
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <SheetTrigger asChild>
                                            <button
                                                className={`p-2 rounded-lg transition-colors relative ${activeFiltersCount > 0 ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40'}`}
                                                aria-label="Filter"
                                            >
                                                <Filter className="size-4 p-0 m-0" />
                                                {activeFiltersCount > 0 && (
                                                    <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-primary" />
                                                )}
                                            </button>
                                        </SheetTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Filter</p>
                                    </TooltipContent>
                                </Tooltip>
                                <SheetContent side="right" className="w-[380px] sm:w-[440px] flex flex-col h-full bg-white dark:bg-[#191c24] border-l border-gray-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 p-0 shadow-xl">
                                    <SheetHeader className="p-6 border-b border-gray-100 dark:border-slate-800">
                                        <SheetTitle className="text-lg font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                                            <Filter className="size-5 text-gray-500" />
                                            Filter Records
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                        {filterableColumns.length === 0 ? (
                                            <div className="text-sm text-gray-400 dark:text-slate-600 text-center py-8">
                                                No filterable columns found.
                                            </div>
                                        ) : (
                                            filterableColumns.map(col => {
                                                const colKey = col.accessorKey;
                                                const colHeader = typeof col.header === 'string' ? col.header : colKey;
                                                return (
                                                    <div key={colKey} className="space-y-2">
                                                        <Label htmlFor={`filter-${colKey}`} className="text-sm font-medium text-gray-700 dark:text-slate-350">
                                                            {colHeader}
                                                        </Label>
                                                        <div className="relative flex items-center">
                                                            <Input
                                                                id={`filter-${colKey}`}
                                                                placeholder={`Filter by ${String(colHeader).toLowerCase()}...`}
                                                                value={tempFilters[colKey] || ''}
                                                                onChange={(e) => handleFilterChange(colKey, e.target.value)}
                                                                className="w-full pr-8 bg-transparent border border-gray-200 dark:border-slate-800 rounded-md focus-visible:ring-primary focus-visible:border-primary text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-600"
                                                            />
                                                            {tempFilters[colKey] && (
                                                                <button
                                                                    onClick={() => handleFilterChange(colKey, '')}
                                                                    className="absolute right-2.5 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-md"
                                                                >
                                                                    <X className="size-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    <SheetFooter className="p-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-3 mt-auto flex-row">
                                        <Button
                                            variant="outline"
                                            onClick={resetFilters}
                                            className="w-full sm:w-auto border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-350"
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={applyFilters}
                                            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            Apply Filters
                                        </Button>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                            {/* Settings */}
                            {/* <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors"
                                        aria-label="Settings"
                                    >
                                        <Settings className="size-4 p-0 m-0" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Settings</p>
                                </TooltipContent>
                            </Tooltip> */}
                            {/* Add New */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link to={`/hospitals/create`} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors">
                                        <PlusSquareIcon className="size-4 p-0 m-0" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add New</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="w-px h-4 bg-gray-200 dark:bg-slate-800 mx-1" />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40'}`}
                                    onClick={() => setViewMode('grid')}
                                    aria-label="Grid View"
                                >
                                    <LayoutGrid className='size-4 p-0 m-0' />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Grid View</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40'}`}
                                    onClick={() => setViewMode('list')}
                                    aria-label="List View"
                                >
                                    <List className='size-4 p-0 m-0' />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>List View</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Content Area */}
            {filteredData?.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#191c24] min-h-[300px]">
                    <NoRecords
                        title="No Records Found"
                        description={activeFiltersCount > 0 ? "Try adjusting or clearing your filters to see results." : "There are currently no records available."}
                        onReset={activeFiltersCount > 0 ? resetFilters : null}
                    />
                </div>
            ) : viewMode === 'grid' ? (
                <DatatableGrid
                    data={filteredData}
                    table={table}
                    showCheckbox={showCheckbox}
                    allcheck={allcheck}
                    deleteId={deleteId}
                    handleAllChange={handleAllChange}
                    handleCheckboxChange={handleCheckboxChange}
                    handleCheckboxClick={handleCheckboxClick}
                />
            ) : (
                <DatatableList
                    table={table}
                    showCheckbox={showCheckbox}
                    allcheck={allcheck}
                    deleteId={deleteId}
                    handleAllChange={handleAllChange}
                    handleCheckboxChange={handleCheckboxChange}
                    handleCheckboxClick={handleCheckboxClick}
                    tbodyRef={tbodyRef}
                    data={filteredData}
                />
            )}

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Show</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(val) => handlePageSizeChange({ target: { value: val } })}
                    >
                        <SelectTrigger className="w-[50px] h-8 px-2 bg-white dark:bg-[#191c24] border border-gray-200 dark:border-slate-800 rounded-md text-xs text-gray-700 dark:text-slate-350 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent className="min-w-0 w-[60px] bg-white dark:bg-[#191c24] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-350">
                            <SelectItem className="pl-1.5 pr-5 text-xs" value="10">10</SelectItem>
                            <SelectItem className="pl-1.5 pr-5 text-xs" value="25">25</SelectItem>
                            <SelectItem className="pl-1.5 pr-5 text-xs" value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
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
                                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
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
