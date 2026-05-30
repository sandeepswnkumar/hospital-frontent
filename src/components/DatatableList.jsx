import { flexRender } from '@tanstack/react-table'
import { Checkbox } from './ui/checkbox'
import { getColWidthClass, getAvatarBg, getSubtext, formatDate, formatSl } from './datatableUtils'
import StatusBadge from './ui/status-badge'

const DatatableList = ({
    table,
    showCheckbox,
    allcheck,
    deleteId,
    handleAllChange,
    handleCheckboxChange,
    handleCheckboxClick,
    tbodyRef,
    data,
}) => {
    return (
        <div className="flex-1 min-h-0 overflow-auto" ref={tbodyRef}>
            <div className="min-w-max w-full">
                {/* Header */}
                <div className="flex border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-accent dark:bg-[#191c24]   z-10">
                    {showCheckbox && (
                        <div className="w-12 px-4 py-3 flex items-center">
                            <Checkbox
                                className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-[#191c24]"
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
                    {table.getRowModel().rows.map((row) => {
                        const identifier = row.original.name || row.original.sl || row.original.id;
                        const isChecked = allcheck || deleteId?.includes(identifier);
                        return (
                            <div
                                key={row.id}
                                className="flex border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-800/10 transition-colors cursor-pointer"
                            >
                                {showCheckbox && (
                                    <div className="w-12 px-4 py-4 flex items-center">
                                        <Checkbox
                                            className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-[#191c24]"
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
                                                <StatusBadge status={cellValue} size="md" />
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
                    })}
                </div>
            </div>
        </div>
    )
}

export default DatatableList
