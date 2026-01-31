import LandingHeader from "./components/LandingHeader";
import LandingFooter from "./components/LandingFooter";

const heroImage = "/landing.png";
const aboutImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000";

const featureCards = [
  {
    title: "AI Business Intelligence",
    description: "Instantly generate deep intelligence briefs that pinpoint exactly where your product fits.",
    icon: "psychology",
    color: "bg-blue-500",
  },
  {
    title: "Real-Time Context",
    description: "Get the latest news, financial highlights, and strategic pains for any prospect in seconds.",
    icon: "speed",
    color: "bg-indigo-500",
  },
  {
    title: "Tactical Execution",
    description: "AI-recommended outreach strategies that turn cold calls into informative consultations.",
    icon: "target",
    color: "bg-purple-500",
  },
];

const contactItems = [
  { icon: "location_on", label: "Address", value: "Global Reach, Digital First" },
  { icon: "call", label: "Phone", value: "+1 (888) MAGIC-SALES" },
  { icon: "mail", label: "Email", value: "hello@magiccarpet.ai" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Background Animated Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse-gentle" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[110px] animate-pulse-gentle" style={{ animationDelay: '2s' }} />
      </div>

      <LandingHeader />

      <main className="w-full max-w-6xl px-6 md:px-10 py-6 relative z-10">
        {/* HERO SECTION */}
        <section className="w-full py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex flex-col gap-8 text-center lg:text-left flex-1">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center self-center lg:self-start gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  Future of Intelligent Sales
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Every Outreach, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfectly Informed.</span>
                </h1>
                <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                  Stop guessing. Our AI intelligence briefs equip your sales team with the strategic context they need to approach every prospect like a trusted industry advisor.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <a href="/signup" className="h-12 px-8 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center text-[11px] uppercase tracking-widest active:scale-95">
                  Get Started for Free
                </a>
                <button className="h-12 px-8 bg-white text-slate-900 font-black rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center text-[11px] uppercase tracking-widest active:scale-95">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-blue-600/10 blur-[60px] rounded-full scale-75 animate-pulse" />
              <div className="relative glass rounded-[2.5rem] p-3 shadow-2xl animate-float">
                <div className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-[2rem] shadow-inner" style={{ backgroundImage: `url("${heroImage}")` }} />
                <div className="absolute -top-4 -right-4 glass p-3 rounded-xl shadow-xl hidden md:block border-none">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400 leading-none">Yield</p>
                      <p className="text-xs font-black">+350% Reach</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="w-full py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Intelligence Depth', val: '98%' },
              { label: 'Connect Growth', val: '5X' },
              { label: 'Time Saved', val: '24h/wk' },
              { label: 'Active Users', val: '10K+' }
            ].map((s, i) => (
              <div key={i} className="text-center p-6 glass rounded-2xl border-none">
                <p className="text-2xl md:text-3xl font-black text-slate-900 mb-1">{s.val}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION SECTION */}
        <section className="w-full py-12" id="about-company">
          <div className="glass rounded-[3rem] p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full -mr-24 -mt-24 blur-3xl" />
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <p className="text-blue-600 text-[10px] font-black tracking-widest uppercase">Our Mission</p>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Expertise, <br />Instantaneously.</h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    We believe sales is about human connection, not cold scripts. Magic Carpet turns uncertainty into expertise by providing real-time intelligence that empowers your team to have meaningful, context-rich conversations from the very first minute.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    "Zero friction data extraction",
                    "Deep strategic analysis",
                    "Recommended action flows",
                    "Real-time news integration"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full max-w-xs aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-center bg-no-repeat bg-cover hover:scale-110 transition-transform duration-1000" style={{ backgroundImage: `url("${aboutImage}")` }} />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="w-full py-12" id="about-product">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
              <p className="text-blue-600 text-[10px] font-black tracking-widest uppercase">Intelligence Stack</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Features You'll Love</h2>
              <p className="text-base text-slate-600 italic">"Designed by sales experts, powered by cutting-edge neural models."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureCards.map((feature) => (
                <div key={feature.title} className="group flex flex-col gap-6 rounded-[2rem] bg-white p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-slate-100">
                  <div className={`size-14 rounded-xl ${feature.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-xs">{feature.description}</p>
                  </div>
                  <div className="pt-1">
                    <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                      Learn More
                      <span className="material-symbols-outlined text-xs group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="w-full py-12" id="contact">
          <div className="rounded-[3rem] bg-slate-900 p-10 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-ai-gradient opacity-10" />
            <div className="relative z-10 flex flex-col items-center gap-10 text-center">
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Ready to Elevate <br />Your Sales DNA?</h2>
                <p className="text-slate-400 text-base">Join forward-thinking companies who treat every prospect like a partner.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <div className="size-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-white text-[10px] uppercase tracking-widest mb-1">{item.label}</h3>
                      <p className="text-slate-400 text-xs italic">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a href="/signup" className="h-14 px-10 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center text-[11px] uppercase tracking-widest active:scale-95">
                  Start Your Free Trial
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}