import React from 'react'

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

export const StatusBadge = ({ status, size = 'md', className = '' }) => {
    if (!status) return null;
    const classes = getStatusClasses(status);
    const sizeClasses = size === 'sm' 
        ? 'gap-1 px-2 py-0.5 text-[10px]' 
        : 'gap-1.5 px-3 py-1 text-xs';
    
    const dotSizeClasses = size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5';

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${classes.badge} ${className}`}>
            <span className={`rounded-full ${dotSizeClasses} ${classes.dot}`} />
            {status}
        </span>
    );
};

export default StatusBadge;
