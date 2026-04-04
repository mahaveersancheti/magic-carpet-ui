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
            className="p-2 rounded-lg border border-gray-100 text-[#606e8a] hover:text-blue-600 hover:bg-gray-50 transition-all cursor-pointer"
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
          className="bg-[#0d59f2] text-white px-3 lg:px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-[#0d59f2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        {isDataLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your profile...</p>
          </div>
        ) : (
          <div className="bg-white p-5 lg:p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300">
            <div className="space-y-6">
              <h2 className="text-base font-bold mb-5 border-b border-gray-50 pb-3">
                Personal Information
              </h2>

              {/* Name */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => {
                    setEditForm({ ...editForm, name: e.target.value });
                    if (formErrors.name)
                      setFormErrors({ ...formErrors, name: undefined });
                  }}
                  className={`w-full px-3 py-2 rounded-lg border ${formErrors.name ? "border-red-500" : "border-gray-200"} focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white`}
                  placeholder="Enter your name"
                />
                {formErrors.name && (
                  <span className="text-red-500 text-[10px] font-bold">
                    {formErrors.name}
                  </span>
                )}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Designation */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                    Designation
                  </span>
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(e) =>
                      setEditForm({ ...editForm, designation: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white"
                    placeholder="e.g. Senior Manager"
                  />
                </label>

                {/* Company Name */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                    Company Name
                  </span>
                  <input
                    type="text"
                    value={editForm.companyName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, companyName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white"
                    placeholder="e.g. Acme Corp"
                  />
                </label>
              </div>

              {/* Phone */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                  Phone Number
                </span>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => {
                    setEditForm({ ...editForm, phone: e.target.value });
                    if (formErrors.phone)
                      setFormErrors({ ...formErrors, phone: undefined });
                  }}
                  className={`w-full px-3 py-2 rounded-lg border ${formErrors.phone ? "border-red-500" : "border-gray-200"} focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white`}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && (
                  <span className="text-red-500 text-[10px] font-bold">
                    {formErrors.phone}
                  </span>
                )}
              </label>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <h3 className="text-[10px] font-bold text-[#606e8a] uppercase tracking-wider mb-4">
                  Account Details
                </h3>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                    Email Address
                  </span>
                  <div className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed text-sm lg:text-[13px]">
                    {user?.email || "N/A"}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 italic font-medium">
                    * Email cannot be changed here.
                  </p>
                </label>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <h3 className="text-[10px] font-bold text-[#606e8a] uppercase tracking-wider mb-4">
                  Social & Web Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LinkedIn */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                      LinkedIn URL
                    </span>
                    <input
                      type="url"
                      value={editForm.linkedinUrl}
                      onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </label>

                  {/* Twitter */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                      Twitter URL
                    </span>
                    <input
                      type="url"
                      value={editForm.twitterUrl}
                      onChange={(e) => setEditForm({ ...editForm, twitterUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white"
                      placeholder="https://twitter.com/username"
                    />
                  </label>

                  {/* WhatsApp */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                      WhatsApp URL
                    </span>
                    <input
                      type="url"
                      value={editForm.personalUrl}
                      onChange={(e) => setEditForm({ ...editForm, personalUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white"
                      placeholder="https://wa.me/phonenumber"
                    />
                  </label>

                  {/* Slack */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                      Slack URL
                    </span>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white"
                      placeholder="https://your-workspace.slack.com"
                    />
                  </label>

                  {/* Facebook */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                      Facebook URL
                    </span>
                    <input
                      type="url"
                      value={editForm.facebookUrl}
                      onChange={(e) => setEditForm({ ...editForm, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white"
                      placeholder="https://facebook.com/username"
                    />
                  </label>

                  {/* Instagram */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                      Instagram URL
                    </span>
                    <input
                      type="url"
                      value={editForm.instagramUrl}
                      onChange={(e) => setEditForm({ ...editForm, instagramUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all outline-none text-sm lg:text-[13px] bg-white"
                      placeholder="https://instagram.com/username"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleBack}
                className="px-4 py-1.5 rounded-lg border border-gray-300 font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="bg-[#0d59f2] text-white px-3 lg:px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-[#0d59f2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdating && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
