"use client";
import { useState, useRef, useEffect } from "react";

export interface DropdownOption {
    id: string;
    name: string;
    description?: string;
}

interface MultiSelectDropdownProps {
    label: string;
    options: DropdownOption[];
    selected: DropdownOption[];
    onChange: (selected: DropdownOption[]) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

export function MultiSelectDropdown({
    label,
    options,
    selected,
    onChange,
    placeholder = "Select...",
    required = false,
    disabled = false,
    error
}: MultiSelectDropdownProps) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(
        option =>
            !selected.find(s => s.id === option.id) &&
            option.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (option: DropdownOption) => {
        onChange([...selected, option]);
        setSearch("");
    };

    const handleRemove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening dropdown when removing
        onChange(selected.filter(item => item.id !== id));
    };

    return (
        <div className="flex flex-col gap-1.5 text-start relative" ref={containerRef}>
            {label && (
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div
                className={`min-h-[2.75rem] px-3.5 py-1.5 rounded-xl bg-gray-50 border transition-all cursor-text flex flex-wrap gap-2 items-center ${isOpen ? "border-blue-500 ring-4 ring-blue-50 bg-white" : "border-gray-200"
                    } ${error ? "border-red-500" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !disabled && setIsOpen(true)}
            >
                {selected.map(item => (
                    <span
                        key={item.id}
                        className="bg-blue-600 text-white text-[10px] font-black pl-2.5 pr-0.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm transition-transform active:scale-95 uppercase tracking-tighter"
                    >
                        {item.name}
                        <button
                            type="button"
                            onClick={(e) => handleRemove(item.id, e)}
                            disabled={disabled}
                            className="p-1 hover:bg-white/20 rounded-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                    </span>
                ))}

                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                    placeholder={selected.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
            </div>

            {error && <span className="text-red-500 text-[9px] font-black px-1 uppercase tracking-tighter">{error}</span>}

            {isOpen && !disabled && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[60] max-h-64 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <button
                                key={option.id}
                                type="button"
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex flex-col gap-0.5 transition-colors group"
                                onClick={() => handleSelect(option)}
                            >
                                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{option.name}</div>
                                {option.description && (
                                    <div className="text-xs text-gray-400 truncate group-hover:text-gray-500">{option.description}</div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center bg-gray-50 rounded-xl">
                            <p className="text-sm font-bold text-gray-400">
                                {search ? "No matches found" : "All items selected"}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
