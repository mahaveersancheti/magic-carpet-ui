// components/MagicCarpetReport.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";
const REPORT_JSON = {
  meta: {
    title: "Magic Carpet",
    generatedOn: "Nov 23, 2025",
  },
  prospect: {
    initials: "BD",
    name: "Brian DiPietro",
    title: "Chief Information Security Officer",
    company: "Warner Music Group",
    location: "New York, NY",
    tenure: "3 years at Warner Music",
    timestamp: "Generated: Nov 23, 2025 10:45 AM",
  },
  warmCallScore: {
    score: 87,
    outOf: 100,
    highlights: [
      { label: "Recent research activity", value: "+12" },
      { label: "Had LinkedIn engagement", value: "+8" },
      { label: "Company in growth phase", value: "+6" },
    ],
    recommendation:
      "Opening strong: Lead with M&A context, cite Universal Music case and compliance readiness.",
  },
  profileSummary: {
    currentRole: "Global CSO @ Warner Music Group",
    tenure: "3 years (since March 2021)",
    productFitBullets: [
      "Deep, IR head of Information Security (Spotify, SMB) – Fund",
      "Fluent in Italian, proficient in French",
      "Global Head of Identity and Access Management",
    ],
    quickMetrics: {
      meetingsLast30Days: 18,
      warmContacts: 160,
    },
    topTopics: [
      "Zero-trust architecture",
      "Identity management",
      "Cybersecurity culture",
      "Tech building",
    ],
    recentPost:
      "The future of security isn’t about better walls; it’s about better integration and human-centric design.",
  },
  recentNews: [
    {
      category: "Recent Activity",
      title: "Featured in Cybersecurity Leadership Podcast",
      summary:
        "Discussed building security culture in entertainment industries and the importance of human-centric approaches.",
      date: "Sept 5, 2025",
    },
    {
      category: "Company News",
      title: "Warner Music Group Announces Strategic Technology Investment",
      summary:
        "Warner Music announced a $200M investment in digital infrastructure and security—tied to ongoing M&A activity.",
      date: "June 2, 2025",
    },
    {
      category: "Industry Buzz",
      title: "Speaking at RSA Conference 2025",
      summary:
        'Presented "Zero-Trust in the Age of M&A" discussing identity security best practices.',
      date: "Apr 15, 2025",
    },
  ],
  psychologyAndApproach: {
    tabs: ["Personalization", "Identify & Engagement", "Security/tech alignment", "Confidence-building"],
    dos: [
      "Emphasize technical credibility and industry examples",
      "Provide industry security benchmarks and short proof points",
      "Acknowledge unique M&A complications and provide examples",
      "Contribute immediate value (one pager or case study)",
    ],
    donts: [
      "Don't oversell product-market fit without proof",
      "Avoid scheduling deep technical session without champion buy-in",
      "Do not use heavy vendor marketing jargon",
      "Avoid pushing price/contract talk in first call",
    ],
  },
  conversationStarters: {
    framework: "SPIN Selling",
    starters: [
      {
        label: "Situation / Opening",
        text:
          "Brian, help me understand your current security infrastructure — how many subsidiaries are you managing security for across Warner Music, and what systems are you using to coordinate access management?",
        why: [
          "Opens with diagnostic question about their situation",
          "Shows genuine interest in complexity",
          "Sets up problem discovery",
        ],
      },
      {
        label: "Problem / Implication",
        text:
          "Given the M&A activity you mentioned at RSA, what challenges does that create for maintaining consistent security policies? If that complexity continues, how might it impact your ability to respond quickly to threats?",
        why: [
          "Identifies the core problem (M&A complexity)",
          "Explores implications",
          "Makes cost of inaction tangible",
        ],
      },
    ],
  },
  objections: [
    {
      id: 1,
      objection: "We already have multiple security vendors. Why add another?",
      likelihood: "80% Likely",
      counter:
        "I understand—most enterprises do. We don’t replace your investments; we consolidate identity and access so your existing tools work better together. Would it be worth a quick comparison to see if this addresses a gap?",
      proofBullets: [
        "Works as overlay / orchestration layer (no rip-and-replace)",
        "Integrates with existing identity providers and logs",
        "Reduces integration time during M&A",
      ],
    },
    {
      id: 2,
      objection: "You need to see detailed compliance documentation before proceeding",
      likelihood: "60% Likely",
      counter:
        "Absolutely. Compliance is critical. We can fast-track SOC 2 and ISO-27001 docs and share industry-specific evidence of controls to help clear legal/compliance gates.",
      proofBullets: [
        "Immediate access to compliance artifacts on request",
        "Reference customers in entertainment sector",
        "Dedicated compliance review cadence",
      ],
    },
  ],
  timingAndTactics: {
    bestTimesToCall: [
      "Monday, Tuesday, or Thursday — 9:00–11:00 EST",
      "Avoid Friday afternoon (travels frequently)",
      "Posts on LinkedIn 8:00–9:00 AM EST (check email then)",
    ],
    winningTactics: [
      "Lead with RSA talk + M&A context",
      "Share one-page industry case study up front",
      "Ask for 20 minutes and demo focus on integration pain",
    ],
  },
  actionRecommendation: {
    title: "Action Recommendation",
    body:
      "Lead with Brian's RSA Conference notes and focus on M&A security challenges. Reference the $200M Warner Music tech investment to establish budget availability. Use social proof from Universal Music and propose a 20-minute call to explore identity consolidation across his expanding portfolio.",
    ctas: [
      { label: "Schedule Google Calendar", action: "#" },
      { label: "Share one-pager", action: "#" },
      { label: "Copy to CRM", action: "#" },
    ],
  },
  liveObservations: {
    placeholder: "Type client observations here...",
  },
  footer: {
    copyright: "© 2025 Magic Carpet by InsiderSift. All rights reserved.",
  },
};

export default function MagicCarpetReport() {;
  const [observations, setObservations] = useState([]);
  const [note, setNote] = useState("");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    // Get initial theme from DOM
    const checkTheme = () => {
      if (typeof document !== 'undefined' && document.documentElement) {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
      }
    };
    
    checkTheme();
    
    // Watch for changes to the dark class on html element
    let observer: MutationObserver | null = null;
    if (typeof document !== 'undefined' && document.documentElement) {
      observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-[#1c1f22] p-4 md:p-8 mt-[0.75rem] rounded-2xl">
        <main className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white dark:bg-[#2a2d31] rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex">
            <div className="text-foreground dark:text-white">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#1c1f22] p-4 md:p-8 mt-[0.75rem] rounded-2xl">

      {/* Main */}
      <main className="max-w-6xl mx-auto space-y-6">
        {/* Top panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column (score card) */}
          <aside className="lg:col-span-3">
            <div className="bg-gradient-to-b from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-200 dark:bg-orange-300 text-orange-800 dark:text-orange-900 flex items-center justify-center font-bold">
                  {REPORT_JSON.prospect.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {REPORT_JSON.prospect.name}
                  </div>
                  <div className="text-xs opacity-90">
                    {REPORT_JSON.prospect.title}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="text-xs uppercase opacity-90">
                  Warm Call Score
                </div>
                <div className="text-5xl font-extrabold mt-2">
                  {REPORT_JSON.warmCallScore.score}
                </div>
                <div className="text-sm opacity-90">/ {REPORT_JSON.warmCallScore.outOf}</div>
              </div>

              <div className="mt-6 space-y-2">
                {REPORT_JSON.warmCallScore.highlights.map((h, i) => (
                  <div key={i} className="flex justify-between text-sm opacity-90">
                    <div>{h.label}</div>
                    <div className="font-semibold">{h.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-white/10 rounded-md text-sm">
                {REPORT_JSON.warmCallScore.recommendation}
              </div>
            </div>
          </aside>

          {/* Right column (profile summary) */}
          <section className="lg:col-span-9">
            <div 
              className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
              style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground dark:text-white">
                    {REPORT_JSON.prospect.name}
                  </h2>
                  <div className="text-sm text-foreground dark:text-gray-300">
                    {REPORT_JSON.prospect.title} • {REPORT_JSON.prospect.company}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {REPORT_JSON.prospect.location} • {REPORT_JSON.prospect.tenure}
                  </div>
                </div>

                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                  {REPORT_JSON.prospect.timestamp}
                </div>
              </div>

              <hr className="my-4 border-gray-200 dark:border-[#3a3f45]" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-foreground dark:text-gray-300 mb-2">Profile Summary</h3>
                  <p className="text-sm text-foreground dark:text-gray-300 mb-2">
                    <strong className="text-foreground dark:text-white">Current Role:</strong> {REPORT_JSON.profileSummary.currentRole}
                    <br />
                    <strong className="text-foreground dark:text-white">Tenure:</strong> {REPORT_JSON.profileSummary.tenure}
                  </p>

                  <ul className="list-disc ml-5 text-foreground dark:text-gray-300">
                    {REPORT_JSON.profileSummary.productFitBullets.map((b, i) => (
                      <li key={i} className="text-sm mb-1">{b}</li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Top Topics</div>
                    <div className="flex flex-wrap gap-2">
                      {REPORT_JSON.profileSummary.topTopics.map((t, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 border border-orange-100 dark:border-orange-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm border border-yellow-100 dark:border-yellow-800 text-gray-800 dark:text-gray-200">
                    <strong className="text-gray-900 dark:text-white">Recent Post:</strong> <span>{REPORT_JSON.profileSummary.recentPost}</span>
                  </div>
                </div>

                <div 
                  className="rounded-lg border border-gray-200 dark:border-[#3a3f45] p-3"
                  style={{ backgroundColor: theme === 'dark' ? '#2a2d31' : '#ffffff' }}
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">Quick Metrics</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-md text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">{REPORT_JSON.profileSummary.quickMetrics.meetingsLast30Days}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Meetings / Activities</div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-md text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">{REPORT_JSON.profileSummary.quickMetrics.warmContacts}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Warm Connections</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Recent News & Context */}
        <section 
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="flex justify-between text-lg font-semibold mb-3 text-foreground dark:text-white">
            Recent News & Context
            <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
            </h3>
          <div className="space-y-3">
            {REPORT_JSON.recentNews.map((n, i) => (
              <div 
                key={i} 
                className="p-4 rounded-lg border border-gray-200 dark:border-[#3a3f45]"
                style={{ backgroundColor: theme === 'dark' ? '#1c1f22' : '#ffffff' }}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-semibold text-foreground dark:text-white">{n.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{n.date}</div>
                </div>
                <div className="text-xs text-foreground dark:text-gray-400">{n.summary}</div>
              </div>
            ))}
          </div>
        </section>

            {/* ==================== NEW SECTION: Industry Outlook ==================== */}
        <section
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground dark:text-white">
            Industry Outlook – Music & Entertainment 2025–2026
            <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
          </h3>
          <div className="grid md:grid-cols-2 gap-5 text-sm text-foreground dark:text-gray-300">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400 font-bold text-xs">!</span>
                </div>
                <div>
                  <div className="font-medium">Rising M&A Activity</div>
                  <div className="text-xs mt-1 opacity-90">
                    42% increase in music-label acquisitions expected in 2025–2026 (PwC Entertainment Report). Identity sprawl and compliance harmonization are top post-merger risks.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-xs">↑</span>
                </div>
                <div>
                  <div className="font-medium">AI-Generated Content Surge</div>
                  <div className="text-xs mt-1 opacity-90">
                    Labels face new risks around deepfakes, royalty fraud, and unauthorized voice cloning — driving demand for zero-trust identity controls.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xs">$</span>
              </div>
              <div>
                <div className="font-medium">Cyber Insurance Premiums Up 38%</div>
                <div className="text-xs mt-1 opacity-90">
                  Entertainment firms paying highest increases due to ransomware targeting high-value IP (Marsh 2025 Report).
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* ==================== NEW SECTION: Financial Section ==================== */}
        <section
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground dark:text-white">
            Financial Snapshot – Warner Music Group (NASDAQ: WMG)
            <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$6.92B</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">TTM Revenue</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">+12%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">YoY Growth</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">$200M</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">2025 Tech/Security Budget (announced)</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">47</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Subsidiaries / Labels Globally</div>
            </div>
          </div>

          <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
            <strong className="text-amber-700 dark:text-amber-300">Budget Signal:</strong> WMG explicitly allocated $200M toward “digital infrastructure and security modernization” in June 2025 earnings call — strong indicator of available budget and executive sponsorship for identity/consolidation projects.
          </div>
        </section>

          {/* ==================== NEW SECTION: Product Fit ==================== */}
        <section
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground dark:text-white">
            Product Fit – Why [Your Product] Solves Warner Music’s Biggest Pain
            <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
          </h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                <div className="font-semibold text-teal-700 dark:text-teal-300 mb-2">M&A Identity Orchestration</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  On-day-1 integration of acquired labels’ identity systems without rip-and-replace. Proven at Universal Music (reduced integration time 68%).
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Zero-Trust for Creative Workflows</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Granular access to masters, royalties, and AI training datasets — aligns perfectly with Brian’s public focus on human-centric zero-trust.
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                <div className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Entertainment Reference Customers</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Universal Music Group, Sony Music, Live Nation already live — immediate social proof and compliance artifacts available.
                </p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Fit Score: 94/100</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Combination of active M&A, announced security budget, Brian’s zero-trust advocacy, and existing peer adoption makes Warner Music one of the highest-fit accounts in the pipeline.
              </div>
            </div>
          </div>
        </section>

        {/* Psychology & Approach */}
        <section 
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="flex justify-between text-lg font-semibold mb-3 text-foreground dark:text-white">
            Psychology & Approach Strategy
            <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
            </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {REPORT_JSON.psychologyAndApproach.tabs.map((t, i) => (
              <span key={i} className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-[#3a3f45] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#4a4f55]">{t}</span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <div className="font-semibold text-green-700 dark:text-green-300 mb-2">✅ DOs</div>
              <ul className="text-sm text-gray-800 dark:text-gray-200 list-disc ml-5">
                {REPORT_JSON.psychologyAndApproach.dos.map((d, i) => (
                  <li key={i} className="mb-1">{d}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
              <div className="font-semibold text-red-700 dark:text-red-300 mb-2">❌ DON'Ts</div>
              <ul className="text-sm text-gray-800 dark:text-gray-200 list-disc ml-5">
                {REPORT_JSON.psychologyAndApproach.donts.map((d, i) => (
                  <li key={i} className="mb-1">{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Conversation Starters */}
        <section 
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="flex justify-between text-lg font-semibold mb-3 text-foreground dark:text-white">
            Conversation Starters
            <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
            </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Framework: {REPORT_JSON.conversationStarters.framework}</div>

          <div className="space-y-4">
            {REPORT_JSON.conversationStarters.starters.map((s, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-[#3a3f45] rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">{s.label}</div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-2">{s.text}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Why:
                      <ul className="list-disc ml-5 mt-1">
                        {s.why.map((w, idx) => <li key={idx}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <button className="px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">Listen</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Objections */}
        <section 
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="flex justify-between text-lg font-semibold mb-3 text-foreground dark:text-white">
            War-Gaming: Predicted Objections & Counters
            <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
          </h3>

          <div className="space-y-4">
            {REPORT_JSON.objections.map((o, i) => (
              <div 
                key={i} 
                className="p-4 rounded-lg border border-gray-200 dark:border-[#3a3f45]"
                style={{ backgroundColor: theme === 'dark' ? '#1c1f22' : '#ffffff' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-semibold text-foreground dark:text-white">Objection {o.id}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{o.likelihood}</div>
                </div>

                <div className="text-sm text-foreground dark:text-gray-300 mb-3">"{o.objection}"</div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800 mb-3">
                  <div className="text-sm font-semibold text-green-700 dark:text-green-300">Your Counter</div>
                  <div className="text-sm text-gray-800 dark:text-gray-200 mt-1">{o.counter}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Why this works</div>
                  <ul className="list-disc ml-5 text-sm text-foreground dark:text-gray-300">
                    {o.proofBullets.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timing & Tactics */}
        <section 
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="flex justify-between text-lg font-semibold mb-3 text-foreground dark:text-white">
            Optimal Timing & Tactics
            <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
            </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div 
              className="p-4 rounded-lg border border-gray-200 dark:border-[#3a3f45]"
              style={{ backgroundColor: theme === 'dark' ? '#1c1f22' : '#ffffff' }}
            >
              <div className="font-semibold mb-2 text-foreground dark:text-white">Best Times to Call</div>
              <ul className="list-disc ml-5 text-sm text-foreground dark:text-gray-300">
                {REPORT_JSON.timingAndTactics.bestTimesToCall.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>

            <div 
              className="p-4 rounded-lg border border-gray-200 dark:border-[#3a3f45]"
              style={{ backgroundColor: theme === 'dark' ? '#1c1f22' : '#ffffff' }}
            >
              <div className="font-semibold mb-2 text-foreground dark:text-white">Winning Tactics</div>
              <ul className="list-disc ml-5 text-sm text-foreground dark:text-gray-300">
                {REPORT_JSON.timingAndTactics.winningTactics.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Action Recommendation */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-800 dark:to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-4xl">
              <h3 className="flex justify-between text-xl font-semibold mb-2">
                {REPORT_JSON.actionRecommendation.title}
                <button className="flex gap-1 items-center justify-center px-3 py-1 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm transition">
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
                </h3> <br />
              <p className="text-sm opacity-90">{REPORT_JSON.actionRecommendation.body}</p>
            </div>

            <div className="flex gap-2">
              {REPORT_JSON.actionRecommendation.ctas.map((c, i) => (
                <button key={i} className="px-4 py-2 bg-white/10 dark:bg-white/20 hover:bg-white/20 dark:hover:bg-white/30 rounded-md text-sm transition">{c.label}</button>
              ))}
            </div>
          </div>
        </section>

        {/* Live Observations */}
        <section 
          className="rounded-2xl p-6 shadow-neo-light-convex dark:shadow-neo-dark-convex border border-gray-200 dark:border-[#3a3f45]"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
        >
          <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-white">Live Client Observations</h3>

          <div className="mb-3">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={REPORT_JSON.liveObservations.placeholder}
              className="w-full rounded-md border border-gray-200 dark:border-[#3a3f45] p-3 text-sm min-h-[90px] shadow-neo-light-concave dark:shadow-neo-dark-concave bg-white dark:bg-[#1c1f22] text-foreground dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => {}} className="px-4 py-2 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md transition">Add Observation</button>
            <button
              onClick={() => {
                // Generate PDF placeholder (user to implement)
                alert("Generate PDF (placeholder) — integrate jsPDF or server-side export.");
              }}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white rounded-md transition"
            >
              Generate Proposal PDF
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {observations.map((o:any, i) => (
              <div 
                key={i} 
                className="p-3 rounded-md border border-gray-200 dark:border-[#3a3f45]"
                style={{ backgroundColor: theme === 'dark' ? '#1c1f22' : '#f9fafb' }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">{o.time}</div>
                <div className="mt-1 text-sm text-foreground dark:text-gray-300">{o.text}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
