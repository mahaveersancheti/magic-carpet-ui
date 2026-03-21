"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    // Intersection Observer for Reveal Animations
    const revealCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    // Intersection Observer for Active Section Highlight
    const sectionCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const sectionObserver = new IntersectionObserver(sectionCallback, {
      threshold: 0.5,
    });
    document
      .querySelectorAll("section[id]")
      .forEach((section) => sectionObserver.observe(section));

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }

        .animate-float {
            animation: float 6s ease-in-out infinite;
        }

        .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        .btn-hover-effect {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover-effect:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.4);
        }
      `}</style>
      <div className="bg-[#f5f7f9] text-[#2c2f31] selection:bg-[#809bff] selection:text-[#001b60] min-h-screen font-['Inter']">
        {/* TopNavBar */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_12px_24px_rgba(44,47,49,0.04)]">
          <div className="flex justify-between items-center px-8 py-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-['Manrope'] font-black tracking-tight text-slate-900 dark:text-white">
                Magic Carpet
              </span>
              <div className="hidden md:flex items-center gap-6">
                <a
                  className={`transition-colors py-1 text-sm font-['Manrope'] cursor-pointer ${
                    activeSection === "about"
                      ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600"
                      : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium border-b-2 border-transparent"
                  }`}
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" });
                    window.history.replaceState(null, "", "#about");
                  }}
                >
                  About
                </a>
                <a
                  className={`transition-colors py-1 text-sm font-['Manrope'] cursor-pointer ${
                    activeSection === "features"
                      ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600"
                      : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium border-b-2 border-transparent"
                  }`}
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                    window.history.replaceState(null, "", "#features");
                  }}
                >
                  Features
                </a>
                <a
                  className={`transition-colors py-1 text-sm font-['Manrope'] cursor-pointer ${
                    activeSection === "contact"
                      ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600"
                      : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium border-b-2 border-transparent"
                  }`}
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                    window.history.replaceState(null, "", "#contact");
                  }}
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/signin"
                className="text-slate-600 font-medium hover:opacity-80 transition-all px-4 py-2 text-sm font-['Manrope']"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-[#1D5DFF] text-[#f2f1ff] font-bold rounded-full px-5 py-2 btn-hover-effect text-sm font-['Manrope'] inline-block"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
        <main className="pt-16 overflow-x-hidden">
          {/* Hero Section */}
          <section className="relative px-8 pt-12 pb-16 max-w-7xl mx-auto reveal">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bda1ff] text-[#3c0091] label-sm tracking-wider mb-4">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest font-['Manrope']">
                    The Intelligent Stratosphere
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-['Manrope'] font-extrabold tracking-tight text-[#2c2f31] leading-[1.1] mb-6">
                  Every Outreach, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D5DFF] to-[#7000ff]">
                    Perfectly Informed
                  </span>
                </h1>
                <p className="text-lg text-[#545d64] leading-relaxed max-w-xl mb-8">
                  Human connection powered by the world's most advanced AI.
                  Transform cold outreach into warm relationships with real-time
                  strategic intelligence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/signup"
                    className="rounded-full bg-gradient-to-r from-[#1D5DFF] to-[#0041c7] text-[#f2f1ff] px-8 py-3.5 font-bold text-base shadow-xl shadow-[#1D5DFF]/25 btn-hover-effect font-['Manrope'] inline-block"
                  >
                    Get Started for Free
                  </Link>
                  <button className="rounded-full border border-[#abadaf]/20 px-8 py-3.5 font-bold text-base text-[#1D5DFF] flex items-center gap-2 hover:bg-[#eef1f3] transition-colors btn-hover-effect font-['Manrope']">
                    <span className="material-symbols-outlined">
                      play_circle
                    </span>
                    Watch Demo
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="relative z-10 rounded-xl overflow-hidden shadow-[0_32px_64px_rgba(44,47,49,0.1)] bg-[#ffffff] p-2 border border-[#abadaf]/10 animate-float">
                  <img
                    alt="Modern laptop screen displaying a sophisticated AI dashboard with charts and intelligence briefs"
                    className="rounded-lg w-full"
                    data-alt="High-tech data visualization dashboard for sales intelligence"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_X6rvDC6869EDXxcIaMXL7mwDymYEr6kOqGlE87kjCMNHVxXvv9fPtu5z0Wz3lKOKGstFzVEeoPx3GaYmxCVM6a5y6d5Hb2ogG0Gac26AasGg0Pbc1RCJOUNKLxLluQzs8YUA9zXDu3NYUoh2WEQKXFAnmrcHCFc9xqp36naN4Q-SzICsj303q6Bi1Ik6LWf6gPVVibjjUvKJcr9AEtewuwvkIgPkQ7WbwIIYDtzAwx-D3Sj06cNZUypK7D96mPfgNvdlufwBCk"
                  />
                </div>
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#1D5DFF]/10 blur-[80px] rounded-full"></div>
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#7000ff]/10 blur-[80px] rounded-full"></div>
              </div>
            </div>
          </section>
          {/* Stats Section */}
          <section className="bg-[#eef1f3] py-12 px-8 reveal">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Card 1 */}
                <div className="glass-card p-6 rounded-lg shadow-sm hover-lift reveal transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#1D5DFF]/10 flex items-center justify-center text-[#1D5DFF]">
                      <span className="material-symbols-outlined text-xl">
                        database
                      </span>
                    </div>
                    <div className="text-4xl font-['Manrope'] font-black text-[#2c2f31]">
                      98%
                    </div>
                  </div>
                  <div className="text-[10px] font-['Manrope'] font-bold text-[#1D5DFF] tracking-widest uppercase mb-1">
                    Intelligence Depth
                  </div>
                  <p className="text-xs text-[#545d64] leading-tight">
                    Unparalleled data granularity for every prospect profile.
                  </p>
                </div>
                {/* Stat Card 2 */}
                <div className="glass-card p-6 rounded-lg shadow-sm hover-lift reveal transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#1D5DFF]/10 flex items-center justify-center text-[#1D5DFF]">
                      <span className="material-symbols-outlined text-xl">
                        hub
                      </span>
                    </div>
                    <div className="text-4xl font-['Manrope'] font-black text-[#2c2f31]">
                      5X
                    </div>
                  </div>
                  <div className="text-[10px] font-['Manrope'] font-bold text-[#1D5DFF] tracking-widest uppercase mb-1">
                    Connect Growth
                  </div>
                  <p className="text-xs text-[#545d64] leading-tight">
                    Exponentially increase your successful meeting rates.
                  </p>
                </div>
                {/* Stat Card 3 */}
                <div className="glass-card p-6 rounded-lg shadow-sm hover-lift reveal transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#1D5DFF]/10 flex items-center justify-center text-[#1D5DFF]">
                      <span className="material-symbols-outlined text-xl">
                        schedule
                      </span>
                    </div>
                    <div className="text-4xl font-['Manrope'] font-black text-[#2c2f31]">
                      24h
                    </div>
                  </div>
                  <div className="text-[10px] font-['Manrope'] font-bold text-[#1D5DFF] tracking-widest uppercase mb-1">
                    Time Saved
                  </div>
                  <p className="text-xs text-[#545d64] leading-tight">
                    Weekly hours reclaimed from manual research tasks.
                  </p>
                </div>
                {/* Stat Card 4 */}
                <div className="glass-card p-6 rounded-lg shadow-sm hover-lift reveal transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#1D5DFF]/10 flex items-center justify-center text-[#1D5DFF]">
                      <span className="material-symbols-outlined text-xl">
                        groups
                      </span>
                    </div>
                    <div className="text-4xl font-['Manrope'] font-black text-[#2c2f31]">
                      10K+
                    </div>
                  </div>
                  <div className="text-[10px] font-['Manrope'] font-bold text-[#1D5DFF] tracking-widest uppercase mb-1">
                    Active Users
                  </div>
                  <p className="text-xs text-[#545d64] leading-tight">
                    Global sales leaders relying on our intelligence.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Mission/Expertise Section */}
          <section id="about" className="py-20 px-8 max-w-7xl mx-auto reveal">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-8">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover-lift">
                      <img
                        alt="Neural network data visualization"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnUdAD9rp57HLJfVNi-ua1Lkcb04nX8e5iShOy1YuwZngzGZVoSI_2y4Rca_8RofeOsCRfPxa1sqFS280r5duXN_ds4flGOGq9VbLF4NTWVClUeqStQRN8wFUOQY8X_tOanzp3s-uXf85aIme7ZHFA4PKbKt5r4iSuHwMFxLtB394Bhi7Wej-pfNWf9pVmLQy5RcC8-fzSe_eTF-SspGz_Ne9JxCauAAco9r9wTOG01Sj7ZeOKRrcTEl4NDkuUj2HrWfw-ru1Jy5U"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-xl shadow-[#1D5DFF]/20 hover-lift">
                      <img
                        alt="Advanced data analytics interface"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgPpwQ_zanJeRm3eGhrltZV5aIEcd7JqAm1IFAYoy4QaA4AZI9s1PhW21JJQx7iSL7TN2HtnbkuWhiKXxiYRrwDYin5v5wCGKzpTNDmW6QIQys1-y_KcORvKivn0Tg1j_g0ckorTFRlC-R7VGnNjntdpRRRiw2Kf1bxXyJZAk3fxWOicKyiX7HGNo1rnT1bqQuY0ICuMAfrJuyhr2qjd1V6rJSeFnGxnmAeJsCGY-9ZrGcP3_Yjvk_cUiZiFWBpulp6xs8BpIxqow"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-xl shadow-[#7000ff]/20 hover-lift">
                      <img
                        alt="AI processing and digital architecture"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZMNjC-n-QhD_EMxFMpN9kJeUdQsxow0_cehQFyFqAyHthtZy3wp9DLDh5xykfuGP4rDgalufaUVmekXtxMre07H8p-UBs1b8IhaSSc4RdgzWrISuAD6ElZqW3eNvogWTgCKaS33GBr5BqMpaXPKmHZJpz_cTdJP3ZMKbDQOhxdqof4pNqhqcdWSQTbkEDxjflwcmo0G3kII8yMvVkekHV4dfa6DCUBGV847jbs-4D9pB2qCt9NmlV9zt2wiPZm3nIytObMHD7QNI"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover-lift">
                      <img
                        alt="Digital connection and network patterns"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFK6ijM32i1LaH8jaAUybnev8PPqw4UuqZpr9mjbwSJCelKep7Xct1PAHMsGPMkrAtskKRt0wHVK2FR9L3VIQiGBjELKxYP25tkV2PvSzegl3MZhwlcWSIZS29sKWUYfZ_X1A_oSDyOGy0TuZjizoHJ9dnAedx_0UYicMVYrcLy2uElrvo155_p69GM0RkZ0gHVRd8zRpnl0_awhdwx6WjnSzsXZL4D6CVUCGnMCpODw0TDZjGhlNC9mvkXFmI1uBqYzZTVwzLbgg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-4xl font-['Manrope'] font-extrabold text-[#2c2f31] mb-6 leading-tight">
                  Expertise,
                  <br />
                  Instantaneously
                </h2>
                <p className="text-lg text-[#545d64] mb-8 leading-relaxed">
                  Magic Carpet collapses weeks of market research into
                  milliseconds. Our AI doesn't just find data—it interprets the
                  narrative behind every prospect.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#1D5DFF]/10 flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[#1D5DFF] text-sm font-bold"
                        data-icon="check"
                      >
                        check
                      </span>
                    </div>
                    <span className="text-[#2c2f31] font-medium">
                      Zero friction data extraction
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#1D5DFF]/10 flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[#1D5DFF] text-sm font-bold"
                        data-icon="check"
                      >
                        check
                      </span>
                    </div>
                    <span className="text-[#2c2f31] font-medium">
                      Real-time news integration
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#1D5DFF]/10 flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[#1D5DFF] text-sm font-bold"
                        data-icon="check"
                      >
                        check
                      </span>
                    </div>
                    <span className="text-[#2c2f31] font-medium">
                      Hyper-personalized script generation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          {/* Features Section */}
          <section id="features" className="py-20 bg-[#eef1f3] reveal">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-xl">
                  <span className="text-[#1D5DFF] font-['Manrope'] font-bold uppercase tracking-widest text-[10px] block mb-2">
                    Core Ecosystem
                  </span>
                  <h2 className="text-4xl font-['Manrope'] font-extrabold text-[#2c2f31]">
                    Features You'll Love
                  </h2>
                </div>
                <p className="text-[#545d64] max-w-sm text-base">
                  The tools designed to turn every salesperson into a strategic
                  consultant.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Feature Card 1 */}
                <div className="bg-[#ffffff] p-6 rounded-2xl shadow-soft group hover-lift transition-all duration-300 reveal">
                  <div className="w-12 h-12 rounded-xl bg-[#1D5DFF]/5 flex items-center justify-center mb-5 group-hover:bg-[#1D5DFF] group-hover:text-white transition-colors duration-300">
                    <span
                      className="material-symbols-outlined text-2xl text-[#1D5DFF] group-hover:text-white transition-colors"
                      data-icon="corporate_fare"
                    >
                      corporate_fare
                    </span>
                  </div>
                  <h3 className="text-xl font-['Manrope'] font-bold mb-3">
                    AI Business Intelligence
                  </h3>
                  <p className="text-[#545d64] mb-6 text-sm leading-relaxed">
                    Deep-dive into organizational structures and financial
                    health reports automatically.
                  </p>
                  <a
                    className="inline-flex items-center gap-2 text-[#1D5DFF] font-['Manrope'] font-bold text-sm hover:gap-3 transition-all"
                    href="#"
                  >
                    Learn More
                    <span className="material-symbols-outlined text-xs">
                      arrow_forward
                    </span>
                  </a>
                </div>
                {/* Feature Card 2 */}
                <div className="bg-[#ffffff] p-6 rounded-2xl shadow-soft group hover-lift transition-all duration-300 reveal">
                  <div className="w-12 h-12 rounded-xl bg-[#7000ff]/5 flex items-center justify-center mb-5 group-hover:bg-[#7000ff] group-hover:text-white transition-colors duration-300">
                    <span
                      className="material-symbols-outlined text-2xl text-[#7000ff] group-hover:text-white transition-colors"
                      data-icon="radar"
                    >
                      radar
                    </span>
                  </div>
                  <h3 className="text-xl font-['Manrope'] font-bold mb-3">
                    Real-Time Context
                  </h3>
                  <p className="text-[#545d64] mb-6 text-sm leading-relaxed">
                    Get notified the second your prospect mentions a pain point
                    on social or news outlets.
                  </p>
                  <a
                    className="inline-flex items-center gap-2 text-[#7000ff] font-['Manrope'] font-bold text-sm hover:gap-3 transition-all"
                    href="#"
                  >
                    Learn More
                    <span className="material-symbols-outlined text-xs">
                      arrow_forward
                    </span>
                  </a>
                </div>
                {/* Feature Card 3 */}
                <div className="bg-[#ffffff] p-6 rounded-2xl shadow-soft group hover-lift transition-all duration-300 border-2 border-transparent hover:border-[#1D5DFF]/10 reveal">
                  <div className="w-12 h-12 rounded-xl bg-[#809bff]/10 flex items-center justify-center mb-5 group-hover:bg-[#809bff] group-hover:text-[#001b60] transition-colors duration-300">
                    <span
                      className="material-symbols-outlined text-2xl text-[#1D5DFF] transition-colors"
                      data-icon="bolt"
                    >
                      bolt
                    </span>
                  </div>
                  <h3 className="text-xl font-['Manrope'] font-bold mb-3">
                    Tactical Execution
                  </h3>
                  <p className="text-[#545d64] mb-6 text-sm leading-relaxed">
                    Automate the 'boring' bits of CRM data entry and focus
                    entirely on the close.
                  </p>
                  <a
                    className="inline-flex items-center gap-2 text-[#1D5DFF] font-['Manrope'] font-bold text-sm hover:gap-3 transition-all"
                    href="#"
                  >
                    Learn More
                    <span className="material-symbols-outlined text-xs">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section id="contact" className="py-16 px-8 max-w-7xl mx-auto reveal">
            <div className="relative bg-slate-950 rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1D5DFF]/20 to-transparent"></div>
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-4xl font-['Manrope'] font-extrabold text-white mb-4">
                    Ready to Elevate Your Sales DNA?
                  </h2>
                  <p className="text-slate-400 text-base mb-6 max-w-md">
                    Join over 10,000 top-tier sales professionals already living
                    in the stratosphere.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                      <span className="material-symbols-outlined text-[#1D5DFF] text-lg">
                        mail
                      </span>
                      hello@magiccarpet.ai
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                      <span className="material-symbols-outlined text-[#1D5DFF] text-lg">
                        phone_iphone
                      </span>
                      +1 (555) 000-MAGIC
                    </div>
                  </div>
                  <Link
                    href="/signup"
                    className="bg-white text-slate-950 font-['Manrope'] font-black rounded-full px-8 py-4 text-lg btn-hover-effect inline-block"
                  >
                    START YOUR FREE TRIAL
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#1D5DFF] blur-[100px] opacity-20"></div>
                    <img
                      alt="Abstract digital art representing The Intelligent Stratosphere with glowing neural networks"
                      className="relative rounded-2xl shadow-2xl border border-white/5 h-[300px] w-full object-cover animate-float"
                      data-alt="Modern collaborative workspace with AI data projections"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEK41oT-Eb6ZB1SERFf14ov71wuI0I-Hbn9ETMluySdIhRO_1N-O9ChJOaRNpr32AZk5JmELkVmMj5XaxCgIB8_u1g7Txt_MC3P5oGpWN9RvdrZ7SHqc4062s-8T9fwgIWhowgan_DKKDSaYLIxuOSQuliDto5vBd6_4XgN3M7zwtpMPgwXeLlb23fhKdOYzgrJkGpwrVMVkUFovRWxoju3kTHCEBFjGpy9uz6BxjzI1_8-N4YPCmIzYP4VvYjgfVdq6zF_XCEjnw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        {/* Footer */}
        <footer className="bg-slate-50 dark:bg-slate-950 w-full border-t border-slate-200/15">
          <div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 max-w-7xl mx-auto">
            <div className="mb-4 md:mb-0">
              <span className="text-base font-['Manrope'] font-bold text-slate-900 dark:text-white block mb-1">
                Magic Carpet AI
              </span>
              <p className="text-slate-500 text-[11px]">
                © 2025 Magic Carpet AI. The Intelligent Stratosphere.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                className="text-slate-500 font-['Manrope'] hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-[11px]"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-slate-500 font-['Manrope'] hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-[11px]"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="text-slate-500 font-['Manrope'] hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-[11px]"
                href="#"
              >
                Security
              </a>
              <a
                className="text-slate-500 font-['Manrope'] hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-[11px]"
                href="#"
              >
                Status
              </a>
              <a
                className="text-slate-500 font-['Manrope'] hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-[11px]"
                href="#"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
