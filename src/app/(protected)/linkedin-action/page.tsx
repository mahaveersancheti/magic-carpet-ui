"use client";
import { useRouter } from "next/navigation";
import React from "react";

const LinkedInAction = () => {
  const router = useRouter();
  
  return (
    <div className="relative flex min-h-screen w-full bg-background-light">

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          {/* Back button */}
          <div>
          <button onClick={() => {router.push('/home')}} className="flex items-center gap-2 rounded-full p-2 shadow-neo-light-outset hover:shadow-neo-light-inset transition-all active:scale-95 bg-white text-foreground">
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
              Back to Dashboard
            </button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 sm:p-10 lg:p-12 shadow-neo-light-convex hover:shadow-neo-light-convex transition-shadow duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Icon bubble */}
              <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-neo-light-concave bg-white">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-.5-2.5-1.8-2.5-1 0-1.5.7-1.7 1.3-.1.2-.1.5-.1.8V19h-3v-9h2.8v1.3c.4-.7 1.2-1.3 2.8-1.3 2 0 3.5 1.3 3.5 4.1z"></path>
                </svg>
              </div>

              {/* Title + text */}
              <div className="flex max-w-lg flex-col items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  LinkedIn Action
                </h2>
                <p className="text-base text-gray-600">
                  Coming Soon! This feature to perform actions on LinkedIn is
                  currently under development. Stay tuned for updates.
                </p>
              </div>

              {/* Disabled Form */}
              <div className="w-full max-w-md flex flex-col gap-6 pt-6 opacity-50">
                <label className="flex flex-col text-left">
                  <p className="text-gray-700 text-sm pb-2">Profile URL</p>
                  <input
                    type="text"
                    disabled
                    placeholder="Enter LinkedIn profile URL"
                    className="rounded-xl h-14 p-4 bg-white text-foreground shadow-neo-light-concave"
                  />
                </label>

                <button className="h-12 px-8 bg-[#1B7FE6] text-white rounded-full font-semibold shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition">
                  Execute Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinkedInAction;
