"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";

import toast from 'react-hot-toast';
import { useUser } from '../../hooks/useUser';
import {
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Slack,
  MessageCircle,
  Edit2,
  X,
} from "lucide-react";
import { api } from '../../services/apiService';
import { endpoints } from '../../lib/endpoints';

export default function UserProfile() {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useUser();
  const [userData, setUserData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsF819KQIZRWOc4COafT_vJqvIQ5rcdJ_nMnsTyj1BqbAkXU20i4PmkOx2i2pwT3b7ogKzv4W4tCuYok6rOSrDyxRPEpMHWT9aVJUY1FdWhg25NK0wqqpO7hpbAgh6czPzpu50wq_JWIfQvpDrYDoYYbCKJdM0Cq6WBMkWKcoc4qg0cSvgEGD2ZDLR8cjqxgZkcc6Qn3xnja0PJGj7gPMFVUWH1RLu0S6g5CN5NU02RnANCarAaASXlUd6B19ybkl0Ppmg1WnKCsxw",
  });

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    designation: "",
    companyName: "",
  });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || prev.name,
        title: user.designation && user.companyName
          ? `${user.designation} @ ${user.companyName}`
          : user.designation || prev.title,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Get products count for stats
  const { products } = useSelector(
    (state: RootState) => state.products
  );

  // Handle Edit Profile Click
  const handleEditClick = () => {
    setEditForm({
      name: user?.name || "",
      designation: user?.designation || "",
      companyName: user?.companyName || "",
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  // Validate Form
  const validateForm = (): boolean => {
    const errors: { name?: string } = {};

    if (!editForm.name.trim()) {
      errors.name = 'Name is required';
    } else if (editForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Update Profile
  const handleUpdateProfile = async () => {
    // if (!validateForm() || !user?.userId) {
    //   return;
    // }

    // setIsUpdating(true);
    // try {
    //   await api.put(endpoints.updateUser(user.userId), {
    //     name: editForm.name,
    //     designation: editForm.designation,
    //     companyName: editForm.companyName,
    //   });

    //   // Update local userData
    //   setUserData(prev => ({
    //     ...prev,
    //     name: editForm.name,
    //     title: editForm.designation && editForm.companyName
    //       ? `${editForm.designation} @ ${editForm.companyName}`
    //       : editForm.designation || prev.title,
    //   }));

    //   toast.success('Profile updated successfully!');
    //   setShowEditModal(false);
      
    //   // Reload the page to refresh the token with updated user data
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 1000);
    // } catch (error: any) {
    //   toast.error(error.message || 'Failed to update profile');
    // } finally {
    //   setIsUpdating(false);
    // }
  };



  return (
    <div className="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Content Area - Centered */}
          <div className="lg:col-span-12 space-y-4 max-w-3xl mx-auto w-full"> 
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 transition-all duration-200 relative overflow-hidden">
              {/* Subtle background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-blue-50 shadow-md">
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h2 className="font-bold text-2xl text-gray-900 mb-1">
                  {userData.name}
                </h2>
                <p className="text-blue-600 font-bold text-sm mb-4 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {userData.title}
                </p>

                {/* Edit Profile Button */}
                <button
                  onClick={handleEditClick}
                  className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all shadow-sm active:scale-95 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {[
                    { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com" },
                    { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                    { Icon: MessageCircle, label: "WhatsApp", href: "https://whatsapp.com" },
                    { Icon: Slack, label: "Slack", href: "https://slack.com" },
                    { Icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                    { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                  ].map(({ Icon, label, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quick Stats Card */}
                <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-4">
                    Overview
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Products</p>
                    <p className="text-xl font-black text-gray-900">{products.length}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Status</p>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-xs font-bold text-gray-900 tracking-tight">Active</p>
                    </div>
                    </div>
                </div>
                </div>

                {/* Contact Info Card */}
                <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-4">
                    Contact Information
                </h3>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors group">
                    <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-blue-600 group-hover:scale-110 transition-transform">
                        <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Email</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                        {userData.email}
                        </p>
                    </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors group">
                    <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-blue-600 group-hover:scale-110 transition-transform">
                        <Phone className="w- 4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Phone</p>
                        <p className="text-sm font-bold text-gray-900">
                        {userData.phone || "Not provided"}
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setShowEditModal(false);
              setEditForm({ name: "", designation: "", companyName: "" });
              setFormErrors({});
            }}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-lg border border-gray-100 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center shrink-0 bg-white z-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Edit Profile
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Update your profile information</p>
                </div>

                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditForm({ name: "", designation: "", companyName: "" });
                    setFormErrors({});
                  }}
                  className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={editForm.name}
                      onChange={(e) => {
                        setEditForm({ ...editForm, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      className={`w-full px-5 py-3.5 bg-gray-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400`}
                      placeholder="Enter your name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs font-bold mt-1 px-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Designation */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={editForm.designation}
                      onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="e.g. Senior Manager"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={editForm.companyName}
                      onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 px-1">Email cannot be changed</p>
                  </div>

                  {/* Phone (Read-only) */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={user?.phone || "Not provided"}
                      disabled
                      className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 px-1">Phone cannot be changed</p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditForm({ name: "", designation: "", companyName: "" });
                      setFormErrors({});
                    }}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdating && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}