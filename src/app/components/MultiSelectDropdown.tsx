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
        <div className="flex flex-col gap-2 text-start relative" ref={containerRef}>
            <label className="text-foreground text-sm">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div
                className={`min-h-[3rem] px-2 py-1.5 rounded-2xl bg-white shadow-neo-light-concave text-foreground border transition-colors cursor-text flex flex-wrap gap-2 items-center ${error ? "border-red-500" : "border-gray-200"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !disabled && setIsOpen(true)}
            >
                {selected.map(item => (
                    <span
                        key={item.id}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    >
                        {item.name}
                        <button
                            type="button"
                            onClick={(e) => handleRemove(item.id, e)}
                            disabled={disabled}
                            className="hover:text-blue-900 font-bold px-0.5 rounded-full"
                        >
                            ×
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
                    className="flex-1 min-w-[60px] bg-transparent outline-none text-sm h-6 px-1"
                />
            </div>

            {error && <span className="text-red-500 text-xs px-2">{error}</span>}

            {isOpen && !disabled && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <button
                                key={option.id}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex flex-col gap-0.5 border-b border-gray-50 last:border-0"
                                onClick={() => handleSelect(option)}
                            >
                                <div className="font-medium text-foreground">{option.name}</div>
                                {option.description && (
                                    <div className="text-xs text-gray-500 truncate">{option.description}</div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                            {search ? "No matches found" : "No more options"}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
