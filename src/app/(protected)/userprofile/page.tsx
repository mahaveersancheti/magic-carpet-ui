"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Link2,
  Share2,
  MoreHorizontal,
  CloudUpload,
  Download,
  Plus,
  X,
  Edit2,
  Globe,
  Calendar,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";

export default function UserProfile() {
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);

  const userData = {
    name: "Jordan Smith",
    title: "Product Designer @ NeoVision",
    email: "jordan.smith@email.com",
    phone: "+1 (555) 123-4567",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsF819KQIZRWOc4COafT_vJqvIQ5rcdJ_nMnsTyj1BqbAkXU20i4PmkOx2i2pwT3b7ogKzv4W4tCuYok6rOSrDyxRPEpMHWT9aVJUY1FdWhg25NK0wqqpO7hpbAgh6czPzpu50wq_JWIfQvpDrYDoYYbCKJdM0Cq6WBMkWKcoc4qg0cSvgEGD2ZDLR8cjqxgZkcc6Qn3xnja0PJGj7gPMFVUWH1RLu0S6g5CN5NU02RnANCarAaASXlUd6B19ybkl0Ppmg1WnKCsxw",
  };

  const files = [
    { name: "Document1.pdf", size: "2.1 MB", type: "pdf" },
    { name: "Document2.docx", size: "856 KB", type: "doc" },
  ];

  const products = [
    {
      title: "Project Neo",
      desc: "A minimalist productivity app designed with focus and simplicity in mind.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB-uZtc4ekLpHhW4vZ5LDCWN_41w0s9Cf6EidVZdSVlKwfTReOEHxW2C4hoVy6BQ-0BFbyDVpVnGzYYyj4wnCzLBIM2Gs6fcJgJR3RL5Ml4_xoh3pD_DBieEeQ9LsL7qIgfm1hiuAccC7UGh75nlYD7HopZGNfkFcH4We_kBMuqfcMptQ3B7ntuTAaEyl5IEmT9d8tJoA9ziQyC7voCh6FpVeQyfcoQTnVvpmCwboxPYeRCOPkDHmN1DfWCqRsdwakVtLi1bh1Vm1SJ",
    },
    {
      title: "DataViz Dashboard",
      desc: "An intuitive data visualization tool for modern business analytics.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA3_XZwBRXJ9DZiWOH0rFHpp22NxNkq9-L_LS4OPEZUhytYoVE1aCscVyRdZmRWiPoj3OHAYMjtS_5dyfd5pKTYjrlTGDX5XAqIPo7sn72KxoUxhFMgAmtoms-Pja6s0Sm4vYDlOWbjqCIXP12bcmTEKQ17b5KE09xUD4d9GBtsSh3weBb4xAnq_YacunjBcrvfkYik4RgFAY2lwO1ps6DprImpZxWVhRr-VWNoPNvHDi0l8oZ1p0rV4IQhCxdc5HS9qU7IaV9lQG92",
    },
  ];

  const quickLinks = [
    { label: "My Portfolio", href: "#portfolio", icon: Globe },
    { label: "Book a Meeting", href: "#meeting", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background-light py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div 
              className="bg-white p-6 rounded-2xl shadow-neo-light-convex transition-all duration-200 relative"
              style={{ backgroundColor: '#ffffff' }}
            >

              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg bg-[#176cc3] hover:bg-[#176cc3] transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="font-bold text-lg sm:text-xl text-foreground mb-1">
                  {userData.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  {userData.title}
                </p>

                <div className="flex gap-2 mt-2">
                  {[
                    { Icon: Linkedin, label: "Link" },
                    { Icon: Twitter, label: "Link" },
                    { Icon: Instagram, label: "Link" },
                    { Icon: Facebook, label: "Link" },
                    { Icon: Share2, label: "Share" },
                  ].map(({ Icon, label }, i) => (
                    <button
                      key={i}
                      className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-neo-light-concave bg-white"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 text-gray-700" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div
              style={{ backgroundColor: '#ffffff' }}
              className="bg-white p-6 rounded-2xl shadow-neo-light-convex transition-all duration-200"
            >
              <h3 className="font-bold text-lg text-foreground mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="border border-gray-200 flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {userData.email}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-foreground">
                      {userData.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div
              style={{ backgroundColor: '#ffffff' }}
              className="bg-white p-6 rounded-2xl shadow-neo-light-convex transition-all duration-200">
              <h3 className="font-bold text-lg text-foreground mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="border border-gray-200 flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group shadow-neo-light-concave bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-foreground">
                          {item.label}
                        </span>
                      </div>
                      <Link2 className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </a>
                  );
                })}

                <button
                  onClick={() => setShowUploadOverlay(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <Plus className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">
                    Add New Link
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Uploaded Files Card */}
            <div className="bg-white p-6 rounded-2xl shadow-neo-light-convex transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg sm:text-xl text-foreground">
                  Uploaded Product Documents
                </h3>

                <button
                  onClick={() => setShowUploadOverlay(true)}
                  className="text-foreground flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition-all"
                >
                  <CloudUpload className="w-4 h-4" />
                  Upload
                </button>
              </div>

              <div
                onClick={() => setShowUploadOverlay(true)}
                className="border-2 border-dashed border-gray-300 p-8 text-center rounded-xl mb-4 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <CloudUpload className="w-10 h-10 mx-auto mb-3 text-gray-400 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-gray-500">
                  Supports PDF, DOC, DOCX up to 10MB
                </p>
              </div>

              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white transition-all shadow-neo-light-concave"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold shrink-0 ${file.type === "pdf"
                            ? "bg-red-500"
                            : "bg-blue-500"
                          }`}
                      >
                        {file.type.toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>

                    <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors ml-3 shrink-0">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Showcase Card */}
            <div className="bg-white p-6 rounded-2xl shadow-neo-light-convex transition-all duration-200">
              <h3 className="font-bold text-lg sm:text-xl text-foreground mb-4">
                Product Showcase
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.title}
                    className="group border border-gray-200 rounded-xl bg-white overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div
                      className="w-full h-40 bg-cover bg-center relative overflow-hidden"
                      style={{ backgroundImage: `url('${product.image}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-base text-foreground mb-1">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadOverlay && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={() => setShowUploadOverlay(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-foreground">
                  Upload Files
                </h3>

                <button
                  onClick={() => setShowUploadOverlay(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-xl mb-4 hover:border-primary transition-colors">
                <CloudUpload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drag & drop files here
                </p>
                <p className="text-xs text-gray-500">
                  or click to browse
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadOverlay(false)}
                  className="text-foreground flex-1 border border-gray-300 rounded-xl p-3 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>

                <button className="text-foreground flex-1 p-3 rounded-xl bg-primary text-sm font-semibold shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition-all">
                  Upload Files
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}