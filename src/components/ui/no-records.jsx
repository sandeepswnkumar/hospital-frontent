import { Inbox } from 'lucide-react'
import { Button } from './button'

const NoRecords = ({ 
    title = "No Records Found", 
    description = "We couldn't find any records matching your search or filters.", 
    onReset 
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800/40 text-gray-400 dark:text-slate-500 mb-4 border border-gray-100 dark:border-slate-850 shadow-sm">
                <Inbox className="size-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-slate-200">
                {title}
            </h3>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
                {description}
            </p>
            {onReset && (
                <Button 
                    onClick={onReset} 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 border-gray-200 dark:border-slate-800 hover:bg-gray-55 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-350 text-xs px-4"
                >
                    Clear Filters
                </Button>
            )}
        </div>
    )
}

export default NoRecords
