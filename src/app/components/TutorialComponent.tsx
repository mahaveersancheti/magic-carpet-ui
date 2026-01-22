import React, { useState } from 'react';
import { LogIn, PlusCircle, Chrome, Eye, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  {
    title: "Login to Your Account",
    description: "Start your journey by signing into your Magic Carpet account. Use the credentials below to get immediate access.",
    details: [
      { label: "Email", value: "your logged in email id" },
      { label: "Password", value: "your logged in password" }
    ],
    footer: "Pro tip: Bookmark https://magic-carpet.data-magnum.com/signin for quick access.",
    image: "/Users/apple/.gemini/antigravity/brain/05d3a877-d25a-4bdf-97ef-77562134c8d3/magic_carpet_login_tutorial_1769014185090.png",
    icon: <LogIn className="w-6 h-6" />
  },
  {
    title: "Create a Search Request",
    description: "Once logged in, you can start tracking new profiles. Click the prominent PLUS icon on your dashboard to add a new prospect.",
    highlights: ["Ensure the LinkedIn URL is accurate", "Proper identification is key for AI analysis"],
    image: "/Users/apple/.gemini/antigravity/brain/05d3a877-d25a-4bdf-97ef-77562134c8d3/magic_carpet_add_request_tutorial_v2v31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679_1769014322592.png",
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
    image: "/Users/apple/.gemini/antigravity/brain/05d3a877-d25a-4bdf-97ef-77562134c8d3/magic_carpet_extension_clipping_tutorial_v24_1769014236014.png",
    icon: <Chrome className="w-6 h-6" />
  },
  {
    title: "Unlock Deep Insights",
    description: "Once clipping is complete, your results are ready. Dive into comprehensive personality reports and strategic sales recommendations.",
    highlights: ["AI-generated summary", "Strategic sales frameworks", "Psychology-based approaches"],
    image: "/Users/apple/.gemini/antigravity/brain/05d3a877-d25a-4bdf-97ef-77562134c8d3/magic_carpet_results_view_tutorial_1769014266100.png",
    icon: <Eye className="w-6 h-6" />
  }
];

const TutorialComponent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      {/* Background blobs for aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Header Area */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Magic Carpet</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
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
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {idx < currentStep ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{idx + 1}</span>}
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-8 md:w-16 rounded-full transition-colors duration-300 ${
                  idx < currentStep ? 'bg-indigo-600' : 'bg-slate-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden min-h-[500px] flex flex-col md:flex-row transform transition-all duration-500">
          {/* Content Side */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6">
                {steps[currentStep].icon}
                <span>Step {currentStep + 1} of 4</span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6">
                {steps[currentStep].title}
              </h2>
              
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {steps[currentStep].description}
              </p>

              {/* Dynamic Step Details */}
              <div className="space-y-4">
                {steps[currentStep].details?.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-medium w-24">{detail.label}</span>
                    <span className="text-slate-900 font-bold font-mono">{detail.value}</span>
                  </div>
                ))}

                {steps[currentStep].highlights?.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span className="font-medium">{highlight}</span>
                  </div>
                ))}

                {steps[currentStep].steps?.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-slate-700 font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center gap-4">
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                  currentStep === 0 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              
              <button 
                onClick={nextStep}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                  currentStep === steps.length - 1
                  ? 'hidden'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                }`}
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>

              {currentStep === steps.length - 1 && (
                <button 
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  Start Exploring <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Visual Side */}
          <div className="flex-1 bg-slate-50/50 p-8 md:p-12 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5"></div>
            <div className="relative z-10 w-full aspect-video rounded-3xl shadow-3xl shadow-indigo-100 overflow-hidden border-8 border-white transform transition-all duration-700 group-hover:scale-[1.02]">
              <img 
                src={steps[currentStep].image} 
                alt={steps[currentStep].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Glossy Overlay */}
            <div className="absolute top-12 right-12 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border border-white/30 animate-pulse"></div>
            <div className="absolute bottom-12 left-12 w-32 h-32 bg-indigo-200/20 backdrop-blur-md rounded-full border border-white/10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Footer info */}
        {steps[currentStep].footer && (
          <p className="text-center mt-6 text-slate-500 text-sm font-medium italic">
            {steps[currentStep].footer}
          </p>
        )}
      </div>
    </div>
  );
};

export default TutorialComponent;