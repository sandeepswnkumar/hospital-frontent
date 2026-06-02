import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ChevronDown, Check, X } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function SearchableSelect({
    value,
    onChange,
    onSearch,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    initialLabel = "",
    className = "",
    disabled = false,
    debounceTime = 300
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(initialLabel);

    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const searchTimeout = useRef(null);

    // Sync initialLabel when it changes or value changes
    useEffect(() => {
        if (value) {
            setSelectedLabel(initialLabel || `ID: ${value}`);
        } else {
            setSelectedLabel('');
        }
    }, [value, initialLabel]);

    // Handle closing when clicking outside the component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Perform the API search with debouncing
    const performSearch = async (query) => {
        setIsLoading(true);
        try {
            const results = await onSearch(query);
            // Ensure format is Array<{ value: string|number, label: string }>
            if (Array.isArray(results)) {
                setOptions(results);
            } else {
                setOptions([]);
            }
        } catch (error) {
            console.error("SearchableSelect search error:", error);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Load initial list on open
    const handleTriggerClick = () => {
        if (disabled) return;
        const nextState = !isOpen;
        setIsOpen(nextState);
        if (nextState) {
            setSearchQuery('');
            performSearch('');
            // Focus input shortly after render
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    };

    // Debounced query change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            performSearch(query);
        }, debounceTime);
    };

    // Handle option selection
    const handleSelectOption = (option) => {
        onChange(option.value, option);
        setSelectedLabel(option.label);
        setIsOpen(false);
    };

    // Clear selection
    const handleClear = (e) => {
        e.stopPropagation();
        onChange('', null);
        setSelectedLabel('');
    };

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={handleTriggerClick}
                disabled={disabled}
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left",
                    disabled ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900" : "cursor-pointer"
                )}
            >
                <span className={cn("truncate", !selectedLabel && "text-slate-400 dark:text-slate-500")}>
                    {selectedLabel || placeholder}
                </span>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {selectedLabel && !disabled && (
                        <span
                            onClick={handleClear}
                            className="p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
            </button>

            {/* Dropdown Container */}
            {isOpen && (
                <div className="absolute z-50 mt-1.5 w-full min-w-[200px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#191c24] text-slate-950 dark:text-slate-50 shadow-md outline-none animate-in fade-in-0 zoom-in-95 duration-100 origin-top">
                    {/* Search Input wrapper */}
                    <div className="flex items-center border-b border-slate-100 dark:border-slate-800 px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={searchPlaceholder}
                            className="flex h-7 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {isLoading && (
                            <Loader2 className="h-4 w-4 animate-spin shrink-0 text-emerald-600 ml-2" />
                        )}
                    </div>

                    {/* Options list */}
                    <div className="max-h-[220px] overflow-y-auto p-1 space-y-0.5">
                        {isLoading && options.length === 0 ? (
                            <div className="py-6 text-center text-sm text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                                Loading...
                            </div>
                        ) : options.length === 0 ? (
                            <div className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                                No options found.
                            </div>
                        ) : (
                            options.map((option) => {
                                const isSelected = value === option.value;
                                return (
                                    <div
                                        key={option.value}
                                        onClick={() => handleSelectOption(option)}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2.5 py-2 text-sm outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                                            isSelected && "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium"
                                        )}
                                    >
                                        <span className="truncate pr-4">{option.label}</span>
                                        {isSelected && (
                                            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
