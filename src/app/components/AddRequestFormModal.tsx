"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { createProfile, CreateProfilePayload } from "../redux/slices/ProfileSlice";
import { fetchProductsByUserId, Product } from "../redux/slices/ProductSlice";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

// FormInput component moved outside to prevent re-creation on every render
function FormInput({
    label,
    placeholder,
    field,
    required = false,
    value,
    onChange,
    disabled,
    error
}: {
    label: string;
    placeholder: string;
    field: keyof CreateProfilePayload;
    required?: boolean;
    value: string;
    onChange: (field: keyof CreateProfilePayload, value: string) => void;
    disabled: boolean;
    error?: string;
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
                className={`border h-12 px-5 rounded-full bg-white shadow-neo-light-concave text-foreground outline-none placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-red-500" : "border-gray-200"
                    }`}
            />
            {error && <span className="text-red-500 text-xs px-2">{error}</span>}
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
    const { products } = useSelector((state: RootState) => state.products);
    const { user } = useUser();

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchProductsByUserId(user.userId));
        }
    }, [dispatch, user?.userId]);

    const [formData, setFormData] = useState<CreateProfilePayload>({
        name: "",
        email: "",
        currentCompanyName: "",
        city: "",
        country: "",
        industryName: "",
        linkedinProfileLink: ""
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CreateProfilePayload, string>>>({});

    if (!isOpen) return null;

    const handleInputChange = (field: keyof CreateProfilePayload, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
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
        setSelectedProducts([]);
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Partial<Record<keyof CreateProfilePayload, string>> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.currentCompanyName.trim()) newErrors.currentCompanyName = "Company Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.industryName.trim()) newErrors.industryName = "Industry Name is required";
        if (!formData.city.trim()) newErrors.city = "City is required";

        // New mandatory fields
        if (!(formData.country || "").trim()) newErrors.country = "Country is required";
        if (!(formData.linkedinProfileLink || "").trim()) newErrors.linkedinProfileLink = "LinkedIn Profile is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const payload = {
                ...formData,
                // productIds: selectedProducts.map(p => p.id)
                productId: selectedProducts.map(p => p.id)[0]
            };
            await dispatch(createProfile(payload)).unwrap();
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
                        error={errors.name}
                    />
                    <FormInput
                        label="Company Name"
                        placeholder="e.g., Innovate Inc."
                        field="currentCompanyName"
                        required
                        value={formData.currentCompanyName}
                        onChange={handleInputChange}
                        disabled={createLoading}
                        error={errors.currentCompanyName}
                    />
                    <FormInput
                        label="Email"
                        placeholder="e.g., abc@gmail.com"
                        field="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={createLoading}
                        error={errors.email}
                    />
                    <FormInput
                        label="Industry Name"
                        placeholder="e.g., Tech"
                        field="industryName"
                        required
                        value={formData.industryName}
                        onChange={handleInputChange}
                        disabled={createLoading}
                        error={errors.industryName}
                    />
                    <FormInput
                        label="City"
                        placeholder="e.g., San Francisco"
                        field="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={createLoading}
                        error={errors.city}
                    />
                    <FormInput
                        label="Country"
                        placeholder="e.g., USA"
                        field="country"
                        required
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        disabled={createLoading}
                        error={errors.country}
                    />
                    <FormInput
                        label="LinkedIn URL"
                        placeholder="https://linkedin.com/in/..."
                        field="linkedinProfileLink"
                        required
                        value={formData.linkedinProfileLink || ""}
                        onChange={handleInputChange}
                        disabled={createLoading}
                        error={errors.linkedinProfileLink}
                    />

                    {/* Product Selection - Now fits in grid naturally */}
                    <MultiSelectDropdown
                        label="Products"
                        options={products}
                        selected={selectedProducts}
                        onChange={(selected) => setSelectedProducts(selected as Product[])}
                        placeholder="Select products..."
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