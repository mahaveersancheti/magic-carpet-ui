"use client";
import React from 'react'

function Profile() {
  return (
    <div className='p-4 sm:p-6 md:p-8 min-h-screen bg-background-light dark:bg-[#1c1f22]'>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground dark:text-white tracking-tight mb-6 sm:mb-8">
          Profile
        </h1>
        <div className="p-4 sm:p-6 rounded-2xl shadow-neo-light-convex dark:shadow-neo-dark-convex bg-white dark:bg-[#25282c]">
          <p className="text-sm sm:text-base text-foreground dark:text-gray-300">Coming Soon..</p>
        </div>
      </div>
    </div>
  )
}

export default Profile