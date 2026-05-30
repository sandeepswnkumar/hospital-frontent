// Pure JS date formatter to avoid date-fns dependency issues
export const formatDate = (value) => {
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
export const getColWidthClass = (columnId) => {
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

export const getAvatarBg = (name) => {
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

export const getSubtext = (rowOriginal) => {
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


export const formatSl = (val) => {
    const num = Number(val);
    if (!isNaN(num)) {
        return num < 10 ? `0${num}` : String(num);
    }
    return String(val);
};
