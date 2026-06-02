import { flexRender } from '@tanstack/react-table'
import { Checkbox } from './ui/checkbox'
import { useNavigate } from 'react-router-dom'

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
    redirectUrl = ""
}) => {
    const navigate = useNavigate()
    const redirectToPage = (id) => {
        if (!redirectUrl) return false
        navigate(`${redirectUrl}/${id}`)
    }
    return (
        <div className="flex-1 min-h-0 overflow-auto" ref={tbodyRef}>
            <table className="w-full text-left border-collapse min-w-max">
                {/* Header */}
                <thead className="sticky top-0 bg-accent dark:bg-[#191c24] z-10 border-b border-gray-100 dark:border-slate-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {showCheckbox && (
                                <th className="w-12 ps-3 px-2 py-3 text-left align-middle">
                                    <div className="flex items-center">
                                        <Checkbox
                                            className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-[#191c24]"
                                            onCheckedChange={(event) => handleAllChange(event, table.getRowModel().rows)}
                                            checked={allcheck || (data.length > 0 && deleteId?.length === data.length)}
                                        />
                                    </div>
                                </th>
                            )}
                            {headerGroup.headers.map((header) => {
                                const isSortable = header.id !== 'sl';
                                return (
                                    <th
                                        key={header.id}
                                        className="px-2 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-700 dark:hover:text-slate-200 text-left align-middle"
                                    >
                                        <span className="flex items-center gap-1">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            {isSortable && (
                                                <svg
                                                    className="w-3 h-3 text-gray-400 flex-shrink-0"
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
                                        </span>
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>

                {/* Body */}
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        const identifier = row.original.name || row.original.sl || row.original.id;
                        const isChecked = allcheck || deleteId?.includes(identifier);
                        return (
                            <tr
                                key={row.id}
                                className="border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-800/10 transition-colors cursor-pointer"
                                onClick={() => redirectToPage(row.original.id)}
                            >
                                {showCheckbox && (
                                    <td className="w-12 ps-3 p-2 align-middle" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center">
                                            <Checkbox
                                                className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-[#191c24]"
                                                onClick={handleCheckboxClick}
                                                onCheckedChange={(event) => handleCheckboxChange(event, row.original)}
                                                checked={isChecked}
                                            />
                                        </div>
                                    </td>
                                )}
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td
                                            key={cell.id}
                                            className="p-2 text-sm text-gray-600 dark:text-slate-350 align-middle"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default DatatableList
