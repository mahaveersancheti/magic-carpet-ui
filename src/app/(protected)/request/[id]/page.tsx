"use client";
import { useRouter } from 'next/navigation';
import React from "react";

export default function SearchRequestDetails() {
  const router = useRouter();
  
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#1d1f23] p-4 text-white overflow-hidden">
      <div className="mx-auto w-full max-w-5xl flex flex-col gap-3">

        {/* Back Button */}
        <div className="flex items-center">
          <button onClick={() => {router.push('/dashboard')}} className="flex items-center gap-2 rounded-full p-2 shadow-neo-light-outset hover:shadow-neo-light-inset transition-all active:scale-95">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="hidden sm:inline text-sm font-semibold">Back</span>
          </button>
        </div>

        {/* Main Container */}
        <div className="rounded-2xl p-6 shadow-neo-light-outset bg-[#17191c] flex flex-col gap-6">

          {/* Heading */}
          <h1 className="text-3xl font-black tracking-tight">
            Search Request Details: <span className="text-[#e3e3e3]">#SR12345</span>
          </h1>

          {/* Two Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Primary Details */}
            <div className="rounded-xl p-4 shadow-neo-light-inset bg-[#1b1d20]">
              <h3 className="text-base font-bold mb-2">Primary Details</h3>

              <div className="divide-y divide-gray-700/40 text-sm">
                <Row label="Search Request ID" value="#SR12345" />
                <Row label="Date & Time Submitted" value="Oct 26, 2023, 11:45 AM" />
                <Row label="Submitted By" value="admin_user@example.com" />
                <div className="grid grid-cols-[auto_1fr] gap-x-3 py-3 items-center">
                  <p className="text-gray-400">Current Status</p>
                  <span className="text-center rounded-full bg-green-600/25 px-3 py-0.5 text-green-300 text-sm">
                    Completed
                  </span>
                </div>
            </div>
              </div>

            {/* Search Parameters */}
            <div className="rounded-xl p-4 shadow-neo-light-inset bg-[#1b1d20]">
              <h3 className="text-base font-bold mb-2">Search Parameters</h3>

              <div className="divide-y divide-gray-700/40 text-sm">
                <Row label="Visitor Name" value="John Doe" />
                <Row label="Date Range" value="Oct 20, 2023 - Oct 25, 2023" />
                <Row label="Company" value="Tech Solutions Inc." />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="rounded-xl p-4 shadow-neo-light-inset bg-[#1b1d20]">
            <h3 className="text-base font-bold mb-2">Results Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat label="Total Records Found" value="15" />
              <Stat label="Time Taken" value="2.3s" />

              <div className="flex items-end">
                <button className="flex h-10 w-full sm:w-auto px-6 items-center justify-center gap-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-neo-light-outset hover:shadow-neo-light-inset transition-all active:scale-95">
                  <span className="material-symbols-outlined text-white">download</span>
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Matched Records */}
          <div className="rounded-xl p-4 shadow-neo-light-inset bg-[#1b1d20]">
            <h3 className="text-base font-bold mb-2">Matched Records</h3>

            <div className="overflow-x-auto">
              <div className="min-w-full">

                {/* Header */}
                <div className="grid grid-cols-3 gap-4 py-2 px-3 border-b border-gray-700/40 text-gray-400 text-xs font-bold">
                  <p>Name</p>
                  <p>Company</p>
                  <p>Entry Time</p>
                </div>

                {/* Rows */}
                <TableRow name="John Doe" company="Tech Solutions Inc." time="Oct 21, 2023, 09:15 AM" />
                <TableRow name="Jane Smith" company="Innovate Corp" time="Oct 22, 2023, 10:30 AM" />
                <TableRow name="Robert Brown" company="Data Systems" time="Oct 23, 2023, 02:00 PM" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Reusable */

function Row({ label, value }:any) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-3 py-3">
      <p className="text-gray-400">{label}</p>
      <p className="text-gray-200">{value}</p>
    </div>
  );
}

function Stat({ label, value }:any) {
  return (
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
    </div>
  );
}

function TableRow({ name, company, time }:any) {
  return (
    <div className="grid grid-cols-3 gap-4 px-3 py-3 border-b border-gray-700/30 text-sm text-gray-200">
      <p>{name}</p>
      <p>{company}</p>
      <p>{time}</p>
    </div>
  );
}
