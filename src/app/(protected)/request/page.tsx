// components/MagicCarpetReport.tsx
"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  Volume2,
  Loader2,
  AlertCircle,
  Square,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  X,
  FastForward,
  Rewind,
  HelpCircle,
  Mic,
  MicOff,
  Mail,
} from "lucide-react";
// import { UserGuide, GuideStep } from "@/app/components/UserGuide";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  fetchProfileById,
  clearSelectedProfile,
} from "../../redux/slices/ProfileSlice";
import { api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";
import toast from "react-hot-toast";
import TutorialComponent from "@/app/components/TutorialComponent";

const ScoreGauge = ({
  score,
  size = 100,
  title,
  showPercentage = false,
}: {
  score: number;
  size?: number;
  title?: string;
  showPercentage?: boolean;
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  // Needle rotation: 0 = -90deg, 100 = 90deg
  const rotation = (Math.min(100, Math.max(0, animatedScore)) / 100) * 180 - 90;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: size }}
    >
      <svg
        width={size}
        height={size * 0.8}
        viewBox="0 0 200 160"
        className="overflow-visible"
      >
        {/* Defs for gradients or shadow if needed */}

        {/* Gauge Segments - Shifted Y+30 (Center 100,130) */}
        {/* Segment 1: Red (0-25) */}
        <path
          d="M20,130 A80,80 0 0,1 46,76"
          fill="none"
          stroke="#ef4444"
          strokeWidth="25"
        />
        {/* Segment 2: Orange (25-50) */}
        <path
          d="M48,74 A80,80 0 0,1 100,50"
          fill="none"
          stroke="#f97316"
          strokeWidth="25"
        />
        {/* Segment 3: Yellow (50-75) */}
        <path
          d="M100,50 A80,80 0 0,1 152,74"
          fill="none"
          stroke="#eab308"
          strokeWidth="25"
        />
        {/* Segment 4: Teal (75-100) */}
        <path
          d="M154,76 A80,80 0 0,1 180,130"
          fill="none"
          stroke="#10b981"
          strokeWidth="25"
        />

        {/* Percentage Labels - Moved outward (Radius ~125) and shifted Y+30 */}
        <text
          x="10"
          y="145"
          fontSize="12"
          fontWeight="600"
          fill="#4b5563"
          textAnchor="middle"
        >
          0%
        </text>
        <text
          x="25"
          y="55"
          fontSize="12"
          fontWeight="600"
          fill="#4b5563"
          textAnchor="middle"
        >
          25%
        </text>
        <text
          x="100"
          y="35"
          fontSize="12"
          fontWeight="600"
          fill="#4b5563"
          textAnchor="middle"
        >
          50%
        </text>
        <text
          x="175"
          y="55"
          fontSize="12"
          fontWeight="600"
          fill="#4b5563"
          textAnchor="middle"
        >
          75%
        </text>
        <text
          x="190"
          y="145"
          fontSize="12"
          fontWeight="600"
          fill="#4b5563"
          textAnchor="middle"
        >
          100%
        </text>

        {/* Needle Group - Origin (100, 130) */}
        <g
          className="transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "100px 130px",
          }}
        >
          {/* Needle Line */}
          <line
            x1="100"
            y1="130"
            x2="100"
            y2="55"
            stroke="#1f2937"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Needle Pivot */}
          <circle cx="100" cy="130" r="8" fill="#1f2937" />
        </g>

        {/* Center Score Text (Semi-circle cover) - Only for small inline version */}
        {showPercentage && (
          <>
            <path d="M70,130 A30,30 0 0,1 130,130" fill="#f3f4f6" />
            <text
              x="100"
              y="125"
              fontSize="16"
              fontWeight="bold"
              fill="#1f2937"
              textAnchor="middle"
            >
              {Math.round(animatedScore)}%
            </text>
          </>
        )}
      </svg>
      {!showPercentage && (
        <div className="absolute top-[55%] flex flex-col items-center">
          <span className="text-lg font-black text-gray-900 leading-none">
            {Math.round(animatedScore)}
          </span>
          {title && (
            <span className="mt-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1 text-center">
              {title}
            </span>
          )}
        </div>
      )}
      {showPercentage && title && (
        <div className="absolute top-[85%] flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 text-center">
            {title}
          </span>
        </div>
      )}
    </div>
  );
};

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProfile, loading, error } = useSelector(
    (state: RootState) => state.profiles,
  );

  const [observations, setObservations] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [speakingSectionTitle, setSpeakingSectionTitle] = useState("");

  // User Guide State
  const [showGuide, setShowGuide] = useState(false);

  // Dynamic Dropdown State
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">(
    "down",
  );
  const connectButtonRef = useRef<HTMLDivElement>(null);

  // Play All State
  const [playAllIndex, setPlayAllIndex] = useState<number | null>(null);

  // Voice Dictation State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Voice API Response State
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Product Selection State
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);

  useEffect(() => {
    console.log("selectedProfile", selectedProfile?.status);
  }, [selectedProfile]);

  const startVoiceDictation = () => {
    if (isProcessingVoice || isPlayingVoice) {
      // Stop TTS
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      // Stop Audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsProcessingVoice(false);
      setIsPlayingVoice(false);
      toast.success("Stopped playing");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice dictation not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Listening...");
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNote((prev) => (prev ? `${prev} ${transcript}` : transcript));
      // toast.success(`Captured: "${transcript}"`);

      // Call API with transcribed text
      if (id && transcript.trim()) {
        setIsProcessingVoice(true);
        try {
          const response = await api.getWithResponse(
            endpoints.getProfileSection(id, transcript),
            {
              accept: "*/*",
            },
          );

          const contentType = response.contentType;

          // Check if response is audio
          if (contentType && contentType.includes("audio")) {
            const audioBlob = response.data;
            const audioUrl = URL.createObjectURL(audioBlob);

            // Stop any currently playing audio
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current = null;
            }

            // Play audio response
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            setIsPlayingVoice(true);
            setIsProcessingVoice(false);

            audio.onended = () => {
              URL.revokeObjectURL(audioUrl);
              setIsPlayingVoice(false);
              audioRef.current = null;
            };

            audio.onerror = () => {
              URL.revokeObjectURL(audioUrl);
              setIsPlayingVoice(false);
              audioRef.current = null;
              toast.error("Failed to play audio response");
            };

            await audio.play();
            toast.success("Playing AI response...");
          } else {
            // Handle text response - extract section name and play corresponding content
            const textBlob = response.data;
            const textResponse = await textBlob.text();
            console.log("API Text Response:", textResponse);

            // Try to parse as JSON first, otherwise treat as plain text
            let sectionName: string | null = null;
            try {
              const jsonResponse = JSON.parse(textResponse);
              sectionName =
                jsonResponse.section ||
                jsonResponse.sectionName ||
                jsonResponse.name ||
                null;
            } catch {
              // If not JSON, use the text as the section name
              sectionName = textResponse.trim();
            }

            // Extract and play the content from the matching section
            if (sectionName) {
              // First priority: get from PLAYLIST
              let contentToPlay = getSectionContent(sectionName, PLAYLIST);

              // Second priority: check if it's a property in selectedProfile
              if (!contentToPlay && selectedProfile) {
                // Try direct property lookup (case-insensitive)
                const propName = Object.keys(selectedProfile).find(
                  (k) => k.toLowerCase() === sectionName?.toLowerCase(),
                );
                if (propName) {
                  contentToPlay = (selectedProfile as any)[propName];
                  if (typeof contentToPlay !== "string") {
                    contentToPlay = JSON.stringify(contentToPlay);
                  }
                }
              }

              if (contentToPlay) {
                console.log(`Playing section: ${sectionName}`, contentToPlay);

                if ("speechSynthesis" in window) {
                  const utterance = new SpeechSynthesisUtterance(contentToPlay);
                  setIsPlayingVoice(true);
                  setIsProcessingVoice(false);
                  utterance.onend = () => {
                    setIsPlayingVoice(false);
                  };
                  utterance.onerror = () => {
                    setIsPlayingVoice(false);
                  };
                  window.speechSynthesis.speak(utterance);
                  toast.success(`Playing section: ${sectionName}`);
                } else {
                  setIsProcessingVoice(false);
                  toast.error("Text-to-speech not supported");
                }
              } else {
                // If no matching section found, play the text response as-is
                console.log(
                  "No matching section found, playing text response directly",
                );
                if (textResponse && "speechSynthesis" in window) {
                  const utterance = new SpeechSynthesisUtterance(textResponse);
                  setIsPlayingVoice(true);
                  setIsProcessingVoice(false);
                  utterance.onend = () => {
                    setIsPlayingVoice(false);
                  };
                  window.speechSynthesis.speak(utterance);
                } else {
                  setIsProcessingVoice(false);
                }
              }
            } else {
              // Fallback: play the text response directly
              if (textResponse && "speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(textResponse);
                setIsPlayingVoice(true);
                setIsProcessingVoice(false);
                utterance.onend = () => {
                  setIsPlayingVoice(false);
                };
                window.speechSynthesis.speak(utterance);
              } else {
                setIsProcessingVoice(false);
              }
            }
          }
        } catch (error: any) {
          console.error("Error processing voice:", error);
          toast.error(error?.message || "Failed to process voice input");
          setIsProcessingVoice(false);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      toast.error("Error identifying speech. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const calculateDropdownPosition = () => {
    if (connectButtonRef.current) {
      const rect = connectButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If space below is less than 300px, open upwards
      if (spaceBelow < 250) {
        setDropdownDirection("up");
      } else {
        setDropdownDirection("down");
      }
    }
  };
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenReportGuide_v1");
    if (!hasSeenGuide && !loading && selectedProfile) {
      setTimeout(() => setShowGuide(true), 1500);
    }
  }, [loading, selectedProfile]);

  const handleGuideComplete = () => {
    localStorage.setItem("hasSeenReportGuide_v1", "true");
    setShowGuide(false);
  };

  // const GUIDE_STEPS: GuideStep[] = [
  //     {
  //         targetId: 'report-header',
  //         title: 'Profile Overview',
  //         description: 'This is the comprehensive AI report for your prospect. It contains key insights, scores, and strategies.',
  //         placement: 'bottom'
  //     },
  //     {
  //         targetId: 'warm-call-score',
  //         title: 'Warm Call Score',
  //         description: 'A quick metric to gauge how receptive this prospect likely is. Higher scores indicate better timing.',
  //         placement: 'left'
  //     },
  //     {
  //         targetId: 'listen-button',
  //         title: 'Audio Insights',
  //         description: 'Prefer listening? Click the speaker icon to hear an AI-generated summary of this section.',
  //         placement: 'bottom'
  //     },
  //     {
  //         targetId: 'action-bar',
  //         title: 'Take Action',
  //         description: 'Export this report to PDF or share it with your team directly from here.',
  //         placement: 'bottom'
  //     }
  // ];

  useEffect(() => {
    if ((selectedProfile as any)?.notes) {
      setObservations(
        (selectedProfile as any).notes.map((note: any) => ({
          text: note.text,
          time:
            new Date(note.date).toLocaleDateString() +
            " " +
            new Date(note.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        })),
      );
    }
  }, [selectedProfile]);

  useEffect(() => {
    if (id) {
      const isArchived = searchParams.get("isArchived") === "true";
      dispatch(fetchProfileById({ id, isArchived }));
    }
    return () => {
      dispatch(clearSelectedProfile());
    };
  }, [dispatch, id]);

  // Helper to safely parse or use data
  const safeList = (list: any[]) => (Array.isArray(list) ? list : []);

  const REPORT_JSON = React.useMemo(() => {
    if (!selectedProfile) return null;
    return {
      prospect: {
        initials: selectedProfile.name
          ? selectedProfile.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "NA",
        name: selectedProfile.name || "Unknown",
        title: selectedProfile.designation || "-",
        company: selectedProfile.currentCompanyName || "-",
        location: selectedProfile.location || "-",
        tenure: "-",
        timestamp: `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      },
      warmCallScore: {
        score: (selectedProfile as any).warmCallScore || 0,
        outOf: 100,
        highlights: [],
        recommendation:
          "Review recent news and profile summary for engagement opportunities.",
      },
      profileSummary: {
        currentRole: `${selectedProfile.designation || "Role N/A"} @ ${selectedProfile.currentCompanyName || "Company N/A"}`,
        tenure: "N/A",
        productFit: safeList((selectedProfile as any).productFit),
        productFitAnalysis: (selectedProfile as any).productFitAnalysis || null,
        quickMetrics: {
          meetingsLast30Days: 0,
          warmContacts: 0,
        },
        topTopics: [],
        recentPost:
          (selectedProfile as any).recentPost ||
          (selectedProfile as any).recentNews?.[0]?.description ||
          "No recent activity detected.",
      },
      recentNews: safeList((selectedProfile as any).recentNews).map(
        (news: any) => ({
          category: "News",
          title: news.title || "No Title",
          summary: news.description || "No description available",
          date: news.date || "Recent",
          url: news.url || null,
        }),
      ),
      industryOutlook: safeList((selectedProfile as any).industryOutlook),
      financialSnapshot: safeList((selectedProfile as any).financialSnapshot),
      conversations: safeList(
        (selectedProfile as any).conversationStarters,
      ).map((c: any) => ({
        question: c.text,
        tag: c.label,
        description: c.why?.join(" • "),
        salesFramework: c.cialdini,
      })),
      objections: safeList((selectedProfile as any).objections).map(
        (o: any) => ({
          objection: o.objection,
          counter: o.counter,
          matchingDescription: o.whyWorks?.join(" • "),
          type: o.cialdini,
        }),
      ),
      timing: (selectedProfile as any).timing || {},
      recommendationBody:
        (selectedProfile as any).actionRecommendation ||
        "No specific recommendation generated.",
    };
  }, [selectedProfile]);

  // Helper function to get section content by name using PLAYLIST
  const getSectionContent = React.useCallback(
    (
      sectionName: string,
      playlist: Array<{ id: string; title: string; getText: () => string }>,
    ): string | null => {
      if (!playlist || playlist.length === 0) return null;

      const normalizedSectionName = sectionName.toLowerCase().trim();

      // Map common section name variations to PLAYLIST IDs
      const sectionNameMap: Record<string, string> = {
        recentnews: "recentNews",
        "recent news": "recentNews",
        conversationstarters: "conversations",
        "conversation starters": "conversations",
        conversations: "conversations",
        financialsnapshot: "financialSnapshot",
        "financial snapshot": "financialSnapshot",
        productfit: "productFit",
        "product fit": "productFit",
        "strategic product fit": "productFit",
        industryoutlook: "industryOutlook",
        "industry outlook": "industryOutlook",
        objections: "objections",
        "objection handling": "objections",
        psychologyapproach: "psychologyApproach",
        "psychology approach": "psychologyApproach",
        competencies: "competencies",
        "core competencies": "competencies",
        skills: "competencies",
        recommendation: "recommendation",
        "ai recommendation": "recommendation",
        "action recommendation": "recommendation",
        profileoverview: "profileOverview",
        "profile overview": "profileOverview",
        overview: "profileOverview",
      };

      // Check if the text matches any section name
      let mappedSectionName =
        sectionNameMap[normalizedSectionName] || normalizedSectionName;

      // Find matching item
      const matchingItem = playlist.find(
        (item) =>
          item.id.toLowerCase() === mappedSectionName ||
          item.id.toLowerCase().replace(/\s+/g, "") ===
            mappedSectionName.replace(/\s+/g, "") ||
          item.title.toLowerCase() === mappedSectionName ||
          item.title.toLowerCase().includes(mappedSectionName) ||
          mappedSectionName.includes(item.id.toLowerCase()) ||
          mappedSectionName.includes(item.title.toLowerCase()),
      );

      return matchingItem ? matchingItem.getText() : null;
    },
    [],
  );

  const PLAYLIST = React.useMemo(() => {
    if (!selectedProfile || !REPORT_JSON) return [];
    return [
      {
        id: "profileOverview",
        title: "Profile Overview",
        getText: () => {
          const skills = (
            (selectedProfile as any).allSkills ||
            (selectedProfile as any).topSkills ||
            []
          ).join(", ");
          return `Summary: ${selectedProfile.about || "No detailed summary available"}. Core Competencies: ${skills}`;
        },
      },
      {
        id: "financialSnapshot",
        title: "Financial Snapshot",
        getText: () => {
          const text = REPORT_JSON.financialSnapshot
            .map((item: any) => {
              const parts: string[] = [];
              const labelMap: any = {
                revenue: "Revenue",
                profit: "Profit",
                growth: "Growth",
                debt: "Debt",
                marketCap: "Market Cap",
                profitMargin: "Profit Margin",
                roe: "ROE",
                roce: "ROCE",
                peRatio: "PE Ratio",
                budget: "Budget",
              };
              Object.entries(item).forEach(([k, v]) => {
                if (v && v !== "N/A" && labelMap[k]) {
                  parts.push(`${labelMap[k]}: ${v}`);
                }
              });
              return parts.join(", ");
            })
            .join(". ");
          return text || "No financial data available.";
        },
      },
      {
        id: "productFit",
        title: "Strategic Product Fit",
        getText: () => {
          // Use productFit array if available, otherwise fall back to productFitAnalysis
          const productFitArray = REPORT_JSON.profileSummary.productFit;
          const analysis =
            productFitArray && productFitArray.length > 0
              ? productFitArray[selectedProductIndex]
              : REPORT_JSON.profileSummary.productFitAnalysis;

          if (!analysis) return "No evaluation data available.";

          const productName = analysis?.productName || "";
          const rating = analysis?.rating || "Strong Fit";
          const score = analysis?.score || 0;
          const features = safeList(analysis?.features).join(", ");
          const valueProp =
            analysis?.valueProps?.time || "Strategic efficiency";
          const differentiators = safeList(analysis?.differentiators).join(
            ", ",
          );
          return `${productName ? `Product: ${productName}. ` : ""}Fit Rating: ${rating} with a score of ${score}%. Features: ${features}. Key Value Prop: ${valueProp}. Differentiators: ${differentiators}`;
        },
      },
      {
        id: "competencies",
        title: "Core Competencies",
        getText: () => {
          const skills = (
            (selectedProfile as any).allSkills ||
            (selectedProfile as any).topSkills ||
            []
          ).join(", ");
          return skills || "No skills detected.";
        },
      },
      {
        id: "recentNews",
        title: "Recent Company News",
        getText: () => {
          const text = REPORT_JSON.recentNews
            .map((n) => `${n.title}. ${n.summary}`)
            .join(". ");
          return text || "No recent news found.";
        },
      },
      {
        id: "industryOutlook",
        title: "Industry Outlook",
        getText: () => {
          const text = REPORT_JSON.industryOutlook
            .map(
              (item: any) =>
                `${item.title || ""}. ${item.description || (typeof item === "string" ? item : "")}`,
            )
            .join(". ");
          return text || "No outlook data available.";
        },
      },
      {
        id: "conversations",
        title: "Conversation Starters",
        getText: () => {
          const text = REPORT_JSON.conversations
            .map((item: any) => `${item.question}`)
            .join(". ");
          return text || "No openers available.";
        },
      },
      {
        id: "psychologyApproach",
        title: "Psychology Approach",
        getText: () => {
          const text = safeList(
            (selectedProfile as any).psychologyApproach?.dos,
          )
            .map((item: string) => `Do: ${item}`)
            .concat(
              safeList((selectedProfile as any).psychologyApproach?.donts).map(
                (item: string) => `Don't: ${item}`,
              ),
            )
            .join(". ");
          return text || "No strategy data available.";
        },
      },
      {
        id: "objections",
        title: "Objection Handling / Role Play",
        getText: () => {
          const text = REPORT_JSON.objections
            .map((o) => `Objection: ${o.objection}. Strategy: ${o.counter}`)
            .join(". ");
          return text || "No objections predicted.";
        },
      },
      {
        id: "recommendation",
        title: "AI Action Recommendation",
        getText: () => REPORT_JSON.recommendationBody,
      },
    ];
  }, [selectedProfile, REPORT_JSON]);

  // Text-to-speech helpers
  const startSpeechFromIndex = (
    text: string,
    index: number,
    sectionId: string,
  ) => {
    window.speechSynthesis.cancel();
    const textToSpeak = text.slice(index);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onboundary = (event: any) => {
      setCurrentCharIndex(index + event.charIndex);
    };
    utterance.onend = () => {
      setSpeakingSection(null);
      setCurrentText("");
      setCurrentCharIndex(0);
    };
    window.speechSynthesis.speak(utterance);
    setIsPaused(false);
  };

  useEffect(() => {
    if (playAllIndex !== null && playAllIndex < PLAYLIST.length) {
      const item = PLAYLIST[playAllIndex];
      handleSpeak(item.getText(), item.id, item.title, true);
    } else if (playAllIndex !== null && playAllIndex >= PLAYLIST.length) {
      setPlayAllIndex(null);
    }
  }, [playAllIndex, PLAYLIST]);

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

  // Handle initial state before fetch starts to avoid flicker
  if (!selectedProfile && !loading && id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!selectedProfile || !REPORT_JSON) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-gray-500">No profile data found.</div>
      </div>
    );
  }

  if (selectedProfile?.status === "NEW") {
    return <TutorialComponent />;
  }

  const handleSaveNote = async () => {
    if (!note.trim() || !id) return;

    try {
      await api.post(`profiles/${id}/notes`, {
        text: note,
        date: new Date().toISOString(),
      });

      setObservations([
        ...observations,
        { text: note, time: new Date().toLocaleTimeString() },
      ]);
      setNote("");
      toast.success("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note. Please try again.");
    }
  };

  const handleSpeak = (
    text: string,
    sectionId: string,
    sectionTitle: string,
    isAutoPlay = false,
  ) => {
    if ("speechSynthesis" in window) {
      // If manually clicked while playing all, stop sequence unless it's the auto-trigger
      if (!isAutoPlay && playAllIndex !== null) {
        setPlayAllIndex(null);
      }

      if (speakingSection === sectionId && !isAutoPlay) {
        window.speechSynthesis.cancel();
        setSpeakingSection(null);
        setCurrentText("");
        setCurrentCharIndex(0);
        setIsPaused(false);
      } else {
        window.speechSynthesis.cancel();
        setCurrentText(text);
        setSpeakingSection(sectionId);
        setSpeakingSectionTitle(sectionTitle);
        setCurrentCharIndex(0);
        setIsPaused(false);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onboundary = (event) => {
          setCurrentCharIndex(event.charIndex);
        };
        utterance.onend = () => {
          setSpeakingSection(null);
          setCurrentText("");
          setCurrentCharIndex(0);
          if (isAutoPlay) {
            setPlayAllIndex((prev) => (prev !== null ? prev + 1 : null));
          }
        };
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.warn("Text-to-speech not supported.");
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleGenerateProposal = async () => {
    if (!id || !selectedProfile) {
      toast.error("Profile or ID missing");
      return;
    }

    const productFitArray = safeList((selectedProfile as any).productFit);
    const currentProduct =
      productFitArray && productFitArray.length > 0
        ? productFitArray[selectedProductIndex]
        : (selectedProfile as any).productFitAnalysis;

    const productId = currentProduct?.id || currentProduct?._id || currentProduct?.productId;

    if (!productId) {
      toast.error("Product ID missing for the selected fit");
      return;
    }

    try {
      setIsGeneratingProposal(true);
      const loadingToast = toast.loading("Generating proposal...");

      const response = await api.post<string>(
        endpoints.generateProductFitProposal,
        {
          profileId: id,
          productId: productId,
          input: "",
        },
        {
          accept: "text/html",
        }
      );

      toast.dismiss(loadingToast);

      if (!response) {
        throw new Error("Empty response from proposal API");
      }

      // Dynamic import of html2pdf.js
      const html2pdf = (await import("html2pdf.js")).default;

      // Create temporary element to hold HTML
      const element = document.createElement("div");
      element.id = "proposal-temp-container";
      element.innerHTML = response;
      document.body.appendChild(element);

      const opt = {
        margin: 10,
        filename: "Sales_Proposal.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      } as const;

      await html2pdf().set(opt).from(element).save();

      // Clean up
      document.body.removeChild(element);
      toast.success("Proposal generated successfully!");
    } catch (error: any) {
      console.error("Proposal generation error:", error);
      toast.error(error?.message || "Failed to generate proposal");
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleSkip = (direction: "forward" | "backward") => {
    const offset = direction === "forward" ? 100 : -100;
    const newIndex = Math.max(
      0,
      Math.min(currentText.length - 1, currentCharIndex + offset),
    );
    setCurrentCharIndex(newIndex);

    window.speechSynthesis.cancel();
    const remainingText = currentText.slice(newIndex);
    const utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.onboundary = (event) => {
      setCurrentCharIndex(newIndex + event.charIndex);
    };
    utterance.onend = () => {
      setSpeakingSection(null);
      setCurrentText("");
      setCurrentCharIndex(0);
    };
    window.speechSynthesis.speak(utterance);
    setIsPaused(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value);
    setCurrentCharIndex(newIndex);

    window.speechSynthesis.cancel();
    const remainingText = currentText.slice(newIndex);
    const utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.onboundary = (event) => {
      setCurrentCharIndex(newIndex + event.charIndex);
    };
    utterance.onend = () => {
      setSpeakingSection(null);
      setCurrentText("");
      setCurrentCharIndex(0);
    };
    window.speechSynthesis.speak(utterance);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6 lg:p-8 pt-20 lg:pt-8 font-sans">
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Actions */}
        <div
          id="report-header"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-2"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-medium hidden sm:inline">
              Back to Dashboard
            </span>
            <span className="font-medium sm:hidden">Back</span>
          </button>
          <div
            id="action-bar"
            className="flex flex-wrap items-center gap-2 w-full sm:w-auto"
          >
            <button
              onClick={startVoiceDictation}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm transition ${
                isProcessingVoice || isPlayingVoice
                  ? "text-red-500 border-red-200 hover:bg-red-50"
                  : isListening
                    ? "text-red-500 border-red-200 animate-pulse"
                    : "text-gray-400 hover:text-blue-600 hover:border-blue-200"
              }`}
              title={
                isPlayingVoice
                  ? "Stop Playing"
                  : isProcessingVoice
                    ? "Processing..."
                    : isListening
                      ? "Stop Listening"
                      : "Voice Note"
              }
            >
              {isPlayingVoice ? (
                <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : isProcessingVoice ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : isListening ? (
                <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            <button
              onClick={() => {
                if (id) {
                  const isArchivedParam = searchParams.get("isArchived") === "true";
                  dispatch(fetchProfileById({ id, isArchived: isArchivedParam }));
                }
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition"
              title="Refresh Data"
            >
              <RotateCw
                className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={() => setShowGuide(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition"
              title="Help / Tour"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => {
                if (playAllIndex !== null) {
                  setPlayAllIndex(null);
                  window.speechSynthesis.cancel();
                  setSpeakingSection(null);
                } else {
                  setPlayAllIndex(0);
                }
              }}
              className={`h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 ${playAllIndex !== null ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-blue-600"} border rounded-xl text-xs sm:text-sm font-bold shadow-sm transition`}
            >
              {playAllIndex !== null ? (
                <>
                  <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  <span className="hidden sm:inline">Stop Playing</span>
                  <span className="sm:hidden">Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  <span className="hidden sm:inline">Play Report</span>
                  <span className="sm:hidden">Play</span>
                </>
              )}
            </button>

            <div
              className="relative group/connect"
              ref={connectButtonRef}
              onMouseEnter={calculateDropdownPosition}
            >
              <button className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 shadow-sm transition">
                <span className="material-symbols-outlined text-base sm:text-lg">
                  contact_mail
                </span>
                <span className="hidden sm:inline">Connect</span>
              </button>

              {/* Hover Dropdown */}
              <div
                className={`absolute right-0 w-[220px] ${dropdownDirection === "up" ? "bottom-full mb-2" : "top-full pt-2"} opacity-0 invisible group-hover/connect:opacity-100 group-hover/connect:visible transition-all duration-300 z-50`}
              >
                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                  <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                    Quick Connect
                  </div>
                  <a
                    href={`mailto:${selectedProfile?.email || ""}?subject=${encodeURIComponent(`Following up from Magic Carpet: ${selectedProfile?.name || ""}`)}&body=${encodeURIComponent(`Hi ${selectedProfile?.name || ""},\n\nI was just reviewing some AI-generated insights regarding ${selectedProfile?.currentCompanyName || "your company"} on Magic Carpet and thought it would be great to connect.\n\nLooking forward to hearing from you!`)}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-100 transition">
                      <span className="material-symbols-outlined text-xl text-blue-600">
                        email
                      </span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight">
                      Email Prospect
                    </span>
                  </a>
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-600 transition group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center group-hover/item:bg-green-100 transition">
                      <span className="material-symbols-outlined text-xl text-green-600">
                        video_call
                      </span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight">
                      Google Meet
                    </span>
                  </a>
                  <a
                    href="https://teams.microsoft.com/l/meeting/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover/item:bg-indigo-100 transition">
                      <span className="material-symbols-outlined text-xl text-indigo-600">
                        groups
                      </span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight">
                      MS Teams
                    </span>
                  </a>
                  <a
                    href="https://zoom.us/start/videomeeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-50 text-gray-700 hover:text-sky-600 transition group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center group-hover/item:bg-sky-100 transition">
                      <span className="material-symbols-outlined text-xl text-sky-600">
                        videocam
                      </span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight">
                      Zoom Meeting
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportPDF}
              className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 shadow-sm transition no-print"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">
                ios_share
              </span>
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={() => router.push(`/send-email?id=${id}`)}
              className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 bg-blue-600 border border-blue-700 rounded-xl text-xs sm:text-sm font-bold text-white hover:bg-blue-700 shadow-sm transition active:scale-95"
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">Send Email</span>
              <span className="sm:hidden">Email</span>
            </button>
          </div>
        </div>

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
                    <span className="material-symbols-outlined text-lg text-blue-500">
                      work
                    </span>
                    {REPORT_JSON.prospect.title} @{" "}
                    {REPORT_JSON.prospect.company}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg text-blue-500">
                      location_on
                    </span>
                    {REPORT_JSON.prospect.location}
                  </div>
                </div>
              </div>
            </div>

            <div
              id="warm-call-score"
              className="flex flex-col items-center md:items-end gap-3 shrink-0"
            >
              <div className="flex flex-col items-center md:items-end">
                <ScoreGauge
                  score={REPORT_JSON.warmCallScore.score}
                  size={140}
                  title="Warm Call Score"
                />
              </div>
              {/* <div className="flex gap-2 mt-4">
                                <div className="p-2 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-orange-900 px-1">MEETINGS: -</span>
                                </div>
                                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-blue-900 px-1">CONTACTS: -</span>
                                </div>
                            </div> */}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Row 1: Profile & Financials */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm transition-all hover:shadow-md h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs uppercase font-black text-gray-900 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Profile Overview
                  </h3>
                  <button
                    onClick={() => {
                      const skills = (
                        (selectedProfile as any).allSkills ||
                        (selectedProfile as any).topSkills ||
                        []
                      ).join(", ");
                      const textToSpeak = `Summary: ${selectedProfile.about || "No detailed summary available"}. Core Competencies: ${skills}`;
                      handleSpeak(
                        textToSpeak,
                        "profileOverview",
                        "Profile Overview",
                      );
                    }}
                    id="listen-button"
                    className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === "profileOverview" ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-600 border border-gray-100 hover:text-blue-600 hover:bg-blue-50"}`}
                  >
                    {speakingSection === "profileOverview" ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 text-sm leading-relaxed border border-gray-100 italic font-medium">
                  "
                  {selectedProfile.about ||
                    "No detailed summary available for this profile. Strategic insights may be limited."}
                  "
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 relative group">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden flex flex-col h-full lg:absolute lg:inset-0 bg-white transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-30 blur-2xl group-hover:bg-green-100 transition-all" />
                <div className="flex items-center justify-between mb-6 relative z-10 shrink-0">
                  <h3 className="font-black text-gray-900 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-green-600 text-xl">
                      finance
                    </span>
                    Financial Snapshot
                  </h3>
                  <button
                    onClick={() => {
                      const textToSpeak = REPORT_JSON.financialSnapshot
                        .map((item: any) => {
                          const parts: string[] = [];
                          const labelMap: any = {
                            revenue: "Revenue",
                            profit: "Profit",
                            growth: "Growth",
                            debt: "Debt",
                            marketCap: "Market Cap",
                            profitMargin: "Profit Margin",
                            roe: "ROE",
                            roce: "ROCE",
                            peRatio: "PE Ratio",
                            budget: "Budget",
                          };
                          Object.entries(item).forEach(([k, v]) => {
                            if (v && v !== "N/A" && labelMap[k]) {
                              parts.push(`${labelMap[k]}: ${v}`);
                            }
                          });
                          return parts.join(", ");
                        })
                        .join(". ");
                      handleSpeak(
                        textToSpeak || "No financial data available.",
                        "financialSnapshot",
                        "Financial Snapshot",
                      );
                    }}
                    className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === "financialSnapshot" ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-600 border border-gray-100 hover:text-green-600 hover:bg-green-50"}`}
                  >
                    {speakingSection === "financialSnapshot" ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1">
                  {REPORT_JSON.financialSnapshot.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {REPORT_JSON.financialSnapshot.map(
                        (item: any, i: number) => (
                          <React.Fragment key={i}>
                            {[
                              {
                                key: "revenue",
                                label: "Est. Revenue",
                                icon: "payments",
                                color: "text-emerald-600",
                                bg: "bg-emerald-50",
                              },
                              {
                                key: "profit",
                                label: "Net Profit",
                                icon: "add_chart",
                                color: "text-green-600",
                                bg: "bg-green-50",
                              },
                              {
                                key: "growth",
                                label: "Growth Index",
                                icon: "trending_up",
                                color: "text-blue-600",
                                bg: "bg-blue-50",
                              },
                              {
                                key: "marketCap",
                                label: "Market Cap",
                                icon: "account_balance",
                                color: "text-indigo-600",
                                bg: "bg-indigo-50",
                              },
                              {
                                key: "debt",
                                label: "Total Debt",
                                icon: "money_off",
                                color: "text-red-500",
                                bg: "bg-red-50",
                              },
                              {
                                key: "profitMargin",
                                label: "Profit Margin",
                                icon: "percent",
                                color: "text-teal-600",
                                bg: "bg-teal-50",
                              },
                              {
                                key: "roe",
                                label: "ROE",
                                icon: "account_balance_wallet",
                                color: "text-purple-600",
                                bg: "bg-purple-50",
                              },
                              {
                                key: "roce",
                                label: "ROCE",
                                icon: "currency_exchange",
                                color: "text-violet-600",
                                bg: "bg-violet-50",
                              },
                              {
                                key: "peRatio",
                                label: "P/E Ratio",
                                icon: "analytics",
                                color: "text-amber-600",
                                bg: "bg-amber-50",
                              },
                              {
                                key: "budget",
                                label: "Budget",
                                icon: "savings",
                                color: "text-orange-600",
                                bg: "bg-orange-50",
                              },
                            ].map((m) => {
                              const val = item[m.key];
                              if (
                                !val ||
                                val === "0" ||
                                (val === "N/A" && i > 0)
                              )
                                return null;
                              const isNA = val === "N/A";
                              return (
                                <div
                                  key={m.key}
                                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between group/item hover:shadow-md ${isNA ? "bg-gray-50 border-gray-100 opacity-60" : `${m.bg} border-transparent hover:bg-white hover:border-current`}`}
                                  style={{
                                    borderColor: !isNA
                                      ? "transparent"
                                      : undefined,
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${isNA ? "bg-gray-200 text-gray-400" : `${m.bg} ${m.color} group-hover/item:scale-110 transition-transform`}`}
                                    >
                                      <span className="material-symbols-outlined text-lg">
                                        {m.icon}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                        {m.label}
                                      </div>
                                      <div
                                        className={`font-black text-sm transition-colors ${isNA ? "text-gray-300 italic" : `${m.color}`}`}
                                      >
                                        {val}
                                      </div>
                                    </div>
                                  </div>
                                  {!isNA && (
                                    <span
                                      className={`material-symbols-outlined text-xs opacity-0 group-hover/item:opacity-100 transition-opacity ${m.color}`}
                                    >
                                      arrow_forward_ios
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </React.Fragment>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-400 italic text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      Financial data is not publicly available for this company.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Strategic Insights (Product Fit & Competencies) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm leading-none">
                      star
                    </span>
                    Strategic Product Fit
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerateProposal}
                      disabled={isGeneratingProposal}
                      className={`h-8 px-3 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm text-[10px] font-black uppercase tracking-tight ${
                        isGeneratingProposal
                          ? "bg-gray-100 text-gray-400 border border-gray-200"
                          : "bg-emerald-600 border border-emerald-700 text-white hover:bg-emerald-700 hover:shadow-md"
                      }`}
                      title="Generate Proposal PDF"
                    >
                      {isGeneratingProposal ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-sm leading-none">
                          description
                        </span>
                      )}
                      <span>
                        {isGeneratingProposal
                          ? "Generating..."
                          : "Generate Proposal"}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        const productFitArray =
                          REPORT_JSON.profileSummary.productFit;
                        const analysis =
                          productFitArray && productFitArray.length > 0
                            ? productFitArray[selectedProductIndex]
                            : REPORT_JSON.profileSummary.productFitAnalysis;

                        if (!analysis) {
                          handleSpeak(
                            "No evaluation data available.",
                            "productFit",
                            "Strategic Product Fit",
                          );
                          return;
                        }

                        const productName = analysis?.productName || "";
                        const rating = analysis?.rating || "Strong Fit";
                        const score = analysis?.score || 0;
                        const features = safeList(analysis?.features).join(", ");
                        const valueProp =
                          analysis?.valueProps?.time || "Strategic efficiency";
                        const differentiators = safeList(
                          analysis?.differentiators,
                        ).join(", ");

                        const textToSpeak = `${productName ? `Product: ${productName}. ` : ""}Fit Rating: ${rating} with a score of ${score}%. Features: ${features}. Key Value Prop: ${valueProp}. Differentiators: ${differentiators}`;
                        handleSpeak(
                          textToSpeak,
                          "productFit",
                          "Strategic Product Fit",
                        );
                      }}
                      className={`p-1.5 rounded-lg transition-all active:scale-95 ${speakingSection === "productFit" ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100 hover:text-blue-600 hover:bg-blue-50"}`}
                    >
                      {speakingSection === "productFit" ? (
                        <Square className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Tabs - Only show if productFit array exists and has multiple products */}
                {REPORT_JSON.profileSummary.productFit &&
                  REPORT_JSON.profileSummary.productFit.length > 0 && (
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {REPORT_JSON.profileSummary.productFit.map(
                        (product: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedProductIndex(index)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                              selectedProductIndex === index
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {product.productName || `Product ${index + 1}`}
                          </button>
                        ),
                      )}
                    </div>
                  )}

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                  {(() => {
                    // Get the current product to display
                    const productFitArray =
                      REPORT_JSON.profileSummary.productFit;
                    const currentProduct =
                      productFitArray && productFitArray.length > 0
                        ? productFitArray[selectedProductIndex]
                        : REPORT_JSON.profileSummary.productFitAnalysis;

                    return currentProduct ? (
                      <div className="space-y-6">
                        {/* Score and Rating */}
                        <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                          <div className="shrink-0 flex items-center justify-center">
                            <ScoreGauge
                              score={currentProduct?.score || 0}
                              size={100}
                              showPercentage={true}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">
                              Product Overview
                            </div>
                            <div className="text-lg font-black text-gray-900 leading-tight mb-2">
                              {currentProduct?.productName ||
                                currentProduct?.rating ||
                                "Product Analysis"}
                            </div>
                            <div className="text-[11px] text-gray-600 leading-relaxed font-bold">
                              {currentProduct?.rating ||
                                "Evaluation results for the current strategic fit."}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column: Features & Value Props */}
                          <div className="space-y-6">
                            <div>
                              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">
                                  extension
                                </span>
                                Target Capabilities
                              </h5>
                              <div className="space-y-2">
                                {safeList(currentProduct?.features).length >
                                0 ? (
                                  safeList(currentProduct.features).map(
                                    (f, i) => (
                                      <div
                                        key={i}
                                        className="flex items-start gap-2 text-[11px] font-bold text-gray-700 leading-tight"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        {f}
                                      </div>
                                    ),
                                  )
                                ) : (
                                  <div className="text-[10px] text-gray-400 italic">
                                    No features identified
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">
                                  bolt
                                </span>
                                Core Value Pillars
                              </h5>
                              <div className="grid grid-cols-1 gap-2">
                                {currentProduct?.valueProps &&
                                Object.keys(currentProduct.valueProps).length >
                                  0 ? (
                                  Object.entries(currentProduct.valueProps).map(
                                    ([k, v]) => (
                                      <div
                                        key={k}
                                        className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1"
                                      >
                                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">
                                          {k} Impact
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-800 leading-tight">
                                          {((v as string) || "TBD")
                                            .split(/(\d+%?)/g)
                                            .map((part, idx) =>
                                              /\d+%?/.test(part) ? (
                                                <span
                                                  key={idx}
                                                  className="font-black text-blue-600"
                                                >
                                                  {part}
                                                </span>
                                              ) : (
                                                <span key={idx}>{part}</span>
                                              ),
                                            )}
                                        </span>
                                      </div>
                                    ),
                                  )
                                ) : (
                                  <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">
                                      Impact data pending
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Pain Points & Proof */}
                          <div className="space-y-6">
                            <div>
                              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 text-red-600">
                                <span className="material-symbols-outlined text-[14px]">
                                  error_outline
                                </span>
                                Strategic Pains
                              </h5>
                              <div className="space-y-3">
                                {safeList(currentProduct?.painPoints).length >
                                0 ? (
                                  safeList(currentProduct.painPoints).map(
                                    (p, i) => {
                                      const [main, sub] = p.split(" (");
                                      return (
                                        <div
                                          key={i}
                                          className="flex flex-col gap-1"
                                        >
                                          <div className="flex items-start gap-2 text-[11px] font-bold text-gray-800 leading-tight">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                            {main}
                                          </div>
                                          {sub && (
                                            <div className="ml-3.5 text-[9px] font-black text-blue-500 uppercase tracking-tighter italic">
                                              Map: {sub.replace(")", "")}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    },
                                  )
                                ) : (
                                  <div className="text-[10px] text-gray-400 italic">
                                    No strategic pains identified
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 text-indigo-600">
                                <span className="material-symbols-outlined text-[14px]">
                                  groups
                                </span>
                                Evidence / proof
                              </h5>
                              <div className="space-y-2">
                                {safeList(currentProduct?.socialProof).length >
                                0 ? (
                                  safeList(currentProduct.socialProof).map(
                                    (s, i) => (
                                      <div
                                        key={i}
                                        className="p-2.5 rounded-xl bg-indigo-50/30 border border-indigo-100 flex items-start gap-2"
                                      >
                                        <span className="material-symbols-outlined text-indigo-500 text-xs mt-0.5">
                                          verified
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-700 italic leading-tight">
                                          {s}
                                        </span>
                                      </div>
                                    ),
                                  )
                                ) : (
                                  <div className="text-[10px] text-gray-400 italic">
                                    No social proof available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Differentiators Footer */}
                        {safeList(currentProduct?.differentiators).length >
                          0 && (
                          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                            {safeList(currentProduct.differentiators).map(
                              (d, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                                >
                                  <span className="material-symbols-outlined text-[12px]">
                                    verified
                                  </span>
                                  {d}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 opacity-60">
                        <span className="material-symbols-outlined text-gray-400 text-3xl mb-1">
                          query_stats
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Awaiting Analysis...
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm leading-none">
                      verified_user
                    </span>
                    Core Competencies
                  </h4>
                  <button
                    onClick={() => {
                      const skills = (
                        (selectedProfile as any).allSkills ||
                        (selectedProfile as any).topSkills ||
                        []
                      ).join(", ");
                      handleSpeak(
                        skills || "No skills detected.",
                        "competencies",
                        "Core Competencies",
                      );
                    }}
                    className={`p-1.5 rounded-lg transition-all active:scale-95 ${speakingSection === "competencies" ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100 hover:text-blue-600 hover:bg-blue-50"}`}
                  >
                    {speakingSection === "competencies" ? (
                      <Square className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 flex-1 content-start">
                  {((selectedProfile as any).allSkills ||
                    (selectedProfile as any).topSkills) &&
                  (
                    (selectedProfile as any).allSkills ||
                    (selectedProfile as any).topSkills
                  ).length > 0 ? (
                    (
                      (selectedProfile as any).allSkills ||
                      (selectedProfile as any).topSkills
                    ).map((t: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-[10px] font-black border border-gray-200 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all cursor-default uppercase tracking-tight flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-blue-400" />
                        {t}
                      </span>
                    ))
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 opacity-60">
                      <span className="material-symbols-outlined text-gray-400 text-2xl mb-1">
                        psychology
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        No skills detected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Recent News & Industry Outlook */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-black text-gray-900 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-blue-600 text-xl">
                      newspaper
                    </span>
                    Recent Company News
                  </h3>
                  <button
                    onClick={() => {
                      const textToSpeak = REPORT_JSON.recentNews
                        .map((n) => `${n.title}. ${n.summary}`)
                        .join(". ");
                      handleSpeak(
                        textToSpeak || "No recent news found.",
                        "recentNews",
                        "Recent Company News",
                      );
                    }}
                    className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === "recentNews" ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-600 border border-gray-100 hover:text-blue-600 hover:bg-blue-50"}`}
                  >
                    {speakingSection === "recentNews" ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40">
                    <div className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1.5">
                      Context Analysis
                    </div>
                    <div className="text-xs text-gray-700 leading-relaxed font-bold">
                      {REPORT_JSON.profileSummary.recentPost}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {REPORT_JSON.recentNews.length > 0 ? (
                      REPORT_JSON.recentNews.map((n: any, i: number) => (
                        <div
                          key={i}
                          onClick={() => n.url && window.open(n.url, "_blank")}
                          className={`p-4 rounded-3xl border border-blue-50 bg-blue-50/20 hover:border-blue-200 transition-all group/news ${n.url ? "cursor-pointer" : ""}`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-blue-600">
                                article
                              </span>
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                News
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-[9px] font-black border border-blue-200 uppercase tracking-tighter">
                              {n.date}
                            </span>
                          </div>
                          <div className="text-sm font-black text-gray-900 mb-2 group-hover/news:text-blue-700 transition-colors leading-tight">
                            {n.title}
                          </div>
                          <p className="text-[10px] text-gray-500 leading-relaxed font-bold">
                            {n.summary}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 opacity-60">
                        <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
                          newspaper
                        </span>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                          No specific news items detected in the last scan.
                        </span>
                      </div>
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
                    <span className="material-symbols-outlined text-purple-600 text-xl">
                      insights
                    </span>
                    Industry Outlook
                  </h3>
                  <button
                    onClick={() => {
                      const textToSpeak = REPORT_JSON.industryOutlook
                        .map(
                          (item: any) =>
                            `${item.title || ""}. ${item.description || (typeof item === "string" ? item : "")}`,
                        )
                        .join(". ");
                      handleSpeak(
                        textToSpeak || "No outlook data available.",
                        "industryOutlook",
                        "Industry Outlook",
                      );
                    }}
                    className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === "industryOutlook" ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-600 border border-gray-100 hover:text-purple-600 hover:bg-purple-50"}`}
                  >
                    {speakingSection === "industryOutlook" ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="space-y-3 relative z-10 h-[315px] overflow-y-auto custom-scrollbar pr-2">
                  {REPORT_JSON.industryOutlook.length > 0 ? (
                    REPORT_JSON.industryOutlook.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="flex gap-3 items-start p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-300 hover:bg-white transition-all"
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <div className="text-[11px] text-gray-800 leading-relaxed font-black uppercase tracking-tight">
                          {item.description ||
                            (typeof item === "string"
                              ? item
                              : "No detailed description available.")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-gray-400 italic text-center py-10">
                      No specific outlook factors were identified in the current
                      report.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Conversation Starters & Psychology */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-gray-900 text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-xl">
                      chat_bubble
                    </span>
                    Conversation Starters
                  </h3>
                  <button
                    onClick={() => {
                      const textToSpeak = REPORT_JSON.conversations
                        .map((item: any) => `${item.question}`)
                        .join(". ");
                      handleSpeak(
                        textToSpeak || "No openers available.",
                        "conversations",
                        "Conversation Starters",
                      );
                    }}
                    className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === "conversations" ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-600 border border-gray-100 hover:text-blue-600 hover:bg-blue-50"}`}
                  >
                    {speakingSection === "conversations" ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REPORT_JSON.conversations.length > 0 ? (
                    REPORT_JSON.conversations.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-3xl border border-blue-50 bg-blue-50/20 hover:border-blue-200 transition-all group/starter"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-blue-600">
                              tips_and_updates
                            </span>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                              {item.tag || "Opener"}
                            </span>
                          </div>
                          {item.salesFramework && (
                            <span className="px-1.5 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-[9px] font-black border border-blue-200 uppercase tracking-tighter">
                              {item.salesFramework}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-black text-gray-900 mb-2 italic group-hover/starter:text-blue-700 transition-colors">
                          "{item.question}"
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-bold flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-xs text-gray-400 mt-0.5">
                            info
                          </span>
                          <span>
                            <span className="text-gray-400 uppercase tracking-tight">
                              Context:
                            </span>{" "}
                            {item.description}
                          </span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 opacity-60">
                      <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
                        forum
                      </span>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        No conversation starters generated
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-black text-gray-900 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-orange-600 text-xl">
                      psychology
                    </span>
                    Psychology Approach
                  </h3>
                  <button
                    onClick={() => {
                      const textToSpeak = safeList(
                        (selectedProfile as any).psychologyApproach?.dos,
                      )
                        .map((item: string) => `Do: ${item}`)
                        .concat(
                          safeList(
                            (selectedProfile as any).psychologyApproach?.donts,
                          ).map((item: string) => `Don't: ${item}`),
                        )
                        .join(". ");
                      handleSpeak(
                        textToSpeak || "No strategy data available.",
                        "psychologyApproach",
                        "Psychology Approach",
                      );
                    }}
                    className={`p-1.5 rounded-lg transition-all active:scale-95 ${speakingSection === "psychologyApproach" ? "text-red-600 bg-red-50" : "text-gray-400 hover:text-orange-600"}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {safeList((selectedProfile as any).psychologyApproach?.dos)
                    .length > 0 ||
                  safeList((selectedProfile as any).psychologyApproach?.donts)
                    .length > 0 ? (
                    <>
                      <div>
                        <div className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">
                            thumb_up
                          </span>
                          Green Flags (Recommended)
                        </div>
                        <ul className="space-y-2.5">
                          {(selectedProfile as any).psychologyApproach?.dos &&
                          (selectedProfile as any).psychologyApproach?.dos
                            .length > 0 ? (
                            (selectedProfile as any).psychologyApproach.dos.map(
                              (item: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2.5 text-xs font-bold text-gray-700"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ),
                            )
                          ) : (
                            <li className="text-[10px] text-gray-400 italic">
                              No specific recommendations detected
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="h-px bg-gray-100" />
                      <div>
                        <div className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">
                            thumb_down
                          </span>
                          Red Flags (Avoid)
                        </div>
                        <ul className="space-y-2.5">
                          {(selectedProfile as any).psychologyApproach?.donts &&
                          (selectedProfile as any).psychologyApproach?.donts
                            .length > 0 ? (
                            (
                              selectedProfile as any
                            ).psychologyApproach.donts.map(
                              (item: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2.5 text-xs font-bold text-gray-700"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ),
                            )
                          ) : (
                            <li className="text-[10px] text-gray-400 italic">
                              No specific warnings detected
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                      <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
                        emoji_objects
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        No psychological mapping available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Objection Handling (Full Width) */}
          <div className="bg-white text-gray-900 rounded-3xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-red-100 transition-all duration-700 opacity-50" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="font-black flex items-center gap-2 text-[12px] uppercase tracking-widest text-gray-900">
                <span className="material-symbols-outlined text-red-600">
                  gavel
                </span>
                Objection Handling / Role Play
              </h3>
              <button
                onClick={() => {
                  const textToSpeak = REPORT_JSON.objections
                    .map(
                      (o) =>
                        `Objection: ${o.objection}. Strategy: ${o.counter}`,
                    )
                    .join(". ");
                  handleSpeak(
                    textToSpeak || "No objections predicted.",
                    "objections",
                    "Objection Handling / Role Play",
                  );
                }}
                className={`p-2 rounded-xl transition-all active:scale-95 ${speakingSection === "objections" ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100 hover:text-red-600 hover:bg-red-50"}`}
              >
                {speakingSection === "objections" ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {REPORT_JSON.objections.length > 0 ? (
                REPORT_JSON.objections.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-4 hover:bg-white hover:shadow-md transition-all border-l-4 border-l-red-500"
                  >
                    <div>
                      <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 shadow-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">
                          report_problem
                        </span>
                        Predicted Objection
                      </div>
                      <div className="text-base font-bold text-gray-900">
                        {item.objection}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1 shadow-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">
                          auto_fix_high
                        </span>
                        Recommended Counter
                      </div>
                      <div className="text-sm italic font-bold leading-relaxed text-gray-700">
                        "{item.counter}"
                      </div>
                      {item.matchingDescription && (
                        <div className="mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                          Strategy: {item.matchingDescription}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-16 opacity-40">
                  <span className="material-symbols-outlined text-gray-300 text-5xl mb-2">
                    shield_check
                  </span>
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                    No major objections predicted
                  </h4>
                  <p className="text-[10px] mt-1 text-gray-400">
                    Profile appears clear for direct outreach strategy.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendation Banner */}
          {/* AI Recommendation Banner */}
          <section className="bg-white text-gray-900 rounded-[2rem] p-8 border border-gray-200 shadow-sm relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-blue-100 transition-colors duration-700 opacity-50" />
            <div className="relative z-10">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100 uppercase tracking-widest">
                      AI Action Recommendation
                    </div>
                    <h3 className="text-lg font-black leading-tight max-w-2xl text-gray-900">
                      {REPORT_JSON.recommendationBody}
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      handleSpeak(
                        REPORT_JSON.recommendationBody,
                        "recommendation",
                        "AI Action Recommendation",
                      )
                    }
                    className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all active:scale-95 border border-gray-100 shrink-0 ${speakingSection === "recommendation" ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 shadow-sm"}`}
                  >
                    {speakingSection === "recommendation" ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    href={`mailto:${selectedProfile?.email || ""}?subject=${encodeURIComponent(`Following up from Magic Carpet: ${selectedProfile?.name || ""}`)}&body=${encodeURIComponent(`Hi ${selectedProfile?.name || ""},\n\nI was just reviewing some AI-generated insights regarding ${selectedProfile?.currentCompanyName || "your company"} on Magic Carpet and thought it would be great to connect.\n\nLooking forward to hearing from you!`)}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-black transition active:scale-95 uppercase tracking-widest border border-blue-100"
                  >
                    <span className="material-symbols-outlined text-lg">
                      mail
                    </span>
                    Email
                  </a>
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-black transition active:scale-95 uppercase tracking-widest border border-green-100"
                  >
                    <span className="material-symbols-outlined text-lg">
                      video_call
                    </span>
                    Meet
                  </a>
                  <a
                    href="https://teams.microsoft.com/l/meeting/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black transition active:scale-95 uppercase tracking-widest border border-indigo-100"
                  >
                    <span className="material-symbols-outlined text-lg">
                      groups
                    </span>
                    Teams
                  </a>
                  <a
                    href="https://zoom.us/start/videomeeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-black transition active:scale-95 uppercase tracking-widest border border-sky-100"
                  >
                    <span className="material-symbols-outlined text-lg">
                      videocam
                    </span>
                    Zoom
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Strategy Notes */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                <span className="material-symbols-outlined text-gray-400">
                  rate_review
                </span>
                Strategic Notes
              </h3>
              <button
                onClick={handleExportPDF}
                className="h-10 px-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-[10px] transition-all shadow-lg shadow-green-600/20 active:scale-95 uppercase tracking-widest no-print"
              >
                <span className="material-symbols-outlined text-base">
                  picture_as_pdf
                </span>
                EXPORT REPORT
              </button>
            </div>

            {observations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {observations.map((o: any, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group/note relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover/note:opacity-50 transition-all" />
                    <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 relative z-10">
                      {o.time}
                    </div>
                    <div className="text-xs font-bold text-gray-700 leading-relaxed relative z-10">
                      {o.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-8 text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <span className="material-symbols-outlined text-4xl text-gray-200 mb-2">
                  note_stack
                </span>
                <p className="text-gray-400 text-sm font-medium">
                  No strategic notes available yet.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12 relative overflow-hidden rounded-3xl bg-gray-50 border-2 border-transparent focus-within:border-blue-500 transition-all">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add strategic observations or meeting notes..."
                  className="w-full p-6 text-sm min-h-[140px] bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-400 resize-none"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <span className="text-[10px] text-gray-300 font-bold">
                    Press Send to archive
                  </span>
                  <button
                    onClick={handleSaveNote}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl">
                      send
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating TTS Player */}
        {speakingSection && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[100] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[2.5rem] p-6 shadow-2xl shadow-blue-500/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">
                      Now Playing
                    </div>
                    <h4 className="text-sm font-black text-gray-900 truncate leading-none">
                      {speakingSectionTitle}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    setSpeakingSection(null);
                    setPlayAllIndex(null);
                  }}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-gray-400 tabular-nums w-8">
                    {Math.floor(
                      (currentCharIndex / Math.max(1, currentText.length)) *
                        100,
                    ) || 0}
                    %
                  </span>
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="range"
                      min="0"
                      max={currentText.length}
                      value={currentCharIndex}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-blue-600 rounded-full pointer-events-none transition-all"
                      style={{
                        width: `${(currentCharIndex / Math.max(1, currentText.length)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 tabular-nums w-8 text-right">
                    100%
                  </span>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <button
                    onClick={() => handleSkip("backward")}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                  >
                    <Rewind className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handlePauseToggle}
                    className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    {isPaused ? (
                      <Play className="w-7 h-7 fill-current" />
                    ) : (
                      <Pause className="w-7 h-7 fill-current" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSkip("forward")}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                  >
                    <FastForward className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* <UserGuide
                steps={GUIDE_STEPS}
                isOpen={showGuide}
                onClose={() => setShowGuide(false)}
                onComplete={handleGuideComplete}
            /> */}

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
    </div>
  );
}

export default function MagicCarpetReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
