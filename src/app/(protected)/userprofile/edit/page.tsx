"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  User,
  Briefcase,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "../../../hooks/useUser";
import { api } from "../../../services/apiService";
import { endpoints } from "../../../lib/endpoints";

export default function EditProfile() {
  const router = useRouter();
  const { user } = useUser();
  const [editForm, setEditForm] = useState({
    name: "",
    designation: "",
    companyName: "",
    phone: "",
    email: "",
    linkedinUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    personalUrl: "",
    website: "",
  });
  const [fullUserData, setFullUserData] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.userId) return;

      setIsDataLoading(true);
      try {
        const userData: any = await api.get(endpoints.updateUser(user.userId));
        if (userData) {
          setFullUserData(userData);
          setEditForm({
            name: userData.name || "",
            designation: userData.designation || "",
            companyName: userData.companyName || "",
            phone: userData.phone || "",
            email: userData.email || "",
            linkedinUrl: userData.linkedinUrl || "",
            twitterUrl: userData.twitterUrl || "",
            facebookUrl: userData.facebookUrl || "",
            instagramUrl: userData.instagramUrl || "",
            personalUrl: userData.personalUrl || "",
            website: userData.website || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Fallback to token data if API fails
        setEditForm({
          name: user.name || "",
          designation: user.designation || "",
          companyName: user.companyName || "",
          phone: user.phone || "",
          email: user.email || "",
          linkedinUrl: "",
          twitterUrl: "",
          facebookUrl: "",
          instagramUrl: "",
          personalUrl: "",
          website: "",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const validateForm = (): boolean => {
    const errors: { name?: string; phone?: string } = {};

    // Name validation
    if (!editForm.name.trim()) {
      errors.name = "Name is required";
    } else if (editForm.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Phone validation (basic check for digits and length)
    if (editForm.phone.trim()) {
      const phoneRegex = /^\+?[\d\s-]{10,15}$/;
      if (!phoneRegex.test(editForm.phone.trim().replace(/[\s-]/g, ""))) {
        errors.phone = "Please enter a valid phone number (at least 10 digits)";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm() || !user?.userId) {
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(endpoints.updateUser(user.userId), {
        ...fullUserData, // Include all existing fields
        id: user.userId,
        name: editForm.name,
        designation: editForm.designation,
        companyName: editForm.companyName,
        phone: editForm.phone,
        email: editForm.email,
        linkedinUrl: editForm.linkedinUrl,
        twitterUrl: editForm.twitterUrl,
        facebookUrl: editForm.facebookUrl,
        instagramUrl: editForm.instagramUrl,
        personalUrl: editForm.personalUrl,
        website: editForm.website,
        active: true, // Explicitly set active to true as requested
      });

      toast.success("Profile updated successfully!");

      // Navigate back to profile page
      setTimeout(() => {
        router.push("/userprofile");
        // Reload to refresh token data
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 pt-20 lg:pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-[#111318]">
              Edit Profile
            </h1>
            <p className="text-[#606e8a] text-xs lg:text-sm text-gray-500">
              Update your personal information
            </p>
          </div>
        </div>
        <button
          onClick={handleUpdateProfile}
          disabled={isUpdating}
          className="bg-[#0d59f2] text-white px-3 lg:px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#0d59f2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </header>

      <main className="max-w-[1920px] mx-auto px-6 mt-8 w-full">
        {isDataLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your profile...</p>
          </div>
        ) : (
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 w-full mb-10">
            <div className="space-y-10">
              {/* Section 1: Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <h2 className="text-lg font-black text-slate-900 mb-2">Personal Information</h2>
                  <p className="text-sm text-slate-500 font-medium">Your basic account details and identity on the platform.</p>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Full Name <span className="text-red-500">*</span>
                    </span>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => {
                          setEditForm({ ...editForm, name: e.target.value });
                          if (formErrors.name)
                            setFormErrors({ ...formErrors, name: undefined });
                        }}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${formErrors.name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50/30"} focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700`}
                        placeholder="Vijay Harde"
                      />
                    </div>
                    {formErrors.name && (
                      <span className="text-red-500 text-[10px] font-bold">
                        {formErrors.name}
                      </span>
                    )}
                  </label>

                  {/* Designation */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Designation
                    </span>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={editForm.designation}
                        onChange={(e) =>
                          setEditForm({ ...editForm, designation: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700"
                        placeholder="e.g. SDE"
                      />
                    </div>
                  </label>

                  {/* Company Name */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Company Name
                    </span>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={editForm.companyName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, companyName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700"
                        placeholder="e.g. M&M"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2: Contact Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-slate-100">
                <div className="lg:col-span-4">
                  <h2 className="text-lg font-black text-slate-900 mb-2">Communication</h2>
                  <p className="text-sm text-slate-500 font-medium">How other members and the system can reach you.</p>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Phone Number
                    </span>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => {
                          setEditForm({ ...editForm, phone: e.target.value });
                          if (formErrors.phone)
                            setFormErrors({ ...formErrors, phone: undefined });
                        }}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${formErrors.phone ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50/30"} focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700`}
                        placeholder="9659361010"
                      />
                    </div>
                    {formErrors.phone && (
                      <span className="text-red-500 text-[10px] font-bold">
                        {formErrors.phone}
                      </span>
                    )}
                  </label>

                  {/* Email */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Email Address
                    </span>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed text-sm font-bold">
                        {user?.email || "N/A"}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-300 italic font-bold uppercase tracking-tight">
                      * Email cannot be changed
                    </p>
                  </label>
                </div>
              </div>

              {/* Section 3: Social Links */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-slate-100">
                <div className="lg:col-span-4">
                  <h2 className="text-lg font-black text-slate-900 mb-2">Social Presence</h2>
                  <p className="text-sm text-slate-500 font-medium">Link your professional profiles to increase visibility.</p>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LinkedIn */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      LinkedIn Profile
                    </span>
                    <input
                      type="url"
                      value={editForm.linkedinUrl}
                      onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </label>

                  {/* Twitter */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Twitter Profile
                    </span>
                    <input
                      type="url"
                      value={editForm.twitterUrl}
                      onChange={(e) => setEditForm({ ...editForm, twitterUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700"
                      placeholder="https://twitter.com/..."
                    />
                  </label>

                  {/* WhatsApp */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      WhatsApp Link
                    </span>
                    <input
                      type="url"
                      value={editForm.personalUrl}
                      onChange={(e) => setEditForm({ ...editForm, personalUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700"
                      placeholder="https://wa.me/..."
                    />
                  </label>

                  {/* Slack */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Slack Workspace
                    </span>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700"
                      placeholder="https://slack.com/..."
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
