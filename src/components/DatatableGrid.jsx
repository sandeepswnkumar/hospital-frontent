import { flexRender } from '@tanstack/react-table'
import { Checkbox } from './ui/checkbox'
import { getAvatarBg, getSubtext, formatDate } from './datatableUtils'
import StatusBadge from './ui/status-badge'

const DatatableGrid = ({
    data,
    table,
    showCheckbox,
    allcheck,
    deleteId,
    handleAllChange,
    handleCheckboxChange,
    handleCheckboxClick,
}) => {
    return (
        <div className="flex flex-col flex-1 min-h-0 bg-gray-50/50 dark:bg-black/10">
            {showCheckbox && data?.length > 0 && (
                <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-800/60 flex items-center gap-2.5 text-sm text-gray-650 dark:text-slate-300 shrink-0">
                    <Checkbox
                        id="grid-select-all"
                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-[#191c24]"
                        onCheckedChange={(event) => handleAllChange(event, table.getRowModel().rows)}
                        checked={allcheck || (data.length > 0 && deleteId?.length === data.length)}
                    />
                    <label htmlFor="grid-select-all" className="cursor-pointer font-semibold select-none text-xs">
                        Select All ({data.length} records)
                    </label>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5 flex-1 min-h-0 overflow-auto">
                {table.getRowModel().rows.map((row) => {
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
                                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-[#191c24]"
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
                                                    <StatusBadge status={cellVal} size="sm" />
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
                })}
            </div>
        </div>
    )
}

export default DatatableGrid
