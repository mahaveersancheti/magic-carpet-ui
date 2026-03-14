"use client";
import React, { useEffect, useState } from "react";
import {
  billingService,
  BillingSummaryResponse,
} from "@/app/services/billingService";
import { decodeToken } from "@/app/utils/jwt";
import toast from "react-hot-toast";

export default function BillingPage() {
  const [data, setData] = useState<BillingSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const decoded = decodeToken(token);
        if (!decoded || !decoded.userId) {
          setError("Invalid token or user ID not found");
          return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 1-indexed

        const response = await billingService.getSummary(
          decoded.userId,
          year,
          month,
        );
        setData(response);
      } catch (err: any) {
        console.error("Error fetching billing data:", err);
        setError(err.message || "Failed to load billing data");
        toast.error(err.message || "Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-red-500 font-semibold">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const budget = 10.0;
  const percentageUsed = data
    ? Math.min(Math.round((data.totalUsd / budget) * 100), 100)
    : 0;
  const dashArrayValue = (percentageUsed / 100) * 126;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full text-slate-700 antialiased h-full flex flex-col min-h-0">
      {/* BEGIN: Page Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Monthly Usage Billing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor your infrastructure spending in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex items-center text-sm font-medium shadow-sm">
            <svg
              className="w-4 h-4 mr-2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
            <svg
              className="w-4 h-4 ml-2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
          {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
            Export PDF
          </button> */}
        </div>
      </div>
      {/* END: Page Title & Filters */}

      {/* BEGIN: Usage Summary Card */}
      <section className="shrink-0" data-purpose="usage-summary">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          {/* Progress Section */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-slate-900">Usage Summary</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {data?.period || "Monthly Usage"}
                </p>
              </div>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
                On Track
              </span>
            </div>
            {/* Circular Gauge Container */}
            <div className="relative flex flex-col items-center justify-center mt-4">
              <svg className="w-48 h-28" viewBox="0 0 100 60">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeLinecap="round"
                  strokeWidth="8"
                ></path>
                {/* Dasharray for progress */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeDasharray={`${dashArrayValue} 126`}
                  strokeLinecap="round"
                  strokeWidth="8"
                ></path>
              </svg>
              <div className="absolute top-12 text-center">
                <span className="text-3xl font-bold text-slate-900">
                  {percentageUsed}%
                </span>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                  of budget used
                </p>
              </div>
              <div className="w-full max-w-[160px] flex justify-between mt-2 text-[11px] font-semibold text-slate-400">
                {/* <span>$0.00</span> */}
                {/* <span>${budget.toFixed(2)}</span> */}
              </div>
            </div>
          </div>
          {/* Spending Display */}
          <div className="p-8 bg-slate-50/50 flex-1 flex flex-col justify-center">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              Total Accrued
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                ${data?.totalUsd?.toFixed(2) || "0.00"}
              </span>
              <span className="text-sm font-semibold text-slate-500 uppercase">
                USD
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Estimated bill based on current consumption. Forecasted total for{" "}
              {new Date().toLocaleString("default", { month: "long" })} is{" "}
              <span className="text-slate-900 font-medium">
                ${(data?.totalUsd ? data?.totalUsd * 1.5 : 0).toFixed(2)}
              </span>
              .
            </p>
          </div>
        </div>
      </section>
      {/* END: Usage Summary Card */}

      {/* BEGIN: Usage Breakdown Table */}
      <section
        className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden"
        data-purpose="usage-table"
      >
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-slate-900">
            Usage Breakdown by Service
          </h3>
        </div>
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
              <tr className="border-b border-slate-100">
                <th className="px-4 py-2  text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-2  text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Usage Quantity
                </th>
                <th className="px-4 py-2  text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Rate (USD)
                </th>
                <th className="px-4 py-2  text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Subtotal (USD)
                </th>
              </tr>
            </thead>
            <tbody>
              {data && data.transactions && data.transactions.length > 0 ? (
                data.transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-2 ">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">
                          {tx.eventType.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(tx.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2  text-sm text-slate-600">
                      {tx.quantity.toFixed(1)}
                    </td>
                    <td className="px-4 py-2  text-sm text-slate-600 text-right">
                      ${tx.costUsd.toFixed(3)}
                    </td>
                    <td className="px-4 py-2  text-sm font-medium text-slate-900 text-right">
                      ${(tx.quantity * tx.costUsd).toFixed(3)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-20" colSpan={4}>
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                        <svg
                          className="w-12 h-12 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <h4 className="text-slate-900 font-semibold text-lg">
                        No detailed usage recorded yet
                      </h4>
                      <p className="text-slate-500 text-sm max-w-xs mt-2">
                        Detailed billing data for this period is currently being
                        processed and will appear here as services are consumed.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {/* END: Usage Breakdown Table */}
    </div>
  );
}
