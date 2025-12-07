"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { createProfile, CreateProfilePayload } from "../redux/slices/ProfileSlice";
import toast from "react-hot-toast";

// FormInput component moved outside to prevent re-creation on every render
function FormInput({
    label,
    placeholder,
    field,
    required = false,
    value,
    onChange,
    disabled
}: {
    label: string;
    placeholder: string;
    field: keyof CreateProfilePayload;
    required?: boolean;
    value: string;
    onChange: (field: keyof CreateProfilePayload, value: string) => void;
    disabled: boolean;
}) {
    return (
        <div className="flex flex-col gap-2 text-start">
            <label className="text-foreground text-sm">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="border border-gray-200 h-12 px-5 rounded-full bg-white shadow-neo-light-concave text-foreground outline-none placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    );
}

export function AddRequestModal({
    isOpen,
    onClose,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const { createLoading } = useSelector((state: RootState) => state.profiles);

    const [formData, setFormData] = useState<CreateProfilePayload>({
        name: "",
        email: "",
        currentCompanyName: "",
        city: "",
        country: "",
        industryName: "",
        linkedinProfileLink: ""
    });

    if (!isOpen) return null;

    const handleInputChange = (field: keyof CreateProfilePayload, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            currentCompanyName: "",
            city: "",
            country: "",
            industryName: "",
            linkedinProfileLink: ""
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return;
        }
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return;
        }
        if (!formData.currentCompanyName.trim()) {
            toast.error("Company Name is required");
            return;
        }
        if (!formData.city.trim()) {
            toast.error("City is required");
            return;
        }
        if (!formData.industryName.trim()) {
            toast.error("Industry Name is required");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            await dispatch(createProfile(formData)).unwrap();
            toast.success("Profile created successfully!");
            resetForm();
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            // Error toast is already handled by the API interceptor
            console.error("Failed to create profile:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={createLoading ? undefined : onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Add New Search Request
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={createLoading}
                        className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <FormInput
                        label="Name of Person"
                        placeholder="e.g., John Doe"
                        field="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={createLoading}
                    />
                    <FormInput
                        label="Company Name"
                        placeholder="e.g., Innovate Inc."
                        field="currentCompanyName"
                        required
                        value={formData.currentCompanyName}
                        onChange={handleInputChange}
                        disabled={createLoading}
                    />
                    <FormInput
                        label="Email"
                        placeholder="e.g., abc@gmail.com"
                        field="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={createLoading}
                    />
                    <FormInput
                        label="Industry Name"
                        placeholder="e.g., Tech"
                        field="industryName"
                        required
                        value={formData.industryName}
                        onChange={handleInputChange}
                        disabled={createLoading}
                    />
                    <FormInput
                        label="City"
                        placeholder="e.g., San Francisco"
                        field="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={createLoading}
                    />
                    <FormInput
                        label="Country (Optional)"
                        placeholder="e.g., USA"
                        field="country"
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        disabled={createLoading}
                    />
                    <FormInput
                        label="LinkedIn URL (Optional)"
                        placeholder="https://linkedin.com/in/..."
                        field="linkedinProfileLink"
                        value={formData.linkedinProfileLink || ""}
                        onChange={handleInputChange}
                        disabled={createLoading}
                    />

                    <div className="lg:col-span-3 flex gap-4 justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={createLoading}
                            className="h-12 px-8 rounded-full border border-gray-300 text-foreground font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createLoading}
                            className="h-12 px-8 bg-[#1B7FE6] text-white rounded-full font-semibold shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {createLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Submitting...
                                </>
                            ) : (
                                "Submit Request"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}