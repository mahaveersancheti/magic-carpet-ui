"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { createProfile, CreateProfilePayload, fetchProfileById, fetchProfiles, updateProfile } from "../../redux/slices/ProfileSlice";
import { fetchProductsByUserId, Product } from "../../redux/slices/ProductSlice";
import { useUser } from "../../hooks/useUser";
import toast from "react-hot-toast";
import { ArrowLeft, Instagram, Twitter, Linkedin, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";

export default function AddLeadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const dispatch = useDispatch<AppDispatch>();
    const { profiles, selectedProfile, createLoading, updateLoading } = useSelector((state: RootState) => state.profiles);
    const { products } = useSelector((state: RootState) => state.products);
    const { user } = useUser();

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    
    // Autocomplete State
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dummyHistoryPushed = useRef(false);

    const [formData, setFormData] = useState<CreateProfilePayload>({
        name: "",
        email: "",
        currentCompanyName: "",
        city: "",
        country: "",
        industryName: "",
        linkedinProfileLink: "",
        instagramProfileLink: "",
        twitterProfileLink: "",
        personalWebsiteLink: ""
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CreateProfilePayload | 'products', string>>>({});

    const [initialFormData, setInitialFormData] = useState<CreateProfilePayload | null>(null);
    const [initialProducts, setInitialProducts] = useState<Product[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchProductsByUserId(user.userId));
        }
    }, [dispatch, user?.userId]);

    useEffect(() => {
        if (id) {
            dispatch(fetchProfiles());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (id && profiles.length > 0 && !initialFormData) {
            const profile = profiles.find(p => p.id === id) as any;
            console.log("Found profile:", profile);
            if (profile) {
                setFormData({
                    name: profile.name || "",
                    email: profile.email || "",
                    currentCompanyName: profile.currentCompanyName || "",
                    city: profile.city || (profile.location?.split(',')[0]?.trim() || ""),
                    country: profile.country || (profile.location?.split(',')[1]?.trim() || ""),
                    industryName: profile.industryType || (profile.industryOutlook?.[0]?.industry || ""),
                    linkedinProfileLink: profile.linkedinUrl || "",
                    instagramProfileLink: profile.instagramProfileLink || "",
                    twitterProfileLink: profile.twitterProfileLink || "",
                    personalWebsiteLink: profile.personalWebsiteLink || ""
                });
                
                // Bind products if they exist in the profile
                let matchedProducts: Product[] = [];
                if (profile.productFit && products.length > 0) {
                    console.log("Binding products. Profile Fit:", profile.productFit, "Available Products:", products);
                    matchedProducts = products.filter(p => 
                        profile.productFit?.some((pf: any) => pf.productName === p.name)
                    );
                    setSelectedProducts(matchedProducts);
                }

                const initialData = {
                    name: profile.name || "",
                    email: profile.email || "",
                    currentCompanyName: profile.currentCompanyName || "",
                    city: profile.city || (profile.location?.split(',')[0]?.trim() || ""),
                    country: profile.country || (profile.location?.split(',')[1]?.trim() || ""),
                    industryName: profile.industryType || (profile.industryOutlook?.[0]?.industry || ""),
                    linkedinProfileLink: profile.linkedinUrl || "",
                    instagramProfileLink: profile.instagramProfileLink || "",
                    twitterProfileLink: profile.twitterProfileLink || "",
                    personalWebsiteLink: profile.personalWebsiteLink || ""
                };
                setInitialFormData(initialData);
                setInitialProducts(matchedProducts);
            }
        }
    }, [id, profiles, products]);

    const isDirty = initialFormData ? (
        formData.name !== initialFormData.name ||
        formData.email !== initialFormData.email ||
        formData.currentCompanyName !== initialFormData.currentCompanyName ||
        formData.city !== initialFormData.city ||
        formData.country !== initialFormData.country ||
        formData.industryName !== initialFormData.industryName ||
        formData.linkedinProfileLink !== initialFormData.linkedinProfileLink ||
        formData.instagramProfileLink !== initialFormData.instagramProfileLink ||
        formData.twitterProfileLink !== initialFormData.twitterProfileLink ||
        formData.personalWebsiteLink !== initialFormData.personalWebsiteLink ||
        selectedProducts.length !== initialProducts.length ||
        selectedProducts.some(p => !initialProducts.some(ip => ip.id === p.id))
    ) : (
        formData.name !== "" ||
        formData.email !== "" ||
        formData.currentCompanyName !== "" ||
        formData.city !== "" ||
        formData.country !== "" ||
        formData.industryName !== "" ||
        formData.linkedinProfileLink !== "" ||
        formData.instagramProfileLink !== "" ||
        formData.twitterProfileLink !== "" ||
        formData.personalWebsiteLink !== "" ||
        selectedProducts.length !== 0
    );

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty && !isSubmitting) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        const handlePopState = (e: PopStateEvent) => {
            if (isDirty && !isSubmitting) {
                // Prevent immediate navigation by pushing the current URL back onto the stack
                window.history.pushState(null, "", window.location.href);
                setIsConfirmDialogOpen(true);
            }
        };

        // Push an initial dummy state when form becomes dirty to enable interception
        if (isDirty && !isSubmitting && !dummyHistoryPushed.current) {
            window.history.pushState(null, "", window.location.href);
            dummyHistoryPushed.current = true;
        } else if (!isDirty && dummyHistoryPushed.current) {
            // If they undo changes, we should ideally go back to remove the dummy state
            // but that's complex and might navigate away if not careful.
            // Keeping it simple for now.
        }

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);
        
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isDirty, isSubmitting]);

    const handleBack = () => {
        if (isDirty) {
            setIsConfirmDialogOpen(true);
        } else {
            router.push("/home");
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            linkedinProfileLink: "",
            instagramProfileLink: "",
            twitterProfileLink: "",
            personalWebsiteLink: ""
        });
        setSelectedProducts([]);
        setErrors({});
        setSearchTerm("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Partial<Record<keyof CreateProfilePayload | 'products', string>> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.currentCompanyName.trim()) newErrors.currentCompanyName = "Company Name is required";
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.industryName.trim()) newErrors.industryName = "Industry Name is required";
        
        if (formData.linkedinProfileLink?.trim()) {
            const linkedinUrl = formData.linkedinProfileLink.trim();
            const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|profile)\/[a-zA-Z0-9_-]+\/?$/i;
            
            if (!linkedinRegex.test(linkedinUrl)) {
                newErrors.linkedinProfileLink = "Please enter a valid LinkedIn profile URL";
            }
        }

        if (formData.instagramProfileLink?.trim()) {
            const instagramUrl = formData.instagramProfileLink.trim();
            const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/i;

            if (!instagramRegex.test(instagramUrl)) {
                newErrors.instagramProfileLink = "Please enter a valid Instagram profile URL";
            }
        }

        if (formData.twitterProfileLink?.trim()) {
            const twitterUrl = formData.twitterProfileLink.trim();
            const twitterRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/i;

            if (!twitterRegex.test(twitterUrl)) {
                newErrors.twitterProfileLink = "Please enter a valid Twitter (X) profile URL";
            }
        }

        if (formData.personalWebsiteLink?.trim()) {
            const websiteUrl = formData.personalWebsiteLink.trim();
            // Basic URL validation
            const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

            if (!urlRegex.test(websiteUrl)) {
                newErrors.personalWebsiteLink = "Please enter a valid Website URL";
            }
        }

        if (selectedProducts.length === 0) {
            newErrors.products = "At least one product must be selected";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                ...formData,
                productIds: selectedProducts.map(p => p.id)
            };
            console.log("payload",payload);
            if (id) {
                // Update existing profile
                await dispatch(updateProfile({ id: id as string, payload })).unwrap();
                toast.success("Profile updated successfully!");
            } else {
                // Create new profile
                await dispatch(createProfile(payload)).unwrap();
                toast.success("Profile created successfully!");
            }
            
            resetForm();
            router.push('/home');
        } catch (error: any) {
            console.error(`Failed to ${id ? 'update' : 'create'} profile:`, error);
            toast.error(error.message || `Failed to ${id ? 'update' : 'create'} profile`);
            setIsSubmitting(false);
        }
    };

    // Keyboard shortcut for save
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSubmit(e as any);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [formData, selectedProducts]);


    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedProducts.some(p => p.id === product.id)
    );

    const toggleProductSelection = (product: Product) => {
        if (selectedProducts.some(p => p.id === product.id)) {
            setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts(prev => [...prev, product]);
            setSearchTerm(""); // Clear search after selection
        }
        if (errors.products) {
            setErrors(prev => ({ ...prev, products: undefined }));
        }
    };

    return (
        <main className="max-w-[1280px] mx-auto px-6 py-8 bg-background-light dark:bg-background-dark min-h-screen">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-3 text-[10px] lg:text-xs font-medium text-[#606e8a] dark:text-gray-400">
                <button onClick={handleBack} className="hover:text-primary transition-colors">
                    Leads
                </button>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-[#111318] dark:text-white">{id ? "Edit Lead" : "New Lead Registration"}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 border-b border-gray-100 dark:border-white/5 pb-5">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="p-2 rounded-lg border border-gray-100 dark:border-white/10 text-[#606e8a] dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-lg lg:text-xl font-bold tracking-tight text-[#111318] dark:text-white">{id ? "Edit Lead" : "Add New Lead"}</h1>
                        <p className="text-[#606e8a] dark:text-gray-400 text-xs lg:text-sm">{id ? "Update professional details and company information for this lead." : "Enter professional details and company information to expand your pipeline."}</p>
                    </div>
                </div>
                    {/* <button
                        onClick={() => router.push('/home')}
                        disabled={createLoading || updateLoading}
                        className="px-4 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        Discard Draft
                    </button> */}
                    <button
                        onClick={handleSubmit}
                        disabled={createLoading || updateLoading}
                        className="flex-1 sm:flex-initial bg-[#0d59f2] text-white px-3 lg:px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-[#0d59f2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2"
                    >
                        {(createLoading || updateLoading) ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {id ? "Updating..." : "Saving..."}
                            </>
                        ) : (
                            id ? "Update Lead" : "Save Lead"
                        )}
                    </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-5 lg:p-6">
                        <div className="flex items-center gap-2 mb-5 border-b border-gray-50 dark:border-white/5 pb-3">
                            <span className="material-symbols-outlined text-primary text-xl">contact_page</span>
                            <h3 className="text-base font-bold">Lead Details</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Name */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">
                                    Name of Person <span className="text-red-500">*</span>
                                </span>
                                <input
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    disabled={createLoading || updateLoading}
                                    className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]`}
                                    placeholder="Full name"
                                    type="text"
                                />
                                {errors.name && <span className="text-red-500 text-[10px]">{errors.name}</span>}
                            </label>

                            {/* Email */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">Email Address</span>
                                <input
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    disabled={createLoading || updateLoading}
                                    className={`w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]`}
                                    placeholder="work@email.com"
                                    type="email"
                                />
                                {errors.email && <span className="text-red-500 text-[10px]">{errors.email}</span>}
                            </label>

                            {/* Company */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">
                                    Company Name <span className="text-red-500">*</span>
                                </span>
                                <input
                                    value={formData.currentCompanyName}
                                    onChange={(e) => handleInputChange("currentCompanyName", e.target.value)}
                                    disabled={createLoading || updateLoading}
                                    className={`w-full px-3 py-2 rounded-lg border ${errors.currentCompanyName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]`}
                                    placeholder="Organization name"
                                    type="text"
                                />
                                {errors.currentCompanyName && <span className="text-red-500 text-[10px]">{errors.currentCompanyName}</span>}
                            </label>

                            {/* Industry */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">
                                    Industry Name <span className="text-red-500">*</span>
                                </span>
                                <input
                                    value={formData.industryName}
                                    onChange={(e) => handleInputChange("industryName", e.target.value)}
                                    disabled={createLoading || updateLoading}
                                    className={`w-full px-3 py-2 rounded-lg border ${errors.industryName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]`}
                                    placeholder="e.g., Technology"
                                    type="text"
                                />
                                {errors.industryName && <span className="text-red-500 text-[10px]">{errors.industryName}</span>}
                            </label>

                            {/* City */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">City</span>
                                <input
                                    value={formData.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    disabled={createLoading || updateLoading}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]"
                                    placeholder="e.g. San Francisco"
                                    type="text"
                                />
                            </label>

                            {/* Country */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">Country</span>
                                <input
                                    value={formData.country || ""}
                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                    disabled={createLoading || updateLoading}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]"
                                    placeholder="e.g. United States"
                                    type="text"
                                />
                            </label>

                            {/* LinkedIn */}
                            <label className="flex flex-col gap-1.5 md:col-span-2">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">
                                    LinkedIn URL
                                </span>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                                    <input
                                        value={formData.linkedinProfileLink || ""}
                                        onChange={(e) => handleInputChange("linkedinProfileLink", e.target.value)}
                                        disabled={createLoading || updateLoading}
                                        className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.linkedinProfileLink ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]`}
                                        placeholder="linkedin.com/in/username"
                                        type="url"
                                    />
                                </div>
                                {errors.linkedinProfileLink && <span className="text-red-500 text-[10px]">{errors.linkedinProfileLink}</span>}
                            </label>

                            {/* Instagram */}
                            <label className="flex flex-col gap-1.5 md:col-span-1">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">Instagram</span>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                                    <input
                                        value={formData.instagramProfileLink || ""}
                                        onChange={(e) => handleInputChange("instagramProfileLink", e.target.value)}
                                        disabled={createLoading || updateLoading}
                                        className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.instagramProfileLink ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]`}
                                        placeholder="instagram.com/username"
                                        type="url"
                                    />
                                </div>
                                {errors.instagramProfileLink && <span className="text-red-500 text-[10px]">{errors.instagramProfileLink}</span>}
                            </label>

                            {/* Twitter */}
                            <label className="flex flex-col gap-1.5 md:col-span-1">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">Twitter (X)</span>
                                <div className="relative">
                                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                                    <input
                                        value={formData.twitterProfileLink || ""}
                                        onChange={(e) => handleInputChange("twitterProfileLink", e.target.value)}
                                        disabled={createLoading || updateLoading}
                                        className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.twitterProfileLink ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]`}
                                        placeholder="twitter.com/username"
                                        type="url"
                                    />
                                </div>
                                {errors.twitterProfileLink && <span className="text-red-500 text-[10px]">{errors.twitterProfileLink}</span>}
                            </label>

                            {/* Personal Website */}
                            <label className="flex flex-col gap-1.5 md:col-span-2">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">Personal Website</span>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                                    <input
                                        value={formData.personalWebsiteLink || ""}
                                        onChange={(e) => handleInputChange("personalWebsiteLink", e.target.value)}
                                        disabled={createLoading || updateLoading}
                                        className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.personalWebsiteLink ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm lg:text-[13px]`}
                                        placeholder="your-website.com"
                                        type="url"
                                    />
                                </div>
                                {errors.personalWebsiteLink && <span className="text-red-500 text-[10px]">{errors.personalWebsiteLink}</span>}
                            </label>

                            {/* Products Autocomplete */}
                            <div className="flex flex-col gap-1.5 md:col-span-2 z-20">
                                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] dark:text-gray-400 uppercase tracking-wider">
                                    Target Products <span className="text-red-500">*</span>
                                </span>
                                <div className="relative" ref={dropdownRef}>
                                    <div 
                                        className={`w-full px-3 py-2 rounded-lg border ${errors.products ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} dark:bg-background-dark focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all bg-white dark:bg-white/5 min-h-[42px] flex flex-wrap gap-2 items-center cursor-text`}
                                        onClick={() => {
                                            // Focus the input when clicking anywhere in the container
                                            const input = dropdownRef.current?.querySelector('input');
                                            input?.focus();
                                        }}
                                    >
                                        {/* Selected Tags */}
                                        {selectedProducts.map(product => (
                                            <span key={product.id} className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] lg:text-[11px] font-bold flex items-center gap-1 border border-primary/10 h-fit animate-in fade-in zoom-in duration-200">
                                                {product.name}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleProductSelection(product);
                                                    }}
                                                    className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-white/50"
                                                >
                                                   <span className="material-symbols-outlined text-[10px] font-bold block">close</span>
                                                </button>
                                            </span>
                                        ))}
                                        
                                        {/* Search Input */}
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setIsDropdownOpen(true);
                                            }}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            disabled={createLoading || updateLoading}
                                            className="bg-transparent outline-none flex-1 min-w-[120px] text-sm lg:text-[13px] h-6"
                                            placeholder={selectedProducts.length === 0 ? "Search for products..." : ""}
                                        />
                                        
                                        {/* Dropdown Icon */}
                                        <span 
                                            className={`material-symbols-outlined text-gray-400 text-lg transition-transform cursor-pointer ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDropdownOpen(!isDropdownOpen);
                                            }}
                                        >
                                            expand_more
                                        </span>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map(product => (
                                                    <div 
                                                        key={product.id}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault(); // Prevent input blur
                                                            toggleProductSelection(product);
                                                        }}
                                                        className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-sm text-[#111318] dark:text-gray-200 flex items-center justify-between group transition-colors"
                                                    >
                                                        <span>{product.name}</span>
                                                        <span className="material-symbols-outlined text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sm">
                                                            add
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-4 text-center text-xs text-gray-400 italic">
                                                    {products.length === 0 ? "No products available" : "No matching products found"}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.products && <span className="text-red-500 text-[10px]">{errors.products}</span>}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column - Preview & Tips */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Lead Preview Card */}
                    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-5 relative overflow-hidden shadow-sm">
                        <div className="absolute -top-4 -right-4 opacity-5">
                            <span className="material-symbols-outlined text-[100px] text-primary">account_circle</span>
                        </div>
                        <p className="text-[9px] uppercase tracking-widest font-black text-primary mb-5">Real-time Lead Card</p>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-3xl">person</span>
                            </div>
                            <div>
                                <h4 className="text-base font-bold leading-tight text-[#111318] dark:text-white">{formData.name || "Lead Name"}</h4>
                                <p className="text-xs text-gray-500 font-medium">{formData.currentCompanyName || "Organization"}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-white/5">
                                <span className="text-[10px] font-bold text-[#606e8a] uppercase tracking-wider">Industry</span>
                                <span className="text-xs font-bold">{formData.industryName || "—"}</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-white/5">
                                <span className="text-[10px] font-bold text-[#606e8a] uppercase tracking-wider">Location</span>
                                <span className="text-xs font-bold">
                                    {formData.city && formData.country ? `${formData.city}, ${formData.country}` : 
                                     formData.city || formData.country || "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5">
                                <span className="text-[10px] font-bold text-[#606e8a] uppercase tracking-wider">LinkedIn</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black ${
                                    formData.linkedinProfileLink ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                                }`}>
                                    {formData.linkedinProfileLink ? "ADDED" : "PENDING"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Lead Enrichment Tips */}
                    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="material-symbols-outlined text-amber-500 text-lg">auto_awesome</span>
                            <h4 className="font-bold text-sm">Lead Enrichment</h4>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-2.5">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                                <p className="text-xs text-[#606e8a] dark:text-gray-400 leading-relaxed">
                                    Including <span className="font-bold text-[#111318] dark:text-white">Industry Name</span> helps in tailored marketing automation.
                                </p>
                            </li>
                            <li className="flex gap-2.5">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                                <p className="text-xs text-[#606e8a] dark:text-gray-400 leading-relaxed">
                                    <span className="font-bold text-[#111318] dark:text-white">LinkedIn URLs</span> allow for one-click profile viewing from the list view.
                                </p>
                            </li>
                            <li className="flex gap-2.5">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                                <p className="text-xs text-[#606e8a] dark:text-gray-400 leading-relaxed">
                                    Specifying <span className="font-bold text-[#111318] dark:text-white">Target Products</span> improves lead scoring accuracy.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={() => {
                    setIsConfirmDialogOpen(false);
                    router.push("/home");
                }}
                title="Unsaved Changes"
                description="You have unsaved changes. Are you sure you want to leave? Your progress will be lost."
                confirmLabel="Leave Page"
                cancelLabel="Stay"
                variant="info"
            />
        </main>
    );
}
