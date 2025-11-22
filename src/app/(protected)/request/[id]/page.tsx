import React from "react";

export default function SearchRequestDetails() {
  return (
    <div className="relative flex min-h-screen w-full flex-col p-4 sm:p-6 md:p-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">

        {/* Toolbar / Header */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 rounded-full p-3 text-text-light-primary dark:text-text-dark-primary shadow-neo-light-outset dark:shadow-neo-dark-outset transition-all hover:shadow-neo-light-inset hover:dark:shadow-neo-dark-inset active:scale-95">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="hidden sm:inline text-base font-semibold">Back</span>
          </button>
        </div>

        {/* Main Content Container */}
        <div className="w-full rounded-xl p-6 sm:p-8 md:p-12 shadow-neo-light-outset dark:shadow-neo-dark-outset">
          <div className="flex flex-col gap-10">

            {/* Page Heading */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-black text-text-light-primary dark:text-text-dark-primary tracking-tight">
                Search Request Details: #SR12345
              </h1>
            </div>

            {/* Soft Cards Container */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

              {/* Primary Details Card */}
              <div className="flex flex-col gap-4 rounded-xl p-6 shadow-neo-light-inset dark:shadow-neo-dark-inset">
                <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary tracking-tight">
                  Primary Details
                </h3>

                <div className="flex flex-col">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-t-slate-300/50 dark:border-t-slate-700/50 py-4">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Search Request ID
                    </p>
                    <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                      #SR12345
                    </p>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-t-slate-300/50 dark:border-t-slate-700/50 py-4">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Date & Time Submitted
                    </p>
                    <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                      Oct 26, 2023, 11:45 AM
                    </p>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-t-slate-300/50 dark:border-t-slate-700/50 py-4">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Submitted By
                    </p>
                    <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                      admin_user@example.com
                    </p>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-t-slate-300/50 dark:border-t-slate-700/50 py-4 items-center">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Current Status
                    </p>

                    <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-green-500/20 px-4 text-green-700 dark:text-green-300">
                      <p className="text-sm font-medium leading-normal">Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Parameters Card */}
              <div className="flex flex-col gap-4 rounded-xl p-6 shadow-neo-light-inset dark:shadow-neo-dark-inset">
                <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary tracking-tight">
                  Search Parameters
                </h3>

                <div className="flex flex-col">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-t-slate-300/50 dark:border-t-slate-700/50 py-4">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Visitor Name
                    </p>
                    <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                      John Doe
                    </p>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-t-slate-300/50 dark:border-t-slate-700/50 py-4">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Date Range
                    </p>
                    <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                      Oct 20, 2023 - Oct 25, 2023
                    </p>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-t-slate-300/50 dark:border-t-slate-700/50 py-4">
                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Company
                    </p>
                    <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                      Tech Solutions Inc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary Card */}
            <div className="flex flex-col gap-4 rounded-xl p-6 shadow-neo-light-inset dark:shadow-neo-dark-inset">
              <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary tracking-tight">
                Results Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                    Total Records Found
                  </p>
                  <p className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
                    15
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                    Time Taken
                  </p>
                  <p className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
                    2.3s
                  </p>
                </div>

                <div className="flex items-end">
                  <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent-light dark:bg-accent-dark text-white font-semibold shadow-neo-light-outset dark:shadow-neo-dark-outset transition-all hover:shadow-neo-light-inset hover:dark:shadow-neo-dark-inset active:scale-95 sm:w-auto sm:px-8">
                    <span className="material-symbols-outlined">download</span>
                    <span>Export Results</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Matched Records Panel */}
            <div className="flex flex-col gap-4 rounded-xl p-6 shadow-neo-light-inset dark:shadow-neo-dark-inset">
              <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary tracking-tight">
                Matched Records
              </h3>

              <div className="overflow-x-auto">
                <div className="min-w-full">

                  {/* Table Header */}
                  <div className="grid grid-cols-3 gap-4 border-b border-b-slate-300/50 dark:border-b-slate-700/50 pb-3 px-4 text-left">
                    <p className="text-sm font-bold text-text-light-secondary dark:text-text-dark-secondary">Name</p>
                    <p className="text-sm font-bold text-text-light-secondary dark:text-text-dark-secondary">Company</p>
                    <p className="text-sm font-bold text-text-light-secondary dark:text-text-dark-secondary">Entry Time</p>
                  </div>

                  {/* Table Body */}
                  <div className="flex flex-col">
                    <div className="grid grid-cols-3 gap-4 px-4 py-4 border-b border-b-slate-300/50 dark:border-b-slate-700/50">
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">John Doe</p>
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">Tech Solutions Inc.</p>
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">Oct 21, 2023, 09:15 AM</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 px-4 py-4 border-b border-b-slate-300/50 dark:border-b-slate-700/50">
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">Jane Smith</p>
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">Innovate Corp</p>
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">Oct 22, 2023, 10:30 AM</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 px-4 py-4 border-b border-b-slate-300/50 dark:border-b-slate-700/50">
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">Robert Brown</p>
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">Data Systems</p>
                      <p className="text-sm text-text-light-primary dark:text-text-dark-primary">Oct 23, 2023, 02:00 PM</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
