"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Mail, 
  Send, 
  X, 
  ArrowLeft, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProfileById } from "../../redux/slices/ProfileSlice";
import toast from "react-hot-toast";

const EMAIL_TEMPLATES = [
  {
    id: "greeting",
    label: "Greeting Email",
    subject: "Hello from Magic Carpet",
    body: (name: string) => `Hi ${name},\n\nI hope you're having a great week! I'm reaching out to introduce myself and share some exciting updates from Magic Carpet.\n\nLooking forward to connecting!\n\nBest regards,\n[Your Name]`
  },
  {
    id: "followup",
    label: "Follow-up Email",
    subject: "Following up on our conversation",
    body: (name: string) => `Hi ${name},\n\nIt was great speaking with you earlier. I wanted to follow up on the points we discussed and see if you have any further questions.\n\nLet me know when you'd like to chat again.\n\nBest,\n[Your Name]`
  },
  {
    id: "meeting",
    label: "Meeting Request",
    subject: "Scheduling a quick chat",
    body: (name: string) => `Hi ${name},\n\nI've been following your work and would love to schedule a brief 15-minute call to discuss how Magic Carpet can help with [Goal].\n\nDo you have any availability later this week?\n\nCheers,\n[Your Name]`
  },
  {
    id: "intro",
    label: "Product Introduction",
    subject: "Introducing Magic Carpet",
    body: (name: string) => `Hi ${name},\n\nI noticed you're working on [Project/Industry], and I thought Magic Carpet would be a perfect fit for your needs. We help teams achieve [Benefit] with less effort.\n\nWould love to show you a quick demo!\n\nBest,\n[Your Name]`
  },
  {
    id: "thankyou",
    label: "Thank You",
    subject: "Thank you for your time",
    body: (name: string) => `Hi ${name},\n\nThank you for taking the time to meet with me today. It was very insightful to learn more about your current challenges.\n\nI'll be in touch soon with the additional resources we discussed.\n\nBest regards,\n[Your Name]`
  },
  {
    id: "feedback",
    label: "Feedback Request",
    subject: "Your thoughts on Magic Carpet",
    body: (name: string) => `Hi ${name},\n\nWe would love to get your feedback on your experience with Magic Carpet so far. Your insights are invaluable to us as we continue to improve.\n\nDo you have 2 minutes for a quick survey?\n\nWarmly,\n[Your Name]`
  }
];

function SendEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");
  const dispatch = useDispatch<AppDispatch>();
  
  const { selectedProfile, loading } = useSelector(
    (state: RootState) => state.profiles,
  );

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (profileId) {
      dispatch(fetchProfileById({ id: profileId }));
    }
  }, [dispatch, profileId]);

  const handleTagClick = (template: typeof EMAIL_TEMPLATES[0]) => {
    const name = selectedProfile?.name || "there";
    setSelectedTag(template.id);
    setSubject(template.subject);
    setMessage(template.body(name));
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    setIsSending(true);
    // Mock send delay
    setTimeout(() => {
      setIsSending(false);
      toast.success("Email sent successfully!");
      router.back();
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 pt-20 lg:pt-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Send Email</h1>
            <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Draft and send a professional email to your lead</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleSend}
            disabled={isSending}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Email
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto w-full">
        <div className="grid lg:grid-cols-12 gap-6 w-full h-full max-w-[1920px] mx-auto">
          {/* Left Column: Context and Templates */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recipient Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg">
                {selectedProfile?.name?.charAt(0) || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{selectedProfile?.name || "Select Lead"}</h3>
                <p className="text-xs text-slate-500 font-medium truncate">{selectedProfile?.email || "No email available"}</p>
                <div className="mt-2 sm:hidden">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${selectedProfile?.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                    {selectedProfile?.status || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedProfile?.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                  {selectedProfile?.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Templates Section */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Quick Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {EMAIL_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTagClick(template)}
                    className={`px-4 py-3 rounded-xl text-left text-xs font-bold border transition-all ${
                      selectedTag === template.id 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                    }`}
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Email Editor */}
          <div className="lg:col-span-8 flex flex-col min-h-[500px]">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-400 w-16">Subject</label>
                  <input 
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-900 placeholder:text-slate-300 outline-none"
                  />
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <label className="text-xs font-bold text-slate-400 mb-2">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Start typing your message here..."
                  className="flex-1 w-full bg-slate-50/50 rounded-xl p-4 text-sm font-medium text-slate-700 leading-relaxed border border-transparent focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all resize-none outline-none"
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">AI can help you polish this content</span>
                </div>
                <p className="text-[10px] font-medium text-slate-400">Characters: {message.length}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SendEmailPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <SendEmailContent />
    </Suspense>
  );
}
