import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronUp,
    ChevronDown,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Loader2,
    X
} from 'lucide-react';

// ============================================================
// DataTable Component
// ============================================================

/**
 * @param {Object} props
 * @param {Array} props.columns - Column definitions: [{ key: 'name', label: 'Name', sortable: true, width: '200px', render: (row) => <span>{row.name}</span> }]
 * @param {Array} props.data - Array of data objects
 * @param {Object} props.pagination - { page: 1, limit: 10, total: 100, totalPages: 10 }
 * @param {Function} props.onPageChange - (page) => void
 * @param {Function} props.onSort - (key, direction) => void
 * @param {Function} props.onSearch - (query) => void
 * @param {Function} props.onAction - (action, row) => void
 * @param {Boolean} props.loading - Loading state
 * @param {String} props.title - Table title
 * @param {String} props.searchPlaceholder - Search input placeholder
 * @param {Number} props.debounceMs - Search debounce milliseconds (default: 300)
 */
export default function DataTable({
    columns = [],
    data = [],
    pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
    onPageChange,
    onSort,
    onSearch,
    onAction,
    loading = false,
    title = 'Data Table',
    searchPlaceholder = 'Search...',
    debounceMs = 300
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const searchTimeoutRef = useRef(null);
    const menuRef = useRef(null);

    // Sync URL with filters (for backend fetching)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        // Update URL without page reload
        if (searchQuery) params.set('search', searchQuery);
        else params.delete('search');

        if (sortConfig.key) {
            params.set('sort', sortConfig.key);
            params.set('order', sortConfig.direction);
        } else {
            params.delete('sort');
            params.delete('order');
        }

        params.set('page', pagination.page);
        params.set('limit', pagination.limit);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }, [searchQuery, sortConfig, pagination.page, pagination.limit]);

    // Handle search with debounce
    const handleSearchChange = useCallback((value) => {
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            onSearch?.(value);
            onPageChange?.(1); // Reset to first page on search
        }, debounceMs);
    }, [onSearch, onPageChange, debounceMs]);

    // Handle sort
    const handleSort = useCallback((key) => {
        if (!columns.find(c => c.key === key)?.sortable) return;

        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
        onSort?.(key, direction);
    }, [sortConfig, columns, onSort]);

    // Handle action click
    const handleAction = useCallback((action, row) => {
        setActionMenuOpen(null);
        onAction?.(action, row);
    }, [onAction]);

    // Close action menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActionMenuOpen(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = useCallback((e, rowIndex) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Trigger row click or action
        }
        if (e.key === 'ArrowDown' && rowIndex < data.length - 1) {
            document.getElementById(`row-${rowIndex + 1}`)?.focus();
        }
        if (e.key === 'ArrowUp' && rowIndex > 0) {
            document.getElementById(`row-${rowIndex - 1}`)?.focus();
        }
    }, [data.length]);

    // Generate page numbers
    const getPageNumbers = () => {
        const { page, totalPages } = pagination;
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    // Get sort icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ChevronUp size={14} className="text-slate-300" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} className="text-blue-600" />
            : <ChevronDown size={14} className="text-blue-600" />;
    };

    // Default cell render
    const defaultRender = (row, col) => {
        const value = row[col.key];
        if (col.render) return col.render(row);
        if (value === null || value === undefined) return <span className="text-slate-400 dark:text-slate-500">—</span>;
        return <span className="text-slate-700 dark:text-slate-350">{value}</span>;
    };

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{title}</h2>

                    {/* Search */}
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            aria-label="Search table data"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-400"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Container - Horizontal scroll on mobile */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 sm:px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 select-none' : ''
                                        } ${col.width ? '' : 'whitespace-nowrap'}`}
                                    style={col.width ? { width: col.width, minWidth: col.width } : {}}
                                    onClick={() => handleSort(col.key)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSort(col.key)}
                                    tabIndex={col.sortable ? 0 : -1}
                                    aria-sort={sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="inline-flex flex-col" aria-hidden="true">
                                                {getSortIcon(col.key)}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {/* Actions column */}
                            <th className="px-4 sm:px-6 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                                    <div className="text-slate-400 dark:text-slate-500">
                                        <Search size={32} className="mx-auto mb-3 opacity-50" />
                                        <p className="font-medium">No results found</p>
                                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    id={`row-${index}`}
                                    className={`hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-900/50'
                                        }`}
                                    tabIndex={0}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-4 sm:px-6 py-4 whitespace-nowrap"
                                        >
                                            {defaultRender(row, col)}
                                        </td>
                                    ))}

                                    {/* Actions Cell */}
                                    <td className="px-4 sm:px-6 py-4 text-right">
                                        <div className="relative inline-block" ref={menuRef}>
                                            <button
                                                onClick={() => setActionMenuOpen(actionMenuOpen === row.id ? null : row.id)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                aria-label="Open actions menu"
                                                aria-expanded={actionMenuOpen === row.id}
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>

                                            {actionMenuOpen === row.id && (
                                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50 py-1">
                                                    <button
                                                        onClick={() => handleAction('view', row)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                    >
                                                        <Eye size={16} className="text-blue-500" />
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('edit', row)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                    >
                                                        <Edit size={16} className="text-amber-500" />
                                                        Edit
                                                    </button>
                                                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                                    <button
                                                        onClick={() => handleAction('delete', row)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Info */}
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span> of{' '}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.total}</span> results
                    </p>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        {/* First */}
                        <button
                            onClick={() => onPageChange?.(1)}
                            disabled={pagination.page === 1 || loading}
                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="First page"
                        >
                            <ChevronsLeft size={18} />
                        </button>

                        {/* Previous */}
                        <button
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            disabled={pagination.page === 1 || loading}
                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange?.(pageNum)}
                                    disabled={loading}
                                    className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${pagination.page === pageNum
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                        }`}
                                    aria-label={`Page ${pageNum}`}
                                    aria-current={pagination.page === pageNum ? 'page' : undefined}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        {/* Next */}
                        <button
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages || loading}
                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next page"
                        >
                            <ChevronRight size={18} />
                        </button>

                        {/* Last */}
                        <button
                            onClick={() => onPageChange?.(pagination.totalPages)}
                            disabled={pagination.page === pagination.totalPages || loading}
                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Last page"
                        >
                            <ChevronsRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}