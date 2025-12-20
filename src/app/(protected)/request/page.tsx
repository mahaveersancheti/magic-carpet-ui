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
        <div className="min-h-screen bg-background-light p-4 md:p-8 mt-[0.75rem] rounded-2xl">
            <main className="max-w-6xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-3">
                        <div className="bg-gradient-to-b from-blue-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center font-bold">
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
                                    {REPORT_JSON.warmCallScore.score || "N/A"}
                                </div>
                                <div className="text-sm opacity-90">/ {REPORT_JSON.warmCallScore.outOf}</div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <div className="text-sm opacity-90 text-center italic">
                                    AI Insights generating...
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-white/10 rounded-md text-sm">
                                {REPORT_JSON.warmCallScore.recommendation}
                            </div>
                        </div>

                        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="text-xs uppercase font-semibold text-gray-500 text-center mb-4">
                                Quick Metrics
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-orange-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-orange-600">-</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Meetings</div>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-orange-600">-</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Warm Contacts</div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="lg:col-span-9">
                        <div
                            className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        {REPORT_JSON.prospect.name}
                                    </h2>
                                    <div className="text-sm text-foreground">
                                        {REPORT_JSON.prospect.title} • {REPORT_JSON.prospect.company}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {selectedProfile.email} • {selectedProfile.phone || 'No Phone'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {REPORT_JSON.prospect.location}
                                    </div>
                                </div>

                                <div className="text-right text-xs text-gray-500">
                                    {REPORT_JSON.prospect.timestamp}
                                </div>
                            </div>

                            <hr className="my-4 border-gray-200" />

                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-foreground mb-2">Profile Summary</h3>
                                <p className="text-sm text-foreground mb-2">
                                    <strong className="text-foreground">About:</strong> {selectedProfile.about || "No details available."}
                                </p>

                                <ul className="list-disc ml-5 text-foreground">
                                    {REPORT_JSON.profileSummary.productFitBullets.map((b: any, i: number) => (
                                        <li key={i} className="text-sm mb-1">
                                            {typeof b === 'string' ? b : (b.description || b.title || 'Product fit item')}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4">
                                    <div className="text-xs text-gray-500 mb-1">Skills / Topics</div>
                                    <div className="flex flex-wrap gap-2">
                                        {((selectedProfile as any).allSkills || (selectedProfile as any).topSkills) &&
                                            ((selectedProfile as any).allSkills || (selectedProfile as any).topSkills).length > 0 ? (
                                            ((selectedProfile as any).allSkills || (selectedProfile as any).topSkills).map((t: string, i: number) => (
                                                <span key={i} className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                                                    {t}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">No skills listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="flex justify-between text-lg font-semibold mb-3 text-foreground">
                        Recent News & Context
                        <button
                            onClick={() => {
                                const textToSpeak = REPORT_JSON.recentNews.map(n => `${n.title}. ${n.summary}`).join('. ');
                                handleSpeak(textToSpeak || "No recent news found.", 'recentNews');
                            }}
                            className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'recentNews' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                        >
                            {speakingSection === 'recentNews' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            {speakingSection === 'recentNews' ? "Stop" : "Listen"}
                        </button>
                    </h3>
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg border border-gray-200 bg-blue-50/50">
                            <div className="text-sm font-semibold text-foreground mb-1">Recent Post Analysis</div>
                            <div className="text-sm text-foreground">{REPORT_JSON.profileSummary.recentPost}</div>
                        </div>
                        {REPORT_JSON.recentNews.length > 0 ? REPORT_JSON.recentNews.map((n: any, i: number) => (
                            <div
                                key={i}
                                className="p-4 rounded-lg border border-gray-200"
                                style={{ backgroundColor: '#ffffff' }}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="text-sm font-semibold text-foreground">{n.title}</div>
                                    <div className="text-xs text-gray-500">{n.date}</div>
                                </div>
                                <div className="text-xs text-foreground">{n.summary}</div>
                            </div>
                        )) : (
                            <div className="text-sm text-gray-500 italic">No recent news found.</div>
                        )}
                    </div>
                </section>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground">
                        Industry Outlook
                        <button
                            onClick={() => {
                                const textToSpeak = REPORT_JSON.industryOutlook.map((item: any) =>
                                    `${item.title || ''}. ${item.description || (typeof item === 'string' ? item : '')}`
                                ).join('. ');
                                handleSpeak(textToSpeak || "No industry outlook data available.", 'industryOutlook');
                            }}
                            className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'industryOutlook' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                        >
                            {speakingSection === 'industryOutlook' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            {speakingSection === 'industryOutlook' ? "Stop" : "Listen"}
                        </button>
                    </h3>
                    <div className="flex flex-col gap-3">
                        {REPORT_JSON.industryOutlook.length > 0 ? REPORT_JSON.industryOutlook.map((item: any, i: number) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm font-semibold text-foreground mb-2">
                                    {item.title || `Outlook ${i + 1}`}
                                </div>
                                <div className="text-sm text-foreground">
                                    {item.description || (typeof item === 'string' ? item : 'No description available')}
                                </div>
                            </div>
                        )) : (
                            <div className="text-sm text-gray-500 italic">No industry outlook data available.</div>
                        )}
                    </div>
                </section>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground">
                        Financial Snapshot
                        <button
                            onClick={() => {
                                const textToSpeak = REPORT_JSON.financialSnapshot.map((item: any) => {
                                    const parts = [];
                                    if (item.revenue) parts.push(`Revenue: ${item.revenue}`);
                                    if (item.profit) parts.push(`Profit: ${item.profit}`);
                                    if (item.growth) parts.push(`Growth: ${item.growth}`);
                                    if (item.marketCap) parts.push(`Market Cap: ${item.marketCap}`);
                                    if (item.debt) parts.push(`Debt: ${item.debt}`);
                                    if (item.budget) parts.push(`Budget: ${item.budget}`);
                                    return parts.join(', ');
                                }).join('. ');
                                handleSpeak(textToSpeak || "No financial snapshot data available.", 'financialSnapshot');
                            }}
                            className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'financialSnapshot' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                        >
                            {speakingSection === 'financialSnapshot' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            {speakingSection === 'financialSnapshot' ? "Stop" : "Listen"}
                        </button>
                    </h3>
                    {REPORT_JSON.financialSnapshot.length > 0 ? (
                        <div className="space-y-3">
                            {REPORT_JSON.financialSnapshot.map((item: any, i: number) => (
                                <div key={i} className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {item.revenue && (
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Revenue</div>
                                            <div className="text-sm font-semibold text-blue-600">{item.revenue}</div>
                                        </div>
                                    )}
                                    {item.profit && (
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Profit</div>
                                            <div className="text-sm font-semibold text-green-600">{item.profit}</div>
                                        </div>
                                    )}
                                    {item.growth && (
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Growth</div>
                                            <div className="text-sm font-semibold text-purple-600">{item.growth}</div>
                                        </div>
                                    )}
                                    {item.marketCap && (
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Market Cap</div>
                                            <div className="text-sm font-semibold text-orange-600">{item.marketCap}</div>
                                        </div>
                                    )}
                                    {item.debt && (
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Debt</div>
                                            <div className="text-sm font-semibold text-red-600">{item.debt}</div>
                                        </div>
                                    )}
                                    {item.budget && (
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Budget</div>
                                            <div className="text-sm font-semibold text-indigo-600">{item.budget}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 italic">No financial snapshot data available.</div>
                    )}
                </section>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground">
                        Product Fit
                        <button
                            onClick={() => {
                                const textToSpeak = REPORT_JSON.profileSummary.productFitBullets.map((item: any) =>
                                    typeof item === 'string' ? item : (item.description || item.title || '')
                                ).join('. ');
                                handleSpeak(textToSpeak || "No product fit data available.", 'productFit');
                            }}
                            className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'productFit' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                        >
                            {speakingSection === 'productFit' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            {speakingSection === 'productFit' ? "Stop" : "Listen"}
                        </button>
                    </h3>
                    <div className="space-y-3">
                        {REPORT_JSON.profileSummary.productFitBullets.length > 0 ? (
                            REPORT_JSON.profileSummary.productFitBullets.map((item: any, i: number) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-lg border border-gray-200"
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    <div className="text-sm font-semibold text-foreground mb-1">
                                        {item.productName ? `${item.productName} (${item.fitScore || 0}% Fit)` : 'Product Fit Analysis'}
                                    </div>
                                    <div className="text-sm text-foreground">
                                        {item.description || (typeof item === 'string' ? item : 'No description available')}
                                    </div>
                                    {(item.title1 || item.description1) && (
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {item.title1 && (
                                                <div className="bg-gray-50 p-2 rounded text-xs">
                                                    <strong>{item.title1}</strong>: {item.description1}
                                                </div>
                                            )}
                                            {item.title2 && (
                                                <div className="bg-gray-50 p-2 rounded text-xs">
                                                    <strong>{item.title2}</strong>: {item.description2}
                                                </div>
                                            )}
                                            {item.title3 && (
                                                <div className="bg-gray-50 p-2 rounded text-xs">
                                                    <strong>{item.title3}</strong>: {item.description3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500 italic">No product fit data available.</div>
                        )}
                    </div>
                </section>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground">
                        Psychology & Approach Strategy
                        <button
                            onClick={() => {
                                const textToSpeak = safeList((selectedProfile as any).psychologyApproach?.dos).map((item: string) =>
                                    `Do: ${item}`
                                ).concat(safeList((selectedProfile as any).psychologyApproach?.donts).map((item: string) =>
                                    `Don't: ${item}`
                                )).join('. ');
                                handleSpeak(textToSpeak || "No approach strategy data available.", 'psychologyApproach');
                            }}
                            className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'psychologyApproach' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                        >
                            {speakingSection === 'psychologyApproach' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            {speakingSection === 'psychologyApproach' ? "Stop" : "Listen"}
                        </button>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-lg border border-green-200 bg-green-50/50">
                            <div className="font-semibold text-green-800 mb-2">DO'S</div>
                            <ul className="list-disc ml-5 space-y-1">
                                {safeList((selectedProfile as any).psychologyApproach?.dos).map((item: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground">{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg border border-red-200 bg-red-50/50">
                            <div className="font-semibold text-red-800 mb-2">DON'TS</div>
                            <ul className="list-disc ml-5 space-y-1">
                                {safeList((selectedProfile as any).psychologyApproach?.donts).map((item: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground">
                        Conversation Starters
                        <button
                            onClick={() => {
                                const textToSpeak = REPORT_JSON.conversations.map((item: any) =>
                                    `${item.question || item.tag || ''}. ${item.description || (typeof item === 'string' ? item : '')}`
                                ).join('. ');
                                handleSpeak(textToSpeak || "No conversation starters available.", 'conversations');
                            }}
                            className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'conversations' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                        >
                            {speakingSection === 'conversations' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            {speakingSection === 'conversations' ? "Stop" : "Listen"}
                        </button>
                    </h3>
                    <div className="space-y-3">
                        {REPORT_JSON.conversations.length > 0 ? (
                            REPORT_JSON.conversations.map((item: any, i: number) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-lg border border-gray-200 bg-blue-50"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="text-sm font-semibold text-blue-900">
                                            {item.tag || `Starter ${i + 1}`}
                                        </div>
                                        {item.salesFramework && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-200 text-blue-800">
                                                {item.salesFramework}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-foreground italic">
                                        "{item.question}"
                                    </div>
                                    {item.description && (
                                        <div className="mt-2 text-xs text-gray-600">
                                            <strong>Why:</strong> {item.description}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500 italic">No conversation starters available.</div>
                        )}
                    </div>
                </section>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground">
                        War-Gaming: Predicted Objections & Counters
                        <button
                            onClick={() => {
                                const textToSpeak = REPORT_JSON.objections.map((item: any) =>
                                    `Objection: ${item.objection || ''}. Counter: ${item.counter || ''}.`
                                ).join('. ');
                                handleSpeak(textToSpeak || "No objections and counters available.", 'objections');
                            }}
                            className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'objections' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                        >
                            {speakingSection === 'objections' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            {speakingSection === 'objections' ? "Stop" : "Listen"}
                        </button>
                    </h3>
                    <div className="space-y-4">
                        {REPORT_JSON.objections.length > 0 ? (
                            REPORT_JSON.objections.map((item: any, i: number) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-lg border border-gray-200"
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    <div className="mb-3">
                                        <div className="flex justify-between">
                                            <div className="text-xs font-semibold text-red-600 mb-1">OBJECTION:</div>
                                            {item.type && <div className="text-xs text-gray-500">{item.type}</div>}
                                        </div>
                                        <div className="text-sm text-foreground font-medium">
                                            {item.objection || 'No objection specified'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-green-600 mb-1">COUNTER:</div>
                                        <div className="text-sm text-foreground">
                                            {item.counter || 'No counter specified'}
                                        </div>
                                    </div>
                                    {item.matchingDescription && (
                                        <div className="mt-2 text-xs text-gray-600 italic">
                                            Why works: {item.matchingDescription}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500 italic">No objections and counters available.</div>
                        )}
                    </div>
                </section>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="flex justify-between text-lg font-semibold mb-4 text-foreground">
                        Optimal Timing & Tactics
                        <button
                            onClick={() => {
                                const time = REPORT_JSON.timing;
                                if (time && (time.bestTimes?.length || time.tactics?.length)) {
                                    const textToSpeak = `Best Times: ${time.bestTimes?.join(', ') || 'None'}. Tactics: ${time.tactics?.join(', ') || 'None'}`;
                                    handleSpeak(textToSpeak, 'timing');
                                } else {
                                    handleSpeak("No timing and tactics data available.", 'timing');
                                }
                            }}
                            className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'timing' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                        >
                            {speakingSection === 'timing' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            {speakingSection === 'timing' ? "Stop" : "Listen"}
                        </button>
                    </h3>
                    <div className="space-y-3">
                        {REPORT_JSON.timing && (REPORT_JSON.timing.bestTimes?.length > 0 || REPORT_JSON.timing.tactics?.length > 0) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <div className="text-xs font-semibold text-blue-600 mb-2">BEST TIMES TO CONTACT</div>
                                    <ul className="list-disc ml-4 space-y-1">
                                        {safeList(REPORT_JSON.timing.bestTimes).map((t: string, i: number) => (
                                            <li key={i} className="text-sm text-foreground">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                                    <div className="text-xs font-semibold text-purple-600 mb-2">ENGAGEMENT TACTICS</div>
                                    <ul className="list-disc ml-4 space-y-1">
                                        {safeList(REPORT_JSON.timing.tactics).map((t: string, i: number) => (
                                            <li key={i} className="text-sm text-foreground">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">No timing and tactics data available.</div>
                        )}
                    </div>
                </section>

                <section className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                        <div className="max-w-4xl">
                            <h3 className="flex justify-between text-xl font-semibold mb-2">
                                Action Recommendation
                                <button
                                    onClick={() => handleSpeak(REPORT_JSON.recommendationBody || "No recommendation available.", 'recommendation')}
                                    className={`flex gap-1 items-center justify-center px-3 py-1 rounded-md text-sm transition ${speakingSection === 'recommendation' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                                >
                                    {speakingSection === 'recommendation' ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                                    {speakingSection === 'recommendation' ? "Stop" : "Listen"}
                                </button>
                            </h3> <br />
                            <p className="text-sm opacity-90">{REPORT_JSON.recommendationBody}</p>
                        </div>

                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition">Schedule</button>
                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition">Share</button>
                        </div>
                    </div>
                </section>

                <section
                    className="rounded-2xl p-6 shadow-neo-light-convex border border-gray-200"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Live Client Observations</h3>

                    <div className="mb-3">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Type client observations here..."
                            className="w-full rounded-md border border-gray-200 p-3 text-sm min-h-[90px] shadow-neo-light-concave bg-white text-foreground placeholder-gray-500 outline-none"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => {
                            if (note.trim()) {
                                setObservations([...observations, { text: note, time: new Date().toLocaleTimeString() }]);
                                setNote("");
                            }
                        }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition">Add Observation</button>
                        <button
                            onClick={() => {
                                alert("Generate PDF (placeholder) — integrate jsPDF or server-side export.");
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                        >
                            Generate Proposal PDF
                        </button>
                    </div>

                    <div className="mt-4 space-y-3">
                        {observations.map((o: any, i) => (
                            <div
                                key={i}
                                className="p-3 rounded-md border border-gray-200"
                                style={{ backgroundColor: '#f9fafb' }}
                            >
                                <div className="text-xs text-gray-500">{o.time}</div>
                                <div className="mt-1 text-sm text-foreground">{o.text}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main >
        </div >
    );
}

export default function MagicCarpetReportPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        }>
            <ReportContent />
        </Suspense>
    );
}
