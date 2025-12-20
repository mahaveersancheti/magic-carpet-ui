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
        <div className="flex flex-col gap-1.5 text-start">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`h-11 px-4 rounded-xl bg-gray-50 border transition-all text-gray-900 text-sm outline-none placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 ${error ? "border-red-500" : "border-gray-200"
                    }`}
            />
            {error && <span className="text-red-500 text-[9px] font-black px-1 uppercase tracking-tighter">{error}</span>}
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

    const [errors, setErrors] = useState<Partial<Record<keyof CreateProfilePayload | 'products', string>>>({});

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

        const newErrors: Partial<Record<keyof CreateProfilePayload | 'products', string>> = {};

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

        // Validate products
        if (selectedProducts.length === 0) {
            newErrors.products = "At least one product must be selected";
        }

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
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl bg-white border border-gray-100 transition-all duration-300">
                <div className="p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                New Search Request
                            </h2>
                            <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-widest">Strategic Intelligence Gathering</p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={createLoading}
                            className="w-12 h-12 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-all disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
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

                        <MultiSelectDropdown
                            label="Target Products"
                            required
                            options={products}
                            selected={selectedProducts}
                            onChange={(selected) => {
                                setSelectedProducts(selected as Product[]);
                                if (errors.products) {
                                    setErrors(prev => ({ ...prev, products: undefined }));
                                }
                            }}
                            placeholder="Select products..."
                            disabled={createLoading}
                            error={errors.products}
                        />

                        <div className="lg:col-span-3 flex gap-4 justify-end mt-10">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={createLoading}
                                className="h-12 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createLoading}
                                className="h-12 px-8 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 text-sm"
                            >
                                {createLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}