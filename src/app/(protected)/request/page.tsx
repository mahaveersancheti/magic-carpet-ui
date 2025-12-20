// components/MagicCarpetReport.tsx
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Volume2, Loader2, AlertCircle, Square } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProfileById, clearSelectedProfile } from "../../redux/slices/ProfileSlice";

function ReportContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const dispatch = useDispatch<AppDispatch>();
    const { selectedProfile, loading, error } = useSelector((state: RootState) => state.profiles);

    const [observations, setObservations] = useState<any[]>([]);
    const [note, setNote] = useState("");
    const [speakingSection, setSpeakingSection] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchProfileById(id));
        }
        return () => {
            dispatch(clearSelectedProfile());
        };
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light p-4">
                <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col items-center gap-3 text-red-700">
                    <AlertCircle className="w-10 h-10" />
                    <h3 className="text-lg font-bold">Failed to load report</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!selectedProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="text-gray-500">No profile data found.</div>
            </div>
        );
    }

    // Helper to safely parse or use data
    const safeList = (list: any[]) => Array.isArray(list) ? list : [];

    const REPORT_JSON = {
        prospect: {
            initials: selectedProfile.name ? selectedProfile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "NA",
            name: selectedProfile.name || "Unknown",
            title: selectedProfile.designation || "N/A",
            company: selectedProfile.currentCompanyName || "N/A",
            location: selectedProfile.location || "Location N/A",
            tenure: "N/A",
            timestamp: `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        },
        warmCallScore: {
            score: (selectedProfile as any).warmCallScore || 0,
            outOf: 100,
            highlights: [],
            recommendation: "Review recent news and profile summary for engagement opportunities.",
        },
        profileSummary: {
            currentRole: `${selectedProfile.designation || 'Role N/A'} @ ${selectedProfile.currentCompanyName || 'Company N/A'}`,
            tenure: "N/A",
            productFitBullets: safeList((selectedProfile as any).productFit),
            quickMetrics: {
                meetingsLast30Days: 0,
                warmContacts: 0,
            },
            topTopics: [],
            recentPost: (selectedProfile as any).recentPost || (selectedProfile as any).recentNews?.[0]?.description || "No recent activity detected.",
        },
        recentNews: safeList((selectedProfile as any).recentNews).map((news: any) => ({
            category: "News",
            title: news.title || "No Title",
            summary: news.description || "No description available",
            date: news.date || "Recent"
        })),
        industryOutlook: safeList((selectedProfile as any).industryOutlook),
        financialSnapshot: safeList((selectedProfile as any).financialSnapshot),
        conversations: safeList((selectedProfile as any).conversationStarters).map((c: any) => ({
            question: c.text,
            tag: c.label,
            description: c.why?.join(' • '),
            salesFramework: c.cialdini
        })),
        objections: safeList((selectedProfile as any).objections).map((o: any) => ({
            objection: o.objection,
            counter: o.counter,
            matchingDescription: o.whyWorks?.join(' • '),
            type: o.cialdini
        })),
        timing: (selectedProfile as any).timing || {},
        recommendationBody: (selectedProfile as any).actionRecommendation || "No specific recommendation generated."
    };

    // Text-to-speech helper
    const handleSpeak = (text: string, sectionId: string) => {
        if ('speechSynthesis' in window) {
            if (speakingSection === sectionId) {
                // Stop if clicking the same section
                window.speechSynthesis.cancel();
                setSpeakingSection(null);
            } else {
                // Stop current and start new
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = () => setSpeakingSection(null);
                window.speechSynthesis.speak(utterance);
                setSpeakingSection(sectionId);
            }
        } else {
            console.warn("Text-to-speech not supported in this browser.");
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-6 lg:p-8 pt-20 lg:pt-8 font-sans">
            <main className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl transition-all group-hover:bg-blue-100" />
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/20 shrink-0">
                                {REPORT_JSON.prospect.initials}
                            </div>
                            <div className="space-y-1.5 text-center md:text-left">
                                <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 uppercase tracking-widest">
                                    Prospect Intelligence
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                    {REPORT_JSON.prospect.name}
                                </h2>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-600 font-bold">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-lg text-blue-500">work</span>
                                        {REPORT_JSON.prospect.title} @ {REPORT_JSON.prospect.company}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-lg text-blue-500">location_on</span>
                                        {REPORT_JSON.prospect.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                            <div className="text-center md:text-right">
                                <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Warm Call Score</div>
                                <div className="text-4xl font-black text-blue-600 tabular-nums">
                                    {REPORT_JSON.warmCallScore.score || "0"}<span className="text-gray-300 text-lg">/100</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="p-2 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-orange-900 px-1">MEETINGS: -</span>
                                </div>
                                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-blue-900 px-1">CONTACTS: -</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Row 1: Profile & Financials */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs uppercase font-black text-gray-900 tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                        Profile Overview
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const skills = ((selectedProfile as any).allSkills || (selectedProfile as any).topSkills || []).join(', ');
                                            const textToSpeak = `Summary: ${selectedProfile.about || "No detailed summary available"}. Core Competencies: ${skills}`;
                                            handleSpeak(textToSpeak, 'profileOverview');
                                        }}
                                        className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === 'profileOverview' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-100 hover:text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        {speakingSection === 'profileOverview' ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 text-sm leading-relaxed border border-gray-100 italic font-medium mb-8">
                                    "{selectedProfile.about || "No detailed summary available for this profile. Strategic insights may be limited."}"
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm leading-none">star</span>
                                            Strategic Product Fit
                                        </h4>
                                        <div className="space-y-2.5">
                                            {REPORT_JSON.profileSummary.productFitBullets.length > 0 ? REPORT_JSON.profileSummary.productFitBullets.map((b: any, i: number) => (
                                                <div key={i} className="flex items-start gap-3 text-sm text-gray-700 group">
                                                    <span className="mt-0.5 text-blue-500 material-symbols-outlined text-lg leading-none">check_circle</span>
                                                    <span className="font-bold">{typeof b === 'string' ? b : (b.description || b.title || 'Product fit item')}</span>
                                                </div>
                                            )) : (
                                                <div className="flex flex-col items-center justify-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 opacity-60">
                                                    <span className="material-symbols-outlined text-gray-400 text-2xl mb-1">inventory_2</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No product fit data</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm leading-none">verified_user</span>
                                            Core Competencies
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {((selectedProfile as any).allSkills || (selectedProfile as any).topSkills) &&
                                                ((selectedProfile as any).allSkills || (selectedProfile as any).topSkills).length > 0 ? (
                                                ((selectedProfile as any).allSkills || (selectedProfile as any).topSkills).map((t: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-[10px] font-black border border-gray-200 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all cursor-default uppercase tracking-tight flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-blue-400" />
                                                        {t}
                                                    </span>
                                                ))
                                            ) : (
                                                <div className="w-full flex flex-col items-center justify-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 opacity-60">
                                                    <span className="material-symbols-outlined text-gray-400 text-2xl mb-1">psychology</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No skills detected</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 relative group">
                            <div className="absolute inset-0 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-30 blur-2xl group-hover:bg-green-100 transition-all" />
                                <div className="flex items-center justify-between mb-6 relative z-10 shrink-0">
                                    <h3 className="font-black text-gray-900 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-green-600 text-xl">finance</span>
                                        Financial Snapshot
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const textToSpeak = REPORT_JSON.financialSnapshot.map((item: any) => {
                                                const parts: string[] = [];
                                                const labelMap: any = {
                                                    revenue: 'Revenue', profit: 'Profit', growth: 'Growth',
                                                    debt: 'Debt', marketCap: 'Market Cap', profitMargin: 'Profit Margin',
                                                    roe: 'ROE', roce: 'ROCE', peRatio: 'PE Ratio', budget: 'Budget'
                                                };
                                                Object.entries(item).forEach(([k, v]) => {
                                                    if (v && v !== 'N/A' && labelMap[k]) {
                                                        parts.push(`${labelMap[k]}: ${v}`);
                                                    }
                                                });
                                                return parts.join(', ');
                                            }).join('. ');
                                            handleSpeak(textToSpeak || "No financial data available.", 'financialSnapshot');
                                        }}
                                        className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === 'financialSnapshot' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-100 hover:text-green-600 hover:bg-green-50'}`}
                                    >
                                        {speakingSection === 'financialSnapshot' ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                    {REPORT_JSON.financialSnapshot.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-3">
                                            {REPORT_JSON.financialSnapshot.map((item: any, i: number) => (
                                                <React.Fragment key={i}>
                                                    {[
                                                        { key: 'revenue', label: 'Est. Revenue', icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                                        { key: 'profit', label: 'Net Profit', icon: 'add_chart', color: 'text-green-600', bg: 'bg-green-50' },
                                                        { key: 'growth', label: 'Growth Index', icon: 'trending_up', color: 'text-blue-600', bg: 'bg-blue-50' },
                                                        { key: 'marketCap', label: 'Market Cap', icon: 'account_balance', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                                        { key: 'debt', label: 'Total Debt', icon: 'money_off', color: 'text-red-500', bg: 'bg-red-50' },
                                                        { key: 'profitMargin', label: 'Profit Margin', icon: 'percent', color: 'text-teal-600', bg: 'bg-teal-50' },
                                                        { key: 'roe', label: 'ROE', icon: 'account_balance_wallet', color: 'text-purple-600', bg: 'bg-purple-50' },
                                                        { key: 'roce', label: 'ROCE', icon: 'currency_exchange', color: 'text-violet-600', bg: 'bg-violet-50' },
                                                        { key: 'peRatio', label: 'P/E Ratio', icon: 'analytics', color: 'text-amber-600', bg: 'bg-amber-50' },
                                                        { key: 'budget', label: 'Budget', icon: 'savings', color: 'text-orange-600', bg: 'bg-orange-50' },
                                                    ].map((m) => {
                                                        const val = item[m.key];
                                                        if (!val || val === '0' || (val === 'N/A' && i > 0)) return null;
                                                        const isNA = val === 'N/A';
                                                        return (
                                                            <div key={m.key} className={`p-3 rounded-2xl border transition-all flex items-center justify-between group/item hover:shadow-md ${isNA ? 'bg-gray-50 border-gray-100 opacity-60' : `${m.bg} border-transparent hover:bg-white hover:border-current`}`} style={{ borderColor: !isNA ? 'transparent' : undefined }}>
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isNA ? 'bg-gray-200 text-gray-400' : `${m.bg} ${m.color} group-hover/item:scale-110 transition-transform`}`}>
                                                                        <span className="material-symbols-outlined text-lg">{m.icon}</span>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{m.label}</div>
                                                                        <div className={`font-black text-sm transition-colors ${isNA ? 'text-gray-300 italic' : `${m.color}`}`}>
                                                                            {val}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {!isNA && (
                                                                    <span className={`material-symbols-outlined text-xs opacity-0 group-hover/item:opacity-100 transition-opacity ${m.color}`}>arrow_forward_ios</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-[11px] text-gray-400 italic text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">Financial data is not publicly available for this company.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Recent News & Industry Outlook */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="font-black text-gray-900 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-blue-600 text-xl">newspaper</span>
                                        Recent News
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const textToSpeak = REPORT_JSON.recentNews.map(n => `${n.title}. ${n.summary}`).join('. ');
                                            handleSpeak(textToSpeak || "No recent news found.", 'recentNews');
                                        }}
                                        className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === 'recentNews' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-100 hover:text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        {speakingSection === 'recentNews' ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40">
                                        <div className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1.5">Context Analysis</div>
                                        <div className="text-xs text-gray-700 leading-relaxed font-bold">{REPORT_JSON.profileSummary.recentPost}</div>
                                    </div>

                                    <div className="space-y-4">
                                        {REPORT_JSON.recentNews.length > 0 ? REPORT_JSON.recentNews.map((n: any, i: number) => (
                                            <div key={i} className="group cursor-default border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{n.title}</div>
                                                    <div className="text-[10px] font-black text-gray-400 shrink-0 uppercase tracking-tighter">{n.date}</div>
                                                </div>
                                                <div className="text-[11px] text-gray-500 leading-relaxed font-bold line-clamp-2 group-hover:line-clamp-none transition-all">{n.summary}</div>
                                            </div>
                                        )) : (
                                            <div className="text-xs text-gray-400 italic py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">No specific news items detected in the last scan.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden relative group h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-30 blur-2xl group-hover:bg-purple-100 transition-all" />
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <h3 className="font-black text-gray-900 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-purple-600 text-xl">insights</span>
                                        Industry Outlook
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const textToSpeak = REPORT_JSON.industryOutlook.map((item: any) =>
                                                `${item.title || ''}. ${item.description || (typeof item === 'string' ? item : '')}`
                                            ).join('. ');
                                            handleSpeak(textToSpeak || "No outlook data available.", 'industryOutlook');
                                        }}
                                        className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === 'industryOutlook' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-100 hover:text-purple-600 hover:bg-purple-50'}`}
                                    >
                                        {speakingSection === 'industryOutlook' ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="space-y-3 relative z-10 h-[315px] overflow-y-auto custom-scrollbar pr-2">
                                    {REPORT_JSON.industryOutlook.length > 0 ? REPORT_JSON.industryOutlook.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-3 items-start p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-300 hover:bg-white transition-all">
                                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                                            <div className="text-[11px] text-gray-800 leading-relaxed font-black uppercase tracking-tight">
                                                {item.description || (typeof item === 'string' ? item : 'No detailed description available.')}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-[11px] text-gray-400 italic text-center py-10">No specific outlook factors were identified in the current report.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Conversation Starters & Psychology */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-black text-gray-900 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-600 text-xl">chat_bubble</span>
                                        Conversation Starters
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const textToSpeak = REPORT_JSON.conversations.map((item: any) => `${item.question}`).join('. ');
                                            handleSpeak(textToSpeak || "No openers available.", 'conversations');
                                        }}
                                        className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === 'conversations' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-100 hover:text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        {speakingSection === 'conversations' ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {REPORT_JSON.conversations.length > 0 ? REPORT_JSON.conversations.map((item: any, i: number) => (
                                        <div key={i} className="p-4 rounded-3xl border border-blue-50 bg-blue-50/20 hover:border-blue-200 transition-all group/starter">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm text-blue-600">tips_and_updates</span>
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.tag || 'Opener'}</span>
                                                </div>
                                                {item.salesFramework && <span className="px-1.5 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-[9px] font-black border border-blue-200 uppercase tracking-tighter">{item.salesFramework}</span>}
                                            </div>
                                            <div className="text-sm font-black text-gray-900 mb-2 italic group-hover/starter:text-blue-700 transition-colors">"{item.question}"</div>
                                            <p className="text-[10px] text-gray-500 leading-relaxed font-bold flex items-start gap-1.5">
                                                <span className="material-symbols-outlined text-xs text-gray-400 mt-0.5">info</span>
                                                <span><span className="text-gray-400 uppercase tracking-tight">Context:</span> {item.description}</span>
                                            </p>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 opacity-60">
                                            <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">forum</span>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">No conversation starters generated</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="font-black text-gray-900 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-orange-600 text-xl">psychology</span>
                                        Psychology Approach
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const textToSpeak = safeList((selectedProfile as any).psychologyApproach?.dos).map((item: string) => `Do: ${item}`).concat(safeList((selectedProfile as any).psychologyApproach?.donts).map((item: string) => `Don't: ${item}`)).join('. ');
                                            handleSpeak(textToSpeak || "No strategy data available.", 'psychologyApproach');
                                        }}
                                        className={`p-1.5 rounded-lg transition-all active:scale-95 ${speakingSection === 'psychologyApproach' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-orange-600'}`}
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    {safeList((selectedProfile as any).psychologyApproach?.dos).length > 0 || safeList((selectedProfile as any).psychologyApproach?.donts).length > 0 ? (
                                        <>
                                            <div>
                                                <div className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-xs">thumb_up</span>
                                                    Green Flags (Recommended)
                                                </div>
                                                <ul className="space-y-2.5">
                                                    {(selectedProfile as any).psychologyApproach?.dos && (selectedProfile as any).psychologyApproach?.dos.length > 0 ? (selectedProfile as any).psychologyApproach.dos.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-gray-700">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                            {item}
                                                        </li>
                                                    )) : (
                                                        <li className="text-[10px] text-gray-400 italic">No specific recommendations detected</li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="h-px bg-gray-100" />
                                            <div>
                                                <div className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-xs">thumb_down</span>
                                                    Red Flags (Avoid)
                                                </div>
                                                <ul className="space-y-2.5">
                                                    {(selectedProfile as any).psychologyApproach?.donts && (selectedProfile as any).psychologyApproach?.donts.length > 0 ? (selectedProfile as any).psychologyApproach.donts.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-gray-700">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                            {item}
                                                        </li>
                                                    )) : (
                                                        <li className="text-[10px] text-gray-400 italic">No specific warnings detected</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                                            <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">emoji_objects</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No psychological mapping available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Objection Handling (Full Width) */}
                    <div className="bg-slate-900 text-white rounded-3xl border-0 shadow-xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-blue-600/30 transition-all duration-700" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="font-black flex items-center gap-2 text-[12px] uppercase tracking-widest text-blue-400">
                                <span className="material-symbols-outlined">gavel</span>
                                Objection Handling
                            </h3>
                            <button
                                onClick={() => {
                                    const textToSpeak = REPORT_JSON.objections.map(o => `Objection: ${o.objection}. Strategy: ${o.counter}`).join('. ');
                                    handleSpeak(textToSpeak || "No objections predicted.", 'objections');
                                }}
                                className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === 'objections' ? 'bg-red-500 text-white shadow-lg' : 'bg-white/10 text-blue-400 border border-white/10 hover:bg-white/20'}`}
                            >
                                {speakingSection === 'objections' ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            {REPORT_JSON.objections.length > 0 ? REPORT_JSON.objections.map((item: any, i: number) => (
                                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4 hover:bg-white/10 transition-all border-l-4 border-l-red-500/50 hover:border-l-red-500">
                                    <div>
                                        <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1 shadow-sm flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-xs">report_problem</span>
                                            Predicted Objection
                                        </div>
                                        <div className="text-base font-bold text-gray-100">{item.objection}</div>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1 shadow-sm flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-xs">auto_fix_high</span>
                                            Recommended Counter
                                        </div>
                                        <div className="text-sm italic font-bold leading-relaxed text-blue-50/90">"{item.counter}"</div>
                                        {item.matchingDescription && (
                                            <div className="mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Strateguy: {item.matchingDescription}</div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 flex flex-col items-center justify-center py-16 opacity-40">
                                    <span className="material-symbols-outlined text-5xl mb-2">shield_check</span>
                                    <h4 className="text-sm font-black uppercase tracking-widest">No major objections predicted</h4>
                                    <p className="text-[10px] mt-1">Profile appears clear for direct outreach strategy.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Recommendation Banner */}
                <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black border border-white/20 uppercase tracking-widest">
                                    AI Action Recommendation
                                </div>
                                <h3 className="text-lg font-black leading-tight max-w-2xl">{REPORT_JSON.recommendationBody}</h3>
                            </div>
                            <div className="flex gap-4 shrink-0 items-center">
                                <button
                                    onClick={() => handleSpeak(REPORT_JSON.recommendationBody, 'recommendation')}
                                    className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all active:scale-95 border border-white/20 backdrop-blur-sm ${speakingSection === 'recommendation' ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    {speakingSection === 'recommendation' ? <Square className="w-4 h-4" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <button className="h-12 px-6 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest">Schedule Outreach</button>
                                <button className="h-12 px-6 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all active:scale-95 backdrop-blur-sm text-xs uppercase tracking-widest">Tactical Map</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Strategy Notes */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 group">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-gray-400">rate_review</span>
                            Strategic Notes
                        </h3>
                        <button
                            onClick={() => alert("PDF Exporting...")}
                            className="h-10 px-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-[10px] transition-all shadow-lg shadow-green-600/20 active:scale-95 uppercase tracking-widest"
                        >
                            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                            EXPORT REPORT
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-12 relative overflow-hidden rounded-3xl bg-gray-50 border-2 border-transparent focus-within:border-blue-500 transition-all">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add strategic observations or meeting notes..."
                                className="w-full p-6 text-sm min-h-[140px] bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-400 resize-none"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                <span className="text-[10px] text-gray-300 font-bold">Press Send to archive</span>
                                <button
                                    onClick={() => {
                                        if (note.trim()) {
                                            setObservations([...observations, { text: note, time: new Date().toLocaleTimeString() }]);
                                            setNote("");
                                        }
                                    }}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-xl">send</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {observations.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                            {observations.map((o: any, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group/note relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover/note:opacity-50 transition-all" />
                                    <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 relative z-10">{o.time}</div>
                                    <div className="text-xs font-bold text-gray-700 leading-relaxed relative z-10">{o.text}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main >

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div >
    );
}

export default function MagicCarpetReportPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        }>
            <ReportContent />
        </Suspense>
    );
}
