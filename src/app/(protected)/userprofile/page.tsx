"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";

import toast from "react-hot-toast";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/navigation";
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
  ArrowLeft,
} from "lucide-react";
import { api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";

export default function UserProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user } = useUser();
  const [userData, setUserData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsF819KQIZRWOc4COafT_vJqvIQ5rcdJ_nMnsTyj1BqbAkXU20i4PmkOx2i2pwT3b7ogKzv4W4tCuYok6rOSrDyxRPEpMHWT9aVJUY1FdWhg25NK0wqqpO7hpbAgh6czPzpu50wq_JWIfQvpDrYDoYYbCKJdM0Cq6WBMkWKcoc4qg0cSvgEGD2ZDLR8cjqxgZkcc6Qn3xnja0PJGj7gPMFVUWH1RLu0S6g5CN5NU02RnANCarAaASXlUd6B19ybkl0Ppmg1WnKCsxw",
  });
  const [socialLinks, setSocialLinks] = useState<{
    linkedinUrl: string;
    twitterUrl: string;
    personalUrl: string;
    website: string;
    facebookUrl: string;
    instagramUrl: string;
  }>({
    linkedinUrl: "",
    twitterUrl: "",
    personalUrl: "",
    website: "",
    facebookUrl: "",
    instagramUrl: "",
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.userId) return;

      setIsDataLoading(true);
      try {
        const data: any = await api.get(endpoints.updateUser(user.userId));
        if (data) {
          setUserData((prev) => ({
            ...prev,
            name: data.name || prev.name,
            title:
              data.designation && data.companyName
                ? `${data.designation} @ ${data.companyName}`
                : data.designation || prev.title,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
          }));
          setSocialLinks({
            linkedinUrl: data.linkedinUrl || "",
            twitterUrl: data.twitterUrl || "",
            personalUrl: data.personalUrl || "",
            website: data.website || "",
            facebookUrl: data.facebookUrl || "",
            instagramUrl: data.instagramUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        // Fallback to token data
        setUserData((prev) => ({
          ...prev,
          name: user.name || prev.name,
          title:
            user.designation && user.companyName
              ? `${user.designation} @ ${user.companyName}`
              : user.designation || prev.title,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }));
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Get products count for stats
  const { products } = useSelector((state: RootState) => state.products);

  // Handle Edit Profile Click
  const handleEditClick = () => {
    router.push("/userprofile/edit");
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-11 pt-20 lg:pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              <span className="text-[#111318]">Your Profile</span>
            </h1>
          </div>
        </div>
      </header>
      <div className="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          {isDataLoading ? (
            <div className="max-w-3xl mx-auto w-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-card border border-gray-100">
              <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 font-bold tracking-tight">
                Loading Profile...
              </p>
            </div>
          ) : (
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
                        {
                          Icon: Linkedin,
                          label: "LinkedIn",
                          url: socialLinks.linkedinUrl,
                        },
                        {
                          Icon: Twitter,
                          label: "Twitter",
                          url: socialLinks.twitterUrl,
                        },
                        {
                          Icon: MessageCircle,
                          label: "WhatsApp",
                          url: socialLinks.personalUrl,
                        },
                        {
                          Icon: Slack,
                          label: "Slack",
                          url: socialLinks.website,
                        },
                        {
                          Icon: Facebook,
                          label: "Facebook",
                          url: socialLinks.facebookUrl,
                        },
                        {
                          Icon: Instagram,
                          label: "Instagram",
                          url: socialLinks.instagramUrl,
                        },
                      ].map(({ Icon, label, url }, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (url) {
                              window.open(url, "_blank", "noopener,noreferrer");
                            } else {
                              toast.error(
                                `${label} link is missing. Please add your ${label} URL in your profile settings.`,
                              );
                            }
                          }}
                          className={`p-2.5 rounded-xl border transition-all shadow-sm cursor-pointer ${
                            url
                              ? "border-gray-100 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200"
                              : "border-gray-100 bg-gray-50 text-gray-300"
                          }`}
                          aria-label={label}
                          title={url || `${label} not set`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
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
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                          Products
                        </p>
                        <p className="text-xl font-black text-gray-900">
                          {products.length}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                          Status
                        </p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-xs font-bold text-gray-900 tracking-tight">
                            Active
                          </p>
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
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">
                            Email
                          </p>
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
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">
                            Phone
                          </p>
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
          )}
        </div>
      </div>
    </>
  );
}
