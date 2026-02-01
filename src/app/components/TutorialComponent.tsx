'use client';
import React, { useState } from 'react';
import { LogIn, PlusCircle, Chrome, Eye, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const steps = [
  {
    title: "Login to Your Account",
    description: "Start your journey by signing into your Magic Carpet account. Use the credentials below to get immediate access.",
    details: [
      { label: "Email", value: "your logged in email id" },
      { label: "Password", value: "your logged in password" }
    ],
    footer: "Pro tip: Bookmark https://magic-carpet.data-magnum.com/signin for quick access.",
    image: "/tutorial_images/login.png",
    icon: <LogIn className="w-6 h-6" />
  },
  {
    title: "Add New LeadAdd New Lead",
    description: "Once logged in, you can start tracking new profiles. Click the prominent PLUS icon on your dashboard to add a new prospect.",
    highlights: ["Ensure the LinkedIn URL is accurate", "Proper identification is key for AI analysis"],
    image: "/tutorial_images/add_lead.png",
    icon: <PlusCircle className="w-6 h-6" />
  },
  {
    title: "Install the Magic Carpet Extension",
    description: "The Chrome extension is your bridge between LinkedIn and our AI engine. Install it to start clipping profile data effortlessly.",
    steps: [
      "Navigate to chrome://extensions/",
      "Enable 'Developer mode'",
      "Click 'Load unpacked' and select the extension directory",
      "Visit any LinkedIn profile and click 'Clip Full Page'"
    ],
    image: "/tutorial_images/select_extension.png",
    icon: <Chrome className="w-6 h-6" />
  },
  {
    title: "Unlock Deep Insights",
    description: "Once clipping is complete, your results are ready. Dive into comprehensive personality reports and strategic sales recommendations.",
    highlights: ["AI-generated summary", "Strategic sales frameworks", "Psychology-based approaches"],
    image: "/tutorial_images/final.png",
    icon: <Eye className="w-6 h-6" />
  }
];

const TutorialComponent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-hidden transition-colors duration-200">
      {/* Background blobs for aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/20 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Header Area */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Magic Carpet</span>
          </h1>
          <p className="text-[#606e8a] dark:text-gray-400 text-md md:text-lg font-medium max-w-2xl mx-auto">
            Master the art of AI-driven prospecting in four simple steps.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-center mb-12 space-x-2 md:space-x-4">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  idx <= currentStep 
                    ? 'bg-blue-700 border-primary text-white shadow-lg shadow-primary/30' 
                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600'
                }`}
              >
                {idx < currentStep ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold text-sm">{idx + 1}</span>}
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-8 md:w-16 rounded-full transition-colors duration-300 ${
                  idx < currentStep ? 'bg-blue-700' : 'bg-gray-200 dark:bg-white/10'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Card */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden min-h-[500px] flex flex-col md:flex-row transform transition-all duration-500">
          {/* Content Side */}
          <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-700/10 text-primary text-sm font-bold mb-6">
                {steps[currentStep].icon}
                <span>Step {currentStep + 1} of 4</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-[#111318] dark:text-white mb-6">
                {steps[currentStep].title}
              </h2>
              
              <p className="text-[#606e8a] dark:text-gray-400 text-sm lg:text-base leading-relaxed mb-8">
                {steps[currentStep].description}
              </p>

              {/* Dynamic Step Details */}
              <div className="space-y-4">
                {steps[currentStep].details?.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <span className="text-[#606e8a] dark:text-gray-400 font-medium w-24 text-sm">{detail.label}</span>
                    <span className="text-[#111318] dark:text-white font-bold font-mono text-sm">{detail.value}</span>
                  </div>
                ))}

                {steps[currentStep].highlights?.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[#111318] dark:text-white">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium text-sm">{highlight}</span>
                  </div>
                ))}

                {steps[currentStep].steps?.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#606e8a] dark:text-gray-400 shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-[#111318] dark:text-white font-medium text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center gap-4">
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${
                  currentStep === 0 
                  ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' 
                  : 'text-[#606e8a] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              
              <button 
                onClick={nextStep}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all text-sm ${
                  currentStep === steps.length - 1
                  ? 'hidden'
                  : 'bg-blue-700 text-white hover:bg-blue-700 shadow-lg shadow-primary/30'
                }`}
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>

              {currentStep === steps.length - 1 && (
                <button 
                  onClick={() => router.push('/home')}
                  className="flex-1 bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-sm"
                >
                  Start Exploring <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Visual Side */}
          <div className="flex-1 bg-gray-50/50 dark:bg-white/5 p-8 md:p-12 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5"></div>
            <div className="relative z-10 w-full aspect-video rounded-3xl shadow-3xl shadow-primary/10 overflow-hidden border-8 border-white dark:border-white/10 transform transition-all duration-700 group-hover:scale-[1.02]">
              <img 
                src={steps[currentStep].image} 
                alt={steps[currentStep].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Footer info */}
        {steps[currentStep].footer && (
          <p className="text-center mt-6 text-[#606e8a] dark:text-gray-400 text-xs font-medium italic">
            {steps[currentStep].footer}
          </p>
        )}
      </div>
    </div>
  );
};

export default TutorialComponent;